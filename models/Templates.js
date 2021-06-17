const db = require("../db/db_config");
const { v4: uuidv4 } = require("uuid");

const Locations = require("../models/Locations");

/**
 * @class Templates
 */
class Templates {
  /**
   * Creates a new template
   * @param {string} creatorID
   * @param {string} title
   * @param {string} blurb
   * @param {string} locationId
   * @param {string} locationName
   * @param {list<string>} tags
   * @param {recipients: list<object>} toRecipient
   * @param {recipients: list<object>} ccRecipient
   * @param {recipients: list<object>} bccRecipient
   * @param {string} subject
   * @param {string} content
   * @param {boolean} published
   * @returns {string} id of new template
   */
  static async addTemplate(
    creatorID,
    title,
    blurb,
    locationId,
    locationName,
    tags,
    toRecipients,
    ccRecipients,
    bccRecipients,
    subject,
    content,
    published
  ) {
    const newTitle = title.replace("'", "''");
    const newBlurb = blurb.replace("'", "''");
    const newLocation = locationName.replace("'", "''");
    const newSubject = subject.replace("'", "''");
    const newContent = content.replace("'", "''");

    const id = uuidv4();
    const time = "CURRENT_TIMESTAMP";
    // insert into templates table
    await db.run(`INSERT INTO templates
                        (id,
                        title,
                        blurb,
                        location_id,
                        published,
                        creator_id,
                        created_on,
                        subject,
                        content,
                        duplicate)
                      VALUES
                        ('${id}',
                        '${newTitle}',
                        '${newBlurb}',
                        '${locationId}',
                        '${published}',
                        '${creatorID}',
                        ${time},
                        '${newSubject}',
                        '${newContent}',
                        false);`);

    // add tags
    for (let tag of tags) {
      await this.addTag(id, tag);
    }

    // add recipient for to
    const jsonTo = JSON.stringify(toRecipients);
    await db.run(
      `INSERT INTO template_recipients VALUES('${id}', '${jsonTo}', 'to');`
    );

    // add recipient for cc
    const jsonCC = JSON.stringify(ccRecipients);
    await db.run(
      `INSERT INTO template_recipients VALUES('${id}', '${jsonCC}', 'cc');`
    );

    // add recipient for bcc
    const jsonBCC = JSON.stringify(bccRecipients);
    await db.run(
      `INSERT INTO template_recipients VALUES('${id}', '${jsonBCC}', 'bcc');`
    );

    // initialize insights
    await db.run(
      `INSERT INTO insights VALUES ('${id}', 0, 0, 0, 0, 0, FALSE);`
    );

    // add location to locations
    const coord = await Locations.getPlaceCoords(locationId);
    await db.run(
      `INSERT INTO locations (id, name, lat, lng)
       VALUES ('${locationId}', '${newLocation}', ${coord.lat}, ${coord.lng})
       ON CONFLICT (id)
       DO UPDATE SET name=EXCLUDED.name, lat=EXCLUDED.lat, lng=EXCLUDED.lng;`
    );

    const info = await this.getTemplateById(id);
    return info.id;
  }

  /**
   * Edits an existing template
   * @param {string} id
   * @param {string} title
   * @param {string} blurb
   * @param {string} locationId
   * @param {string} locationName
   * @param {list<string>} tags
   * @param {list<string>} toRecipient - uuid
   * @param {list<string>} ccRecipient - uuid
   * @param {list<string>} bccRecipient - uuid
   * @param {string} subject
   * @param {string} content
   * @param {boolean} published
   * @param {string} previousPublished - previous value of published
   * @param {string} previousTime - previous time value
   * @returns {string} id of template
   */
  static async editTemplate(
    id,
    title,
    blurb,
    locationId,
    locationName,
    tags,
    toRecipients,
    ccRecipients,
    bccRecipients,
    subject,
    content,
    published,
    previousPublished
  ) {
    const newTitle = title.replace("'", "''");
    const newBlurb = blurb.replace("'", "''");
    const newLocation = locationName.replace("'", "''");
    const newSubject = subject.replace("'", "''");
    const newContent = content.replace("'", "''");

    await db.run(`UPDATE templates
                        SET title = '${newTitle}',
                            blurb = '${newBlurb}',
                            location_id = '${locationId}',
                            published = '${published}',
                            subject = '${newSubject}',
                            content = '${newContent}'
                        WHERE id = '${id}';`);

    if (!published || (published && !previousPublished)) {
      await db.run(`UPDATE templates SET created_on = CURRENT_TIMESTAMP WHERE id = '${id}';`);
    }

    await db.run(`DELETE FROM tags WHERE template_id = '${id}';`);
    for (let tag of tags) {
      await this.addTag(id, tag);
    }

    await db.run(
      `DELETE FROM template_recipients WHERE template_id = '${id}';`
    );
    // add recipient for to
    const jsonTo = JSON.stringify(toRecipients);
    await db.run(
      `INSERT INTO template_recipients VALUES('${id}', '${jsonTo}', 'to');`
    );

    // add recipient for cc
    const jsonCC = JSON.stringify(ccRecipients);
    await db.run(
      `INSERT INTO template_recipients VALUES('${id}', '${jsonCC}', 'cc');`
    );

    // add recipient for bcc
    const jsonBCC = JSON.stringify(bccRecipients);
    await db.run(
      `INSERT INTO template_recipients VALUES('${id}', '${jsonBCC}', 'bcc');`
    );

    // add location to locations
    const coord = await Locations.getPlaceCoords(locationId);
    await db.run(
      `INSERT INTO locations (id, name, lat, lng)
       VALUES ('${locationId}', '${newLocation}', ${coord.lat}, ${coord.lng})
       ON CONFLICT (id)
       DO UPDATE SET name=EXCLUDED.name, lat=EXCLUDED.lat, lng=EXCLUDED.lng;`
    );

    return id;
  }

  /**
   * Duplicates a template for given uuid for a userId
   * @param {string} uuid - uuid of original template to duplicate
   * @param {string} userId - user id of duplicator
   */
  static async createDuplicate(uuid, userId) {
    const newId = uuidv4();

    const data = await this.getTemplateById(uuid);

    await db.run(`INSERT INTO templates
                        (id,
                        title,
                        blurb,
                        location_id,
                        published,
                        creator_id,
                        created_on,
                        subject,
                        content,
                        duplicate,
                        duplicated_from)
                      VALUES
                        ('${newId}',
                        '${data.title.replace("'", "''")}',
                        '${data.blurb.replace("'", "''")}',
                        '${data.location_id}',
                        'false',
                        '${userId}',
                        CURRENT_TIMESTAMP,
                        '${data.subject.replace("'", "''")}',
                        '${data.content.replace("'", "''")}',
                        true,
                        '${uuid}');`);

    // duplicate template recipients
    await db.run(`INSERT INTO template_recipients (template_id, recipients, location_type)
                        SELECT '${newId}', recipients, location_type
                        FROM template_recipients
                        WHERE template_id = '${uuid}';`);

    // duplicate tags
    await db.run(`INSERT INTO tags (template_id, tag)
                        SELECT '${newId}', tag
                        FROM tags
                        WHERE template_id = '${uuid}';`);

    // initialize insights
    await db.run(
      `INSERT INTO insights VALUES ('${newId}', 0, 0, 0, 0, 0, FALSE);`
    );

    const info = await this.getTemplateById(newId);
    return info.id;
  }

  /**
   * Deletes a template from databases
   * @param {string} id
   */
  static async deleteTemplate(id) {
    await db.run(`DELETE FROM templates WHERE id = '${id}';`);
    await db.run(`DELETE FROM tags WHERE template_id = '${id}';`);
    await db.run(
      `DELETE FROM template_recipients WHERE template_id = '${id}';`
    );
  }

  /**
   * Gets info from template db for template id
   * @param {string} id - template id
   * @returns info stored in templates db (not all info)
   */
  static async getTemplateById(id) {
    const data = await db.run(`SELECT * FROM templates WHERE id = '${id}';`);
    return data.rows[0];
  }

  /**
   * Returns if a template with said uuid exists
   * @param {string} uuid
   */
  static async getTemplateExists(uuid) {
    const data = await db.run(`SELECT * FROM templates WHERE id = '${uuid}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Updates template to have new title
   * @param {string} templateID
   * @param {string} title
   */
  static async editTitle(templateID, title) {
    const newTitle = title.replace("'", "''");
    await db.run(
      `UPDATE templates SET title = '${newTitle}' WHERE id = '${templateID}';`
    );
  }

  /**
   * Updates template with new blurb
   * @param {string} templateID
   * @param {string} blurb
   */
  static async editBlurb(templateID, blurb) {
    const newBlurb = blurb.replace("'", "''");
    await db.run(
      `UPDATE templates SET blurb = ${newBlurb} WHERE id = ${templateID};`
    );
  }

  /**
   * Updates template to have new location
   * @param {string} templateID
   * @param {string} location
   */
  static async editLocation(templateID, locationId, locationName) {
    const newLocation = locationName.replace("'", "''");

    // add location to locations
    const coord = await Locations.getPlaceCoords(locationId);
    await db.run(
      `INSERT INTO locations (id, name, lat, lng)
       VALUES ('${locationId}, '${newLocation}', ${coord.lat}, ${coord.lng})
       ON CONFLICT (id)
       DO UPDATE SET name=EXCLUDED.name, lat=EXCLUDED.lat, lng=EXCLUDED.lng;`
    );

    await db.run(
      `UPDATE templates SET location_id = '${locationId}' WHERE id = '${templateID}';`
    );
  }

  /**
   * Adds a tag to template
   * @param {string} templateID
   * @param {string} tag
   */
  static async addTag(templateID, tag) {
    const newTag = tag.replace("'", "''");
    await db.run(`INSERT INTO tags VALUES ('${templateID}', '${newTag}');`);
  }

  /**
   * Removes a tag from template
   * @param {string} templateID
   * @param {string} tag
   */
  static async removeTag(templateID, tag) {
    const oldTag = tag.replace("'", "''");
    await db.run(
      `DELETE FROM tags WHERE template_id = '${templateID}' AND tag = '${oldTag}';`
    );
  }

  /**
   * Gets tags for templates
   * @param {string} templateID
   */
  static async getTags(templateID) {
    const data = await db.run(
      `SELECT tag FROM tags WHERE template_id = '${templateID}';`
    );
    return data.rows;
  }

  /**
   * Gets emails for 'to' recipients of template
   * @param {string} templateID
   */
  static async getToRecipients(templateID) {
    const data = await db.run(
      `SELECT recipients FROM template_recipients WHERE location_type = 'to' AND template_id = '${templateID}';`
    );
    return data.rows[0].recipients;
  }

  /**
   * Gets emails for 'cc' recipients of template
   * @param {string} templateID
   */
  static async getCCRecipients(templateID) {
    const data = await db.run(
      `SELECT recipients FROM template_recipients WHERE location_type = 'cc' AND template_id = '${templateID}';`
    );
    return data.rows[0].recipients;
  }

  /**
   * Gets emails for 'bcc' recipients of template
   * @param {string} templateID
   */
  static async getBCCRecipients(templateID) {
    const data = await db.run(
      `SELECT recipients FROM template_recipients WHERE location_type = 'bcc' AND template_id = '${templateID}';`
    );
    return data.rows[0].recipients;
  }

  /**
   * Updates template with templateID to have new subject
   * @param {string} templateID
   * @param {string} subject
   */
  static async editSubject(templateID, subject) {
    const newSubject = subject.replace("'", "''");
    await db.run(
      `UPDATE templates SET subject = '${newSubject}' WHERE id = '${templateID}';`
    );
  }

  /**
   * Updates template with templateID to have new content
   * @param {string} templateID
   * @param {string} content
   */
  static async editContent(templateID, content) {
    const newContent = content.replace("'", "''");
    await db.run(
      `UPDATE templates SET content = '${newContent}' WHERE id = '${templateID}';`
    );
  }

  /**
   * Publishes template for template uuid
   * @param {string} templateID uuid
   */
  static async publish(templateID) {
    await db.run(
      `UPDATE templates SET published = true WHERE id = '${templateID}';`
    );
    await db.run(
      `UPDATE templates SET created_on = CURRENT_TIMESTAMP WHERE id = '${templateID}';`
    );
  }

  /**
   * Unpublishes template for template uuid
   * @param {string} templateID uuid
   */
  static async unpublish(templateID) {
    await db.run(
      `UPDATE templates SET published = false WHERE id = '${templateID}';`
    );
  }

  /**
   * Gets template IDs of all published templates
   */
  static async getPublishedTemplateIDs() {
    const data = await db.run(
      `SELECT id FROM templates WHERE published = true ORDER BY created_on DESC;`
    );
    return data.rows;
  }

  /**
   * Gets published template IDs for author uuid
   * @param {string} author_id
   */
  static async getAuthorPublishedTemplatesIDs(author_id) {
    const data = await db.run(
      `SELECT id FROM templates WHERE published = true AND creator_id = '${author_id}' ORDER BY created_on DESC;`
    );
    return data.rows;
  }

  /**
   * Gets drafted template IDs for author uuid
   * @param {string} author_id uuid
   */
  static async getAuthorDraftTemplateIDs(author_id) {
    const data = await db.run(
      `SELECT id FROM templates WHERE published = false AND creator_id = '${author_id}' ORDER BY created_on DESC;`
    );
    return data.rows;
  }

  /**
   * Gets published template IDs for multiple authors
   * @param {string} inStatement string of different creator ids ex: '1234..','1231r...',...
   */
  static async getPublishedTemplatesForMultAuthors(inStatement) {
    const data = await db.run(
      `SELECT id FROM templates WHERE published = true AND creator_id IN (${inStatement}) ORDER BY created_on DESC;`
    );
    return data.rows;
  }

  /**
   * Gets template IDs for templates with tag matching tag
   * @param {string} tag
   */
  static async getTemplateIDsForTag(tag) {
    const newTag = tag.replace("'", "''");
    const data = await db.run(
      `SELECT template_id FROM tags WHERE tag = '${newTag}';`
    );
    return data.rows;
  }

  /**
   * Gets template IDs for templates with matching IDs in order
   * @param {string} inStatement
   */
  static async getTemplateIDsInOrder(inStatement) {
    const data = await db.run(`SELECT id FROM templates
                                   WHERE id IN (${inStatement})
                                   ORDER BY created_on DESC;`);
    return data.rows;
  }

  /**
   * Gets template IDs for templates with location id loc_id
   * @param {string} loc_id
   */
  static async getTemplateIDsForLocation(loc_id) {
    const coord = await Locations.getPlaceCoords(loc_id);
    const lat = coord.lat;
    const lng = coord.lng;
    const data = await db.run(
      `SELECT id FROM templates
      WHERE location_id in
        (
          SELECT id FROM locations
          WHERE point(${lng},${lat}) <@>
                point(lng,lat) < 50
        )
      ORDER BY created_on DESC;`
    );
    return data.rows;
  }

  /**
   * Deletes a template
   * @param {string} templateID
   */
  static async removeTemplate(templateID) {
    // remove from templates table
    await db.run(`DELETE FROM templates WHERE id = '${templateID}';`);

    // remove from tags table
    await db.run(`DELETE FROM tags WHERE template_id = '${templateID}';`);

    // remove template recipients
    await db.run(
      `DELETE FROM template_recipients WHERE template_id = '${templateID}';`
    );

    // remove bookmarks of template
    await db.run(`DELETE FROM bookmarks WHERE template_id = '${templateID}';`);

    // remove duplicated from
    await db.run(
      `UPDATE templates SET duplicated_from = NULL WHERE duplicated_from = '${templateID}';`
    );

    // remove from reported
    await db.run(
      `DELETE FROM reported_templates WHERE template_id = '${templateID}';`
    );

    // remove comments
    await db.run(
      `DELETE FROM comments WHERE template_id = '${templateID}';`
    );

    // remove insights
    await db.run(`DELETE FROM insights WHERE template_id = '${templateID}';`);
  }

  /**
   * Gets all tags for templates in inStatement
   */
  static async getAllTags(inStatement) {
    const data = await db.run(
      `SELECT tag
      FROM tags
      WHERE template_id IN (${inStatement})
      ORDER BY tag ASC;`
    );
    return data.rows;
  }

  /**
   * Gets all locations for templates
   */
  static async getAllLocations() {
    const data = await db.run(`
        SELECT id,name
        FROM locations
        WHERE id IN (SELECT id from templates WHERE published = TRUE)
        ORDER BY name ASC;`);
    return data.rows;
  }

  /**
   * Gets all creator ids for published templates
   */
  static async getAllAuthorIds() {
    const data = await db.run(
      `SELECT creator_id FROM templates WHERE published = true;`
    );
    return data.rows;
  }

  /**
   * Gets all draft locations for user templates
   * @param {string} uuid - user id
   */
  static async getAllDraftLocations(uuid) {
    const data = await db.run(`
        SELECT id,name
        FROM locations
        WHERE id IN (SELECT id from templates
                     WHERE published = FALSE
                     AND creator_id = '${uuid}')
        ORDER BY name ASC;`);
    return data.rows;
  }

  /**
   * Adds comment for user to template
   * @param {string} userId user id whos commenting
   * @param {string} templateId template id to comment on
   * @param {string} comment comment
   * @returns {string} id of comment
   */
  static async addComment(userId, templateId, comment) {
    const newComment = comment.replace("'", "''");
    const id = uuidv4();

    await db.run(`INSERT INTO comments
                        (id,
                        user_id,
                        template_id,
                        comment)
                      VALUES
                        ('${id}',
                        '${userId}',
                        '${templateId}',
                        '${newComment}');`);

    await db.run(`
      UPDATE insights
      SET comment_count = comment_count + 1
      WHERE template_id = '${templateId}'
    `);

    return id;
  }

  /**
   * Finds user_id who authored the comment
   * @param {strin} uuid of comment
   */
  static async getAuthorIdForComment(uuid) {
    const data = await db.run(
      `SELECT user_id FROM comments WHERE id = '${uuid}';`
    );
    return data.rows[0];
  }

  /**
   * Deletes a comment from comments db and removes comment count
   * @param {string} uuid of comment to delete
   */
  static async deleteComment(uuid) {
    const id = await db.run(`SELECT template_id FROM comments WHERE id = '${uuid}';`);

    await db.run(`DELETE FROM comments WHERE id = '${uuid}';`);

    if (id.rows[0] != undefined) {
      await db.run(`
        UPDATE insights
        SET comment_count = comment_count - 1
        WHERE template_id = '${id.rows[0].template_id}'
      `);
    }

  }

  /**
   * Removes all users commentss and deletes comment count
   * -Intended for when deleting user
   * @param {string} uuid
   */
  static async deleteComments(uuid) {
    const data = await db.run(`SELECT id FROM comments WHERE user_id = '${uuid}';`);
    if (data.rows != undefined && data.rows.length > 0) {
      for (let row of data.rows){
        this.deleteComment(row.id);
      }
    }
  }

  /**
   * Gets comments for a template
   * @param {string} templateId to comments for
   */
  static async getCommentsForTemplate(templateId) {
    const data = await db.run(
      `SELECT
          comments.id,
          comments.user_id,
          comments.comment,
          comments.commented_on,
          users.name
       FROM comments
       INNER JOIN users
          ON comments.user_id = users.id
       WHERE comments.template_id = '${templateId}'
       ORDER BY comments.commented_on DESC;
      `
    );
    return data.rows;
  }
}

module.exports = Templates;

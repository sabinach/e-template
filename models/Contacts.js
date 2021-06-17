const db = require("../db/db_config");
const { v4: uuidv4 } = require("uuid");

/**
 * @class Contacts
 */
class Contacts {
  /**
   * Checks if a group name exists for a certain user
   * @param {string} userId
   * @param {string} groupName
   */
  static async groupExistsForUser(userId, groupName) {
    const data = await db.run(`
            SELECT * FROM contact_groups
            WHERE creator_id = '${userId}'
            AND group_name = '${groupName.replace("'", "''")}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a groupId exists for a certain user
   * @param {string} userId
   * @param {string} groupId
   */
  static async groupIdExists(userId, groupId) {
    const data = await db.run(`
            SELECT * FROM contact_groups
            WHERE creator_id = '${userId}'
            AND id = '${groupId}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a group name exists for a certain user that is not associated with the group ID
   * @param {string} userId
   * @param {string} groupName
   */
  static async groupExistsForUserButNotGroupId(userId, groupName, groupId) {
    const data = await db.run(`
            SELECT * FROM contact_groups
            WHERE creator_id = '${userId}'
            AND id != '${groupId}'
            AND group_name = '${groupName.replace("'", "''")}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Creates a group for a user
   * @param {string} creatorId uuid of creator
   * @param {string} name group name
   * @param {list<{name: string (possibly null), email: string}>} members members of the group
   * @returns {string} uuid of group created
   */
  static async addGroup(creatorId, name, members) {
    const groupId = uuidv4();
    const jsonMembers = JSON.stringify(members);
    await db.run(`
        INSERT INTO contact_groups 
        VALUES ('${groupId}', '${creatorId}', '${name}', '${jsonMembers}');`);
    return groupId;
  }

  /**
   * Gets groups for user
   * @param {string} uuid - user id to get groups for
   * @returns list<id, group_name, json_agg>
   */
  static async getGroupsForUser(uuid) {
    const data = await db.run(`
            SELECT 
                id,
                group_name,
                members
            FROM contact_groups
            WHERE creator_id = '${uuid}'
            ORDER BY group_name ASC;
        `);
    return data.rows;
  }

  /**
   * Deletes a group with id
   * @param {string} groupId group to delete
   */
  static async deleteGroup(groupId) {
    await db.run(`DELETE FROM contact_groups WHERE id = '${groupId}';`);
  }

  /**
   * Edits a group by adding rows for group
   * @param {string} creatorId
   * @param {string} groupId
   * @param {string} name - either new or old name for group
   * @param {list<{name: string (possibly null), email: string}>} members members of the group
   */
  static async editGroup(creatorId, groupId, name, members) {
    await this.deleteGroup(groupId);
    const jsonMembers = JSON.stringify(members);
    await db.run(`
        INSERT INTO contact_groups 
        VALUES ('${groupId}', '${creatorId}', '${name}', '${jsonMembers}');`);
    return groupId;
  }

  /**
   * Checks if an individual contact already exists under this email
   * @param {string} userId
   * @param {string} email
   */
  static async individualExistsForUserWithEmail(userId, email) {
    const data = await db.run(`
            SELECT * FROM contact_individuals
            WHERE creator_id = '${userId}'
            AND email = '${email.replace("'", "''")}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Adds individual to users contacts
   * @param {string} userId to add individual to
   * @param {string} name associated with individual
   * @param {string} email associated with individual
   */
  static async addIndividual(userId, name, email) {
    const individualId = uuidv4();
    await db.run(`
            INSERT INTO contact_individuals VALUES (
                '${individualId}',
                '${userId}',
                '${name.replace("'", "''")}',
                '${email.replace("'", "''")}'
            );
        `);
    return individualId;
  }

  /**
   * Gets individual contacts for a user
   * @param {string} userId to get individuals for
   */
  static async getIndividualsForUser(userId) {
    const data = await db.run(`
            SELECT id, name, email FROM contact_individuals 
            WHERE creator_id = '${userId}'
            ORDER BY name ASC;
        `);
    return data.rows;
  }

  /**
   * Checks if an individual Id exists for a certain user
   * @param {string} userId
   * @param {string} individualId
   */
  static async individualIdExists(userId, individualId) {
    const data = await db.run(`
            SELECT * FROM contact_individuals
            WHERE creator_id = '${userId}'
            AND id = '${individualId}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if an individual email exists for a certain user that is not associated with this individual ID
   * @param {string} userId
   * @param {string} email
   * @param {string} individualId
   */
  static async emailExistsForUserButNotIndividual(userId, email, individualId) {
    const data = await db.run(`
            SELECT * FROM contact_individuals
            WHERE creator_id = '${userId}'
            AND id != '${individualId}'
            AND email = '${email.replace("'", "''")}';`);
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Edits contact to new name and email
   * @param {string} id of individual to change
   * @param {string} name to change to
   * @param {string} email to change to
   */
  static async editIndividual(id, name, email) {
    await db.run(`
            UPDATE contact_individuals
            SET name = '${name.replace("'", "''")}',
                email = '${email.replace("'", "''")}'
            WHERE id = '${id}';`);
    return id;
  }

  /**
   * Deletes an individual from contacts table
   * @param {string} id individual id to delete
   */
  static async deleteIndividual(id) {
    await db.run(`DELETE FROM contact_individuals WHERE id = '${id}';`);
  }

  /**
   * Deletes all contacts for an individual
   * @param {string} userId to delete all contacts for
   */
  static async deleteAllContactsForUser(userId) {
    await db.run(
      `DELETE FROM contact_individuals WHERE creator_id = '${userId}';`
    );
    await db.run(`DELETE FROM contact_groups WHERE creator_id = '${userId}';`);
  }
}

module.exports = Contacts;

const db = require("../db/db_config");

/**
 * @class Moderation
 */
class Moderation {
  /**
   * Gets all admins
   */
  static async getAdmins() {
    const data = await db.run(
      `SELECT
      admins.user_id,
      users.name,
      users.email
    FROM admins
    INNER JOIN users
      ON admins.user_id = users.id
    ORDER BY users.name ASC;
    `
    );
    return data.rows;
  }

  /**
   * Adds to admin user with uuid
   * @param {string} uuid
   * @returns true if user was added
   */
  static async addAdmin(uuid) {
    await db.run(`INSERT INTO admins VALUES ('${uuid}');`);
    return await this.isAdmin(uuid);
  }

  /**
   * Removes from admin user with uuid
   * @param {string} uuid
   * @returns true if user deleted
   */
  static async removeAdmin(uuid) {
    await db.run(`DELETE FROM admins WHERE user_id = '${uuid}';`);
  }

  /**
   * Checks if user with uuid is admin
   * @param {string} uuid
   * @returns true if user is in admins table
   */
  static async isAdmin(uuid) {
    const data = await db.run(
      `SELECT * FROM admins WHERE user_id = '${uuid}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a template has been reported
   * @param {string} templateId template id
   */
  static async isTemplateReported(templateId) {
    const data = await db.run(
      `SELECT * FROM reported_templates WHERE template_id = '${templateId}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a template has been reported
   * @param {string} userId user who reported
   * @param {string} templateId template id
   */
  static async isTemplateReportedByUser(userId, templateId) {
    const data = await db.run(
      `SELECT * FROM reported_templates WHERE template_id = '${templateId}' AND reporter_id = '${userId}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a user has been reported
   * @param {string} uuid user id
   */
  static async isUserReported(uuid) {
    const data = await db.run(
      `SELECT * FROM reported_users WHERE user_id = '${uuid}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a user has been reported
   * @param {string} reporterId user who reported
   * @param {string} uuid user id
   */
  static async isUserReportedByUser(reporterId, uuid) {
    const data = await db.run(
      `SELECT * FROM reported_users WHERE user_id = '${uuid}' AND reporter_id = '${reporterId}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a comment has been reported
   * @param {string} uuid comment id
   */
  static async isCommentReported(uuid) {
    const data = await db.run(
      `SELECT * FROM reported_comments WHERE comment_id = '${uuid}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Checks if a comment has been reported
   * @param {string} reporterId user who reported
   * @param {string} uuid comment id
   */
  static async isCommentReportedByUser(reporterId, uuid) {
    const data = await db.run(
      `SELECT * FROM reported_comments WHERE comment_id = '${uuid}' AND reporter_id = '${reporterId}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Reports a given template by a certain user
   * @param {string} userId user who is reporting
   * @param {string} templateId template to be reported
   */
  static async reportTemplate(userId, templateId, reason = null) {
    if (reason == null) {
      await db.run(
        `INSERT INTO reported_templates VALUES ('${templateId}', '${userId}', null);`
      );
    } else {
      const newReason = reason.replace("'", "''");
      await db.run(
        `INSERT INTO reported_templates VALUES ('${templateId}', '${userId}', '${newReason}');`
      );
    }
  }

  /**
   * Reports a given user by a signed in user
   * @param {string} reporterId user who is reporting
   * @param {string} toReportId user to report
   */
  static async reportUser(reporterId, toReportId, reason = null) {
    if (reason == null) {
      await db.run(
        `INSERT INTO reported_users VALUES ('${toReportId}', '${reporterId}', null);`
      );
    } else {
      const newReason = reason.replace("'", "''");
      await db.run(
        `INSERT INTO reported_users VALUES ('${toReportId}', '${reporterId}', '${newReason}');`
      );
    }
  }

  /**
   * Reports a given comment by a signed in user
   * @param {string} reporterId user who is reporting
   * @param {string} commenttId comment to report
   */
  static async reportComment(reporterId, commentId, reason = null) {
    if (reason == null) {
      await db.run(
        `INSERT INTO reported_comments VALUES ('${commentId}', '${reporterId}', null);`
      );
    } else {
      const newReason = reason.replace("'", "''");
      await db.run(
        `INSERT INTO reported_comments VALUES ('${commentId}', '${reporterId}', '${newReason}');`
      );
    }
  }

  /**
   * Gets all reported templates and reasons
   */
  static async getTemplateReports() {
    const data = await db.run(
      `SELECT template_id, reason FROM reported_templates;`
    );
    return data.rows;
  }

  /**
   * Gets all reported users and reasons
   */
  static async getUserReports() {
    const data = await db.run(`SELECT user_id, reason FROM reported_users;`);
    return data.rows;
  }

  /**
   * Gets all reported comments and reasons
   */
  static async getCommentReports() {
    const data = await db.run(
      `SELECT reported_comments.comment_id, reported_comments.reason, comments.comment, comments.template_id, comments.user_id, users.name
       FROM comments
       INNER JOIN reported_comments
       ON comments.id = reported_comments.comment_id
       INNER JOIN users
       ON comments.user_id = users.id
       ORDER BY comments.id ASC;`
    );
    return data.rows;
  }

  /**
   * Removes occurences of reports for template id bc it was ignored or deleted
   * @param {string} uuid - template to be resolved
   */
  static async resolveTemplate(uuid) {
    await db.run(
      `DELETE FROM reported_templates WHERE template_id = '${uuid}';`
    );

    await db.run(
      `UPDATE insights SET spam_checked=TRUE WHERE template_id='${uuid}';`
    );
  }

  /**
   * Removes occurences of reports for user bc it was ignored or banned
   * @param {string} uuid - user id to be resolved
   */
  static async resolveUser(uuid) {
    await db.run(`DELETE FROM reported_users WHERE user_id = '${uuid}';`);
  }

  /**
   * Removes occurences of reports for user bc it was ignored or deleted
   * @param {string} uuid - comment id to be resolved
   */
  static async resolveComment(uuid) {
    await db.run(`DELETE FROM reported_comments WHERE comment_id = '${uuid}';`);
  }

  /**
   * Gets banned users
   */
  static async getBannedUsers() {
    const data = await db.run(
      `SELECT * FROM banned ORDER BY banned.email ASC;`
    );
    return data.rows;
  }

  /**
   * Bans user by adding to banned table and removing occurences of user reports
   * @param {string} uuid of user
   * @param {string} email of user to be banned
   */
  static async banUser(uuid, email) {
    const newEmail = email.replace("'", "''");
    await db.run(`INSERT INTO banned VALUES ('${newEmail}');`);
    await this.resolveUser(uuid);
  }

  /**
   * Checks if email is banned
   * @param {string} email
   */
  static async isBannedEmail(email) {
    const newEmail = email.replace("'", "''");
    const data = await db.run(
      `SELECT * FROM banned WHERE email = '${newEmail}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Unbans an email
   * @param {string} email to unban
   */
  static async unbanEmail(email) {
    await db.run(`DELETE FROM banned WHERE email = '${email.replace("'", "''")}'`)
  }

  /**
   * Gets reported template ids for a user
   * @param {string} uuid user
   */
  static async getTemplateReportsForUser(uuid) {
    const data = await db.run(
      `SELECT template_id FROM reported_templates WHERE reporter_id = '${uuid}';`
    );
    return data.rows;
  }

  /**
   * Gets reported comment ids for a user
   * @param {string} uuid user
   */
  static async getCommentReportsForUser(uuid) {
    const data = await db.run(
      `SELECT comment_id FROM reported_comments WHERE reporter_id = '${uuid}';`
    );
    return data.rows;
  }
}

module.exports = Moderation;

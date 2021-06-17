const db = require("../db/db_config");
const { v4: uuidv4 } = require("uuid");

const Moderation = require("./Moderation");

/**
 * @class Insights
 */
class Insights {
  /**
   * Gets view count for template
   * @param {string} id to get view count for
   */
  static async getViewCount(id) {
    const data = await db.run(
      `SELECT view_count FROM insights WHERE template_id = '${id}';`
    );
    return data.rows[0];
  }

  /**
   * Gets mail count for template
   * @param {string} id to get mail count for
   */
  static async getMailedCount(id) {
    const data = await db.run(
      `SELECT mail_count FROM insights WHERE template_id = '${id}';`
    );
    return data.rows[0];
  }

  /**
   * Gets filter buster count for a template
   * @param {string} id to get filter buster count for
   */
  static async getFilterBusterCount(id) {
    const data = await db.run(
      `SELECT filter_count FROM insights WHERE template_id = '${id}';`
    );
    return data.rows[0];
  }

  /**
   * Gets bookmark count for template
   * @param {string} id to get bookmark count for
   */
  static async getBookmarkCount(id) {
    const data = await db.run(
      `SELECT bookmark_count FROM insights WHERE template_id = '${id}';`
    );
    return data.rows[0];
  }

  /**
   * Gets comment count for template
   * @param {string} id to get comment count for
   */
  static async getCommentCount(id) {
    const data = await db.run(
      `SELECT comment_count FROM insights WHERE template_id = '${id}';`
    );
    return data.rows[0];
  }

  /**
   * Gets all stats for a template
   * @param {string} id to get stats for
   */
  static async getAllStats(id) {
    const data = await db.run(
      `SELECT view_count, mail_count, filter_count, bookmark_count, comment_count
            FROM insights WHERE template_id = '${id}';`
    );
    return data.rows[0];
  }

  /**
   * Adds view count for template
   * @param {string} id to add view for
   */
  static async addView(id) {
    await db.run(`
            UPDATE insights
            SET view_count = view_count + 1
            WHERE template_id = '${id}';
        `);
  }

  /**
   * Adds mail count for template
   * @param {string} id to add mailed for
   */
  static async addMail(id) {
    await db.run(`
            UPDATE insights
            SET mail_count = mail_count + 1
            WHERE template_id = '${id}';
        `);

    let mailCount = await Insights.getMailedCount(id);
    mailCount = mailCount.mail_count;

    const data = await db.run(`
          SELECT AVG(mail_count),STDDEV(mail_count)
          FROM insights;
      `);
    const threshold = parseFloat(data.rows[0].avg) + parseFloat(data.rows[0].stddev);

    const flag = await db.run(`
          SELECT spam_checked
          FROM insights
          WHERE template_id='${id}';
      `)
    if (!flag.rows[0].spam_checked && parseInt(mailCount) > threshold) {
      Moderation.reportTemplate("insights-automated-reporting",
                                id,
                                "filterbuster count exceeded threshold");
    }
  }

  /**
   * Adds filter buster count for template
   * @param {string} id to add filter buster count for
   */
  static async addFilterBuster(id) {
    await db.run(`
            UPDATE insights
            SET filter_count = filter_count + 1
            WHERE template_id = '${id}'
        `);
  }
}

module.exports = Insights;

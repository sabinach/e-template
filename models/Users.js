const db = require("../db/db_config");
const { v4: uuidv4 } = require("uuid");
const { names } = require("debug");

/**
 * @class Users
 */
class Users {
  /**
   * Finds all users
   * @returns single info object of { id: uuid, email: email, name: name, password: password}
   */
  static async getAllUsers() {
    const data = await db.run(`SELECT * FROM users ORDER BY users.email ASC;`);
    return data.rows;
  }

  /**
   * Finds all non admin user info
   */
  static async getAllNonAdminUsers() {
    const data = await db.run(`
      SELECT users.id, users.name, users.email FROM users 
      LEFT JOIN admins 
      ON users.id = admins.user_id
      WHERE admins.user_id IS NULL
    `);
    return data.rows;
  }

  /**
   * Adds a user to database with name, email, and password
   * @param {string} name
   * @param {string} email
   * @param {password} password
   * @returns user info
   * **/
  static async addUser(name, email, password) {
    const id = uuidv4();
    const newName = name.replace("'", "''");
    const newEmail = email.replace("'", "''");
    const newPassword = password.replace("'", "''");
    await db.run(
      `INSERT INTO users VALUES ('${id}', '${newName}', '${newEmail}', '${newPassword}');`
    );
    const user = await this.findUserInfo(email);
    return user.id;
  }

  /**
   * Returns if a user with said email exists
   * @param {string} email
   */
  static async getUserExists(email) {
    const newEmail = email.replace("'", "''");
    const data = await db.run(
      `SELECT * FROM users WHERE email = '${newEmail}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Finds user info for uuid
   * @param {string} uuid
   * @returns single info object of { id: uuid, username: username, display_name: UserName, password: password}
   */
  static async findUser(uuid) {
    const data = await db.run(`SELECT * FROM users WHERE id = '${uuid}';`);
    return data.rows[0];
  }

  /**
   * Finds info for user with lowercase email
   * @param {string} email
   * @return {string} uuid associated with email
   */
  static async findUserInfo(email) {
    const newEmail = email.replace("'", "''");
    const data = await db.run(
      `SELECT * FROM users WHERE email = '${newEmail}';`
    );
    return data.rows[0];
  }

  /**
   * Finds info for user with name
   * @param {string} name
   * @return {string} uuid associated with name
   */
  static async getUserIdsFromName(name) {
    const newName = name.replace("'", "''");
    const data = await db.run(
      `SELECT id FROM users WHERE name = '${newName}';`
    );
    return data.rows;
  }

  /**
   * Deletes user with uuid
   * @param {string} uuid
   */
  static async deleteUser(uuid) {
    await db.run(`DELETE FROM users WHERE id = '${uuid}';`);
  }

  /**
   * Finds bookmarked templates for uuid
   * @param {string} uuid
   */
  static async getBookmarkedTemplates(uuid) {
    const data = await db.run(
      `SELECT template_id FROM bookmarks WHERE user_id = '${uuid}'`
    );
    return data.rows;
  }

  /**
   * Finds if a user has bookmarked a template
   * @param {string} uuid - userId
   * @param {string} templateId - template id
   * @returns {bool}
   */
  static async hasBookmark(uuid, templateId) {
    const data = await db.run(
      `SELECT * FROM bookmarks WHERE template_id = '${templateId}' AND user_id = '${uuid}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Adds bookmark to template
   * @param {string} uuid - userId
   * @param {string} templateId - templateId
   */
  static async addBookmark(uuid, templateId) {
    await db.run(`INSERT INTO bookmarks VALUES ('${templateId}', '${uuid}');`);
    await db.run(`
      UPDATE insights
      SET bookmark_count = bookmark_count + 1
      WHERE template_id = '${templateId}'
    `);
  }

  /**
   * Removes bookmark from template
   * @param {string} uuid - userId
   * @param {string} templateId - templateId
   */
  static async deleteBookmark(uuid, templateId) {
    await db.run(
      `DELETE FROM bookmarks WHERE template_id = '${templateId}' AND user_id = '${uuid}';`
    );
    await db.run(`
      UPDATE insights
      SET bookmark_count = bookmark_count - 1
      WHERE template_id = '${templateId}'
    `);
  }

  /**
   * Removes all users bookmarks and deletes bookmark count
   * -Intended for when deleting user
   * @param {string} uuid
   */
  static async deleteBookmarks(uuid) {
    const data = await db.run(`SELECT template_id FROM bookmarks WHERE user_id = '${uuid}';`);
    await db.run(`DELETE FROM bookmarks WHERE user_id = '${uuid}';`);
    if (data.rows != undefined && data.rows.length > 0) {
      const ids = data.rows.map((row) => row.template_id);
      const inStatement = ids.map((i) => `'${i}'`).join(",");
      await db.run(`UPDATE insights SET bookmark_count = bookmark_count - 1
                    WHERE template_id IN (${inStatement});`);
    }
  }

  /**
   * Finds all users in database
   * @returns a list of { username: username } objects
   */
  static async getAllUsernames() {
    const data = await db.run(`SELECT username FROM users;`);
    return data.rows;
  }

  /**
   * Finds all users with display names in database
   * @returns a list of { display_name: display_name } objects
   */
  static async getAllDisplayNames() {
    const data = await db.run(`SELECT display_name FROM users;`);
    return data.rows;
  }

  /**
   * Adds contact with name and email to usernames' contacts
   * @param {string} username
   * @param {string} name
   * @param {string} email
   */
  static async addContact(username, name, email) {
    const recipientID = uuidv4();
    await db.run(
      `INSERT INTO recipients VALUES ('${recipientID}', '${name}', '${email}');`
    );
    const info = this.findUserId(username);
    await db.run(
      `INSERT INTO contacts VALUES ('${id}', '${recipientID}', 'recipient');`
    );
  }

  /**
   * Gets all individual contacts for a user with username
   * @param {string} username
   * @returns list of { name: x, email: y} objects representing indivual contacts
   */
  static async getAllRecipientContacts(username) {
    const id = this.findUserId(username);
    const data = await db.run(`SELECT name, email FROM recipients r INNER JOIN contacts c 
                ON r.recipient_id = c.type_id 
                WHERE c.creator_id = '${id}';`);
    return data.rows;
  }

  /**
   * Checks that a users password and uuid corresponds to user in database
   * @param {string} uuid
   * @param {string} password
   */
  static async verifyPassword(uuid, password) {
    const newPassword = password.replace("'", "''");
    const data = await db.run(
      `SELECT * FROM users WHERE id = '${uuid}' AND password = '${newPassword}';`
    );
    return data.rowCount > 0 ? true : false;
  }

  /**
   * Updates users name for given uuid
   * @param {string} uuid
   * @param {string} name
   */
  static async setName(uuid, name) {
    const newName = name.replace("'", "''");
    const data = await db.run(
      `UPDATE users SET name = '${newName}' WHERE id = '${uuid}';`
    );
  }

  /**
   * Updates users email for given uuid
   * @param {string} uuid
   * @param {string} email
   */
  static async setEmail(uuid, email) {
    const newEmail = email.replace("'", "''");
    const data = await db.run(
      `UPDATE users SET email = '${newEmail}' WHERE id = '${uuid}';`
    );
  }

  /**
   * Updates users password for given uuid
   * @param {string} uuid
   * @param {string} password
   */
  static async setPassword(uuid, password) {
    const newPassword = password.replace("'", "''");
    const data = await db.run(
      `UPDATE users SET password = '${newPassword}' WHERE id = '${uuid}';`
    );
  }

  /**
   * Gets all names for associated uuids in the inStatement
   * @param {string} inStatement
   */
  static async getAllNames(inStatement) {
    const data = await db.run(
      `SELECT name FROM users WHERE id IN (${inStatement}) ORDER BY name ASC;`
    );
    return data.rows;
  }
}

module.exports = Users;

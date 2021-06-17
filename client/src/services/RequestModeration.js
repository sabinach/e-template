import axios from "axios";

/**
 * Gets comments for a template
 * @name GET/api/moderation/admins
 * @returns { { admins: list<object>} }
 *      where <object> corresponds to
 *        { user_id: string,
 *          name: string,
 *          email: string }
 */
const getAdmins = () => axios.get("/api/moderation/admins");

/**
 * Adds a user to admin
 * @name POST/api/moderation/admins
 * @body {string} id - user id to add
 * @returns { {id: string} } uuid of added admin
 * @throws {400} if no user associated with uuid or user in admin
 * @throws {500} if unknown error inserting into admin table
 */
const addAdmin = (data) => axios.post("/api/moderation/admins", data);

/**
 * Removes a user from the admins
 * @name DELETE/api/moderation/admins
 * @body {string} id - user id to remove
 * @returns { {id: string} } uuid of removed admin
 * @throws {400} if no user associated with uuid or user not in admin
 * @throws {500} if unknown error removing user
 */
const removeAdmin = (data) =>
  axios.delete("/api/moderation/admins", { data: data });

/**
 * Gets if a user with uuid is an admin
 * @name GET/api/moderation/admins/:id
 * @params {string} id - uuid of user to check
 * @returns { {isAdmin: bool} } whether or not user is an admin
 * @throws {400} if no user associated with uuid
 */
const getIsAdmin = (data) => axios.get("/api/moderation/admins/" + data);

/**
 * Reports a template
 * @name POST/api/moderation/reports/templates
 * @body {string} id - template id to be reported
 * @body {string} reason - reason for reporting
 * @returns { {reported: bool} } true if reported
 * @throws {401} if user not signed in
 * @throws {400} if template does not exist or user already reported template
 */
const reportTemplate = (data) =>
  axios.post("/api/moderation/reports/templates", data);

/**
 * Reports a user
 * @name POST/api/moderation/reports/users
 * @body {string} id - template id to be reported
 * @body {string} reason - reason for reporting
 * @returns { {reported: bool} } true if reported
 * @throws {401} if user not signed in
 * @throws {400} if reported user does not exist or user already reported user
 */
const reportUser = (data) => axios.post("/api/moderation/reports/user", data);

/**
 * Gets all current reports for templates along with reasons for admin
 * @name GET/api/moderation/reports/templates
 * @returns { {reports: list{template_id: string, reason: string (possibly null) } } }
 * @throws {401} if not signed in
 * @throws {403} if signed in but not admin
 */
const getReportedTemplates = () =>
  axios.get("/api/moderation/reports/templates");

/**
 * Gets all current reports for users along with reasons for admin
 * @name GET/api/moderation/reports/users
 * @returns { {reports: list{user_id: string, reason: string (possibly null) } } }
 * @throws {401} if not signed in
 * @throws {403} if signed in but not admin
 */
const getReportedUsers = () => axios.get("/api/moderation/reports/users");

/**
 * Deletes a template due to report
 * @name DELETE/api/moderation/reports/templates/deletion
 * @body {string} id - uuid of template to remove
 * @returns { {removed: bool} } true if removed
 * @throws {400} if template wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
const deleteReportedTemplate = (data) =>
  axios.delete("/api/moderation/reports/templates/deletion", { data: data });

/**
 * Resolves a template in reported templates (ignores report request)
 * @name DELETE/api/moderation/reports/templates/resolve
 * @returns { {resolved: bool} } true if resolved
 * @throws {400} if template wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
const resolveReportedTemplate = (data) =>
  axios.delete("/api/moderation/reports/templates/resolution", { data: data });

/**
 * Gets banned user emails
 * @name GET/api/moderation/users/banned
 * @returns { emails: list<string> } banned emails
 */
const getBannedUsers = () => axios.get("/api/moderation/users/banned");

/**
 * Bans a user's email in the reported users
 *      - Adds email to banned list
 *      - Deletes user and associated data
 * @name POST/api/moderation/reports/users/banned
 * @body {string} id - uuid of user to ban (bans the associated email w/ this uuid)
 * @returns { {banned: bool} } true if banned
 * @throws {400} if user wasnt reported/user does not exist
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
const banReportedUser = (data) =>
  axios.post("/api/moderation/reports/users/banned", data);

/**
 * Resolves a user in reported users (ignores the report)
 * @name DELETE/api/moderation/reports/users/resolve
 * @body {string} id - uuid of user to resolve
 * @returns { {resolved: bool} } true if resolved
 * @throws {400} if user wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
const resolveReportedUser = (data) =>
  axios.delete("/api/moderation/reports/users/resolution", data);

/**
 * Gets reported template ids for a user
 * @name GET/api/moderation/reports/templates/:id
 * @params {string} id
 * @returns { reported: list<string> } ids reported
 */
const getReportedTemplatesForUser = (data) =>
  axios.get("/api/moderation/reports/templates/" + data);

/**
 * Reports a comment
 * @name POST/api/moderation/reports/comments
 * @body {string} id - comment id to be reported
 * @body {string} reason - reason for reporting
 * @returns { {reported: bool} } true if reported
 * @throws {401} if user not signed in
 * @throws {400} if reported comment does not exist or user already reported comment
 */
const reportComment = (data) =>
  axios.post("/api/moderation/reports/comments", data);

/**
 * Gets all current reports for comments along with reasons for admin
 * @name GET/api/moderation/reports/comments
 * @returns { {reports: list{comment_id: string, reason: string (possibly null) } } }
 * @throws {401} if not signed in
 * @throws {403} if signed in but not admin
 */
const getReportedComments = () => axios.get("/api/moderation/reports/comments");

/**
 * Deletes a comment due to report
 * @name DELETE/api/moderation/reports/comments/deletion
 * @body {string} id - uuid of comment to remove
 * @returns { {removed: bool} } true if removed
 * @throws {400} if comment wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
const deleteReportedComment = (data) =>
  axios.delete("/api/moderation/reports/comments/deletion", { data: data });

/**
 * Resolves a comment in reported comments (ignores report request)
 * @name DELETE/api/moderation/reports/comments/resolution
 * @returns { {resolved: bool} } true if resolved
 * @throws {400} if comment wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
const resolveReportedComment = (data) =>
  axios.delete("/api/moderation/reports/comments/resolution", { data: data });

/**
 * Gets reported comment ids for a user
 * @name GET/api/moderation/reports/comments/:id
 * @params {string} id
 * @returns { reported: list<string> } comment ids reported
 */
const getReportedCommentsForUser = (data) =>
  axios.get("/api/moderation/reports/comments/" + data);

/**
 * Unbans an email
 * @name DELETE/api/moderation/reports/users/banned
 * @body {string} email - to unban
 * @returns { unbanned: bool } true if unbanned
 * @throws {400} if no email given
 * @throws {401} if not logged in
 * @throws {403} if not admin user
 */
const unbanEmail = (data) => axios.delete("/api/moderation/reports/users/banned", {data: data});

const requestModerationFunctions = {
  getAdmins,
  addAdmin,
  removeAdmin,
  getIsAdmin,
  reportTemplate,
  reportUser,
  getReportedTemplates,
  getReportedUsers,
  deleteReportedTemplate,
  resolveReportedTemplate,
  getBannedUsers,
  banReportedUser,
  resolveReportedUser,
  getReportedTemplatesForUser,
  reportComment,
  getReportedComments,
  deleteReportedComment,
  resolveReportedComment,
  getReportedCommentsForUser,
  unbanEmail
};

export default requestModerationFunctions;

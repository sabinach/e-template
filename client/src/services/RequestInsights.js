import axios from "axios";

/**
 * Adds view for template
 * @name POST/api/insights/viewCount
 * @body {string} id - of template to add view for
 * @returns { added: bool } true if added
 * @throws {400} if template id is undefined or no template exists with this id
 */
const addViewForTemplate = (data) =>
  axios.post("/api/insights/viewCount", data);

/**
 * Adds mail count for template
 * @name POST/api/insights/mailCount
 * @body {string} id - of template to add mail count for
 * @returns { added: bool } true if added
 * @throws {400} if template id is undefined or no template exists with this id
 */
const addMailedForTemplate = (data) =>
  axios.post("/api/insights/mailCount", data);

/**
 * Adds filter buster count for template
 * @name POST/api/insights/filterBusterCount
 * @body {string} id - of template to add filter buster count for
 * @returns { added: bool } true if added
 * @throws {400} if template id is undefined or no template exists with this id
 */
const addFilterBusterForTemplate = (data) =>
  axios.post("/api/insights/filterBusterCount", data);

/**
 * Gets view count for a template
 * @name GET/api/insights/viewCount/:id
 * @param {string} id - of template to get view count for
 * @returns { viewCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
const getViewCountForTemplate = (data) =>
  axios.get("/api/insights/viewCount/" + data);

/**
 * Gets mail count for a template
 * @name GET/api/insights/mailCount/:id
 * @param {string} id - of template to get mail count for
 * @returns { mailCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
const getMailedCountForTemplate = (data) =>
  axios.get("/api/insights/mailCount/" + data);

/**
 * Gets filter buster count for a template
 * @name GET/api/insights/filterBusterCount/:id
 * @param {string} id - of template to get filter buster count for
 * @returns { filterBusterCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
const getFilterBusterCountForTemplate = (data) =>
  axios.get("/api/insights/filterBusterCount/" + data);

/**
 * Gets bookmark count for a template
 * @name GET/api/insights/bookmarkCount/:id
 * @param {string} id - of template to get bookmark count for
 * @returns { bookmarkCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
const getBookmarkCountForTemplate = (data) =>
  axios.get("/api/insights/bookmarkCount/" + data);

/**
 * Gets comment count for a template
 * @name GET/api/insights/commentCount/:id
 * @param {string} id - of template to get comment count for
 * @returns { commentCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
const getCommentCountForTemplate = (data) =>
  axios.get("/api/insights/commentCount/" + data);

/**
 * Gets all insights for a template
 * @name GET/api/insights/viewCount/:id
 * @param {string} id - of template to get insights for
 * @returns { viewCount: int ,
 *            mailCount: int,
 *            filterBusterCount: int,
 *            bookmarkCount: int,
 *            commentCount: int}
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
const getInsightsForTemplate = (data) => axios.get("/api/insights/" + data);

const requestInsightsFunctions = {
  addViewForTemplate,
  addMailedForTemplate,
  addFilterBusterForTemplate,
  getViewCountForTemplate,
  getMailedCountForTemplate,
  getFilterBusterCountForTemplate,
  getBookmarkCountForTemplate,
  getCommentCountForTemplate,
  getInsightsForTemplate,
};

export default requestInsightsFunctions;

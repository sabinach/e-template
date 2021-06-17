import axios from "axios";

/**
 * Create a template
 * @name POST/api/templates/
 * @body {string} title
 * @body {string} blurb
 * @body {string} locationId
 * @body {string} locationName
 * @body {bool} published
 * @body {string} subject
 * @body {string} content
 * @body {list<string>} tags
 * @body {list<object>} toRecipients - emails for 'to'
 * @body {list<object>} ccRecipients - emails for 'cc'
 * @body {list<object>} bccRecipients - emails for 'bcc'
 *    WHERE object in the last 3 correspond to one of the following:
 *       - {string} (email)
 *       - {name: {string}, email: {string}} (contact)
 *       - {name: {string}, members: list<contact (name can be null)>} (group)
 * @throws {401} for not signed in
 * @throws {400} for incorrect template format
 * @returns { {id: string} } uuid of new template
 */
const createTemplate = (data) => axios.post("/api/templates", data);

/**
 * Edits a template with id = id
 * @name PUT/api/templates/id
 * @body {string} id - template uuid
 * @body {string} title
 * @body {string} blurb
 * @body {string} locationId
 * @body {string} locationName
 * @body {bool} published
 * @body {string} subject
 * @body {string} content
 * @body {list<string>} tags
 * @body {list<object>} toRecipients - emails for 'to'
 * @body {list<object>} ccRecipients - emails for 'cc'
 * @body {list<object>} bccRecipients - emails for 'bcc'
 *    WHERE object in the last 3 correspond to one of the following:
 *       - {string} (email)
 *       - {name: {string}, email: {string}} (contact)
 *       - {name: {string}, members: list<contact (name can be null)>} (group)
 * @throws {401} for not signed in
 * @throws {400} for incorrect template format
 * @throws {403} for incorrect user
 * @returns { {id: string} } uuid of edited template
 */
const editTemplate = (data) => axios.put("/api/templates/id", data);

/**
 * Creates a duplicate from given id
 * NOTE: initializes it to an unpublished draft
 * @name POST/api/templates/duplicate/:id
 * @params {string} id - id of template to duplicate
 * @returns { { id: string } } uuid of new duplicated template
 * @throws {401} if not logged in
 * @throws {400} if no template associated with id
 */
const duplicateTemplate = (data) =>
  axios.post("/api/templates/duplicate/" + data);

/**
 * Deletes template with id
 * @name DELETE/api/templates/id
 * @body {string} id
 * @throws {400} for no template associated with id
 * @throws {401} for not logged
 * @throws {403} for not correct author
 * @returns { {message: string} } - message saying its been deleted
 */
const deleteTemplateById = (data) => axios.delete("/api/templates/id", data);

/**
 * Publishes a template with id
 * @name PUT/api/templates/publish/id
 * @body {string} id - template id to publish
 * @returns { {message: string} } saying its been published
 * @throws {400} if no template associated with id
 * @throws {401} if not logged in
 * @throws {403} if not users own template
 */
const publishTemplateById = (data) =>
  axios.put("/api/templates/publish/id", data);

/**
 * Unpublishes a template with id
 * @name PUT/api/templates/unpublish/id
 * @body {string} id - template to unpublish
 * @returns { {message: string} } saying its been unpublished
 * @throws {400} if no template associated with id
 * @throws {401} if not logged in
 * @throws {403} if not users own template
 */
const unpublishTemplateById = (data) =>
  axios.put("/api/templates/unpublish/id", data);

/**
 * Gets template info for id
 * @name GET/api/templates/id
 * @param {string} id
 * @returns { {id: string,
  *             title: string,
  *             blurb: string,
  *             location_id: string,
  *             display_location: string,
  *             published: boolean,
  *             creator_id: string,
  *             author: string,
  *             subject: string,
  *             content: string,
  *             created_on: timestamp (technically string),
  *             tags: list<string>,
  *             toRecipients: list<object>,
  *             ccRecipients: list<object>,
  *             bccRecipients: list<object>} }
  * WHERE object in the last 3 correspond to one of the following:
  *       - {string} (email)
  *       - {name: {string}, email: {string}} (contact)
  *       - {name: {string}, members: list<contact (name can be null)>} (group)
  */
const getTemplateById = (data) => axios.get(`/api/templates/id/${data.id}`);

/**
 * Gets template info for multiple template ids
 * @name POST/api/templates/ids
 * @body {list<string>} ids
 * @returns {list<object>} data - where <object> corresponds to:
 *      {id: string,
 *        title: string,
 *        blurb: string,
 *        location_id: string,
 *        display_location: string,
 *        published: boolean,
 *        creator_id: string,
 *        author: string,
 *        subject: string,
 *        content: string,
 *        created_on: timestamp (technically string),
 *        tags: list<string>,
 *        toRecipients: list<object>,
 *        ccRecipients: list<object>,
 *        bccRecipients: list<object>}
 * WHERE object in the last 3 correspond to one of the following:
 *       - {string} (email)
 *       - {name: {string}, email: {string}} (contact)
 *       - {name: {string}, members: list<contact (name can be null)>} (group)
 */
const getTemplatesByIds = (data) => axios.post("/api/templates/ids", data);

/**
 * Find all published template ids
 * @name GET/api/templates/
 * @returns { {ids: list<string>} }
 */
const getPublishedTemplateIDs = () => axios.get("/api/templates");

/**
 * Find all published templates with filters
 * @name POST/api/templates/filters
 * @body {list<string>} tags
 * @body {list<string>} authors (names not uuid)
 * @body {list<string>} locations (location ids)
 * @returns { { ids: list<string> } }
 */
const getTemplateIDsByFilters = (data) =>
  axios.post("/api/templates/filters", data);

/**
 * Find templates IDs by tag
 * @name POST/api/templates/tags
 * @body {list<string>} tags - list of tags
 * @return { {ids: list<string>} } list of template ids
 * @throws {400} if empty tag
 */
const getTemplateIDsByTag = (data) => axios.post("/api/templates/tags", data);

/**
 * Find template IDs by location
 * @name POST/api/templates/locations
 * @body {list<string>} locations - list of location ids
 * @return { {ids: list<string>} } list of template ids
 * @throws {400} if empty location
 */
const getTemplateIDsByLocation = (data) =>
  axios.post("/api/templates/locations", data);

/**
 * Find ALL template IDs by user uuid
 * @name POST/api/templates/authors/:id
 * @body {list<string>} id - list of user uuid
 * @return { {ids: list<string>} } list of template ids
 * @throws {400} if empty author
 */
const getTemplateIDsByAuthorUUIDs = (data) =>
  axios.post("/api/templates/authors", data);

/**
 * Find *published* template IDs by user uuid
 * @name GET/api/templates/authors/:id
 * @param {string} id NOTE: string - not object
 * @returns { {ids: list<string> } } list of template ids
 * @throws {400} if empty uuid
 */
const getPublishedTemplateIDsByAuthorUUID = (data) =>
  axios.get("/api/templates/authors/" + data);

/**
 * Find draft template IDs for signed in user
 * @name GET/api/templates/drafts
 * @return { {ids: list<string>} } list of ids
 * @throws {401} if user not logged in
 * @throws {403} if invalid username or username does not match logged in user
 */
const getDraftTemplateIDs = () => axios.get("/api/templates/drafts");

/**
 * Get template ids for signed in user bookmarked templates
 * @name GET/api/users/bookmarks
 * @returns { { ids: list<string> } } bookmarked template ids
 * @throws {400} if empty uuid
 * @throws {401} if not logged in
 */
const getBookmarkedTemplateIDs = () => axios.get("/api/templates/bookmarks");

/**
 * Adds template to users bookmarked templates
 * @name POST/api/users/bookmarks/:id
 * @params {string} id - template id to be bookmarked
 * @returns { {template_id: string }} template that was bookmarked
 * @throws {400} if no template associated w ID or template already bookmarked
 * @throws {401} if user not signed in
 */
const addBookmark = (data) => axios.post("/api/templates/bookmarks/" + data);

/**
 * Removes template from users bookmarked templates
 * @name DELETE/api/users/bookmarks/:id
 * @params {string} id - template id to be removed
 * @returns { {template_id: string }} template that was bookmarked
 * @throws {400} if no template associated w ID or template not initially bookmarked
 * @throws {401} if user not signed in
 */
const deleteBookmark = (data) =>
  axios.delete("/api/templates/bookmarks/" + data);

/**
 * Gets all tags for published templates
 * @name GET/api/templates/tags
 * @returns {tags: list<string>} all tags of published templates
 */
const getAllTags = () => axios.get("/api/templates/tags");

/**
 * Gets all published locations
 * @name GET/api/templates/locations
 * @returns {locations: list<object> where object has keys id and name} all locations
 */
const getAllLocations = () => axios.get("/api/templates/locations");

/**
 * Gets all published authors
 * @name GET/api/templates/authors
 * @returns {authors: list<string>} all names
 */
const getAllAuthors = () => axios.get("/api/templates/authors");

/**
 * Gets all draft tags for signed in user
 * @name GET/api/templates/drafts/tags
 * @returns { {tags: list<string> } } list of draft tags
 * @throws {401} for non logged in user
 */
const getAllDraftTags = () => axios.get("/api/templates/drafts/tags");

/**
 * Gets all draft locations for signed in user
 * @name GET/api/templates/drafts/locations
 * @returns {locations: list<object> where object has keys id and name} list of draft locations
 * @throws {401} for non logged in user
 */
const getAllDraftLocations = () => axios.get("/api/templates/drafts/locations");

/**
 * Adds comment to a template
 * @name POST/api/templates/comments
 * @body {string} id - template ID to comment on
 * @body {string} comment - to comment
 * @returns { {id: string} } comment id
 * @throws {401} if user not logged in
 * @throws {400} if empty comment or template id
 */
const addCommentForTemplate = (data) =>
  axios.post("/api/templates/comments", data);

/**
 * Deletes a comment from a template
 * @name DELETE/api/templates/comments
 * @body {string} id - comment id to remove
 * @returns { {deleted: true} } if removed
 * @throws {401} if user not signed in
 * @throws {403} if user did not write the comment
 * @throws {400} if no comment with id exists
 */
const deleteCommentForTemplate = (data) =>
  axios.delete("/api/templates/comments", { data: data });

/**
 * Gets comments for a template
 * @name GET/api/templates/comments/:id
 * @param {string} id - template id to get comments for (NOT an object)
 * @returns { { comments: list<object>} }
 *      where <object> corresponds to
 *        { id: string,
 *          user_id: string,
 *          comment: string,
 *          commented_on: timestamp (I think string) ,
 *          name: string (the display name for user)}
 * @throws {400} if no id/empty id given
 */
const getCommentsForTemplate = (data) =>
  axios.get("/api/templates/comments/" + data);

const requestTemplateFunctions = {
  createTemplate,
  editTemplate,
  duplicateTemplate,
  deleteTemplateById,
  publishTemplateById,
  unpublishTemplateById,
  getTemplateById,
  getTemplatesByIds,
  getPublishedTemplateIDs,
  getTemplateIDsByFilters,
  getTemplateIDsByTag,
  getTemplateIDsByLocation,
  getTemplateIDsByAuthorUUIDs,
  getPublishedTemplateIDsByAuthorUUID,
  getDraftTemplateIDs,
  getBookmarkedTemplateIDs,
  addBookmark,
  deleteBookmark,
  getAllTags,
  getAllLocations,
  getAllAuthors,
  getAllDraftTags,
  getAllDraftLocations,
  addCommentForTemplate,
  deleteCommentForTemplate,
  getCommentsForTemplate,
};

export default requestTemplateFunctions;

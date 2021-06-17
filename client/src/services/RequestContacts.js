import axios from "axios";

/**
 * Adds group for signed in user
 * @name POST/api/contacts/groups
 * @body {string} name - name of group to add
 * @body {list<object>} members - group members where object corresponds to
 *          { email: string, name: string (possibly null) }
 * @returns {id: {string}} of group id
 * @throws {401} for not logged in
 * @throws {400} for empty group name or members
 * @throws {400} if group already exists for user with group name
 */
const createGroup = (data) => axios.post("/api/contacts/groups", data);

/**
 * Gets groups for signed in user
 * @name GET/api/contacts/groups
 * @returns nothing as of yet
 * @throws {401} for not logged in user
 */
const getGroups = () => axios.get("/api/contacts/groups");

/**
 * Edits pre-existing group
 * @name PUT/api/contacts/groups
 * @body {string} id - group id of existing group to edit
 * @body {string} name - group name (either new name or old)
 * @body {list<object>} members - group members where object corresponds to
 *          { email: string, name: string (possibly null) }
 * @returns { id: {string} } group id that was editted
 * @throws {401} if not logged in
 * @throws {400} if new name is empty, or if new name already exists for different group for user
 * @throws {400} if group id is invalid or no group exists with this id for user
 */
const editGroup = (data) => axios.put("/api/contacts/groups", data);

/**
 * Deletes a group for a user
 * @name DELETE/api/contacts/groups
 * @body {string} id - group to delte
 * @returns { {deleted: bool} } true if removed
 * @throws {401} if not logged in
 * @throws {400} if group id invalid or does not exist for user
 */
const deleteGroup = (data) =>
  axios.delete("/api/contacts/groups", { data: data });

/**
 * Adds individual for signed in user
 * @name POST/api/contacts/groups
 * @body {string} name - name of individual to add
 * @body {string} email - name of email to add
 * @returns {id: {string}} of individual id
 * @throws {401} for not logged in
 * @throws {400} if individual name/email is empty
 * @throws {400} if individual with email already exists for user
 */
const addIndividual = (data) => axios.post("/api/contacts/individuals", data);

/**
 * Gets individuals for signed in user
 * @name GET/api/contacts/individuals
 * @returns {individuals: list<object>} (alphabetized by individual name) where object corresponds to:
 *      { id: {string} uuid of individual,
 *        name: {string} name of individual,
 *        email: {string} email of individual}
 * @throws {401} for not logged in user
 */
const getIndividuals = () => axios.get("/api/contacts/individuals");

/**
 * Edits pre-existing individual
 * @name PUT/api/contacts/individuals
 * @body {string} id - individual id to edit
 * @body {string} name - individuals name (either new name or old)
 * @body {string} email - individuals email (either new or old)
 * @returns { id: {string} } individual id that was editted
 * @throws {401} if not logged in
 * @throws {400} if new name is empty, or if new name already exists for different individual for user
 * @throws {400} if individual id is invalid or no individual exists with this id for user
 */
const editIndividual = (data) => axios.put("/api/contacts/individuals", data);

/**
 * Deletes an individual for a user
 * @name DELETE/api/contacts/individuals
 * @body {string} id - individual to delete
 * @returns { {deleted: bool} } true if removed
 * @throws {401} if not logged in
 * @throws {400} if individual id invalid or does not exist for user
 */
const deleteIndividual = (data) =>
  axios.delete("/api/contacts/individuals", { data: data });

/**
 * Gets contacts for signed in user
 * @name GET/api/contacts/
 * @returns { contacts: list<object>} (alphabetized by name) where object corresponds to either groups or individual object
 *      as seen in GET/api/contacts/groups and GET/api/contacts/individuals
 * @throws {401} for not logged in user
 */
const getContacts = () => axios.get("/api/contacts/");

const requestContactsFunctions = {
  createGroup,
  getGroups,
  editGroup,
  deleteGroup,
  addIndividual,
  getIndividuals,
  editIndividual,
  deleteIndividual,
  getContacts,
};

export default requestContactsFunctions;

import axios from "axios";

/**
 * Get all users
 * @name GET/api/users/
 * @returns  { { users: list<object>} }
 *  *      where <object> corresponds to
 *        { id: string,
 *          email: string,
 *          name: string,
 *          password: string,
 */
const getAllUsers = () => axios.get("/api/users");

/**
 * Get all non admin users
 * @name GET/api/users/nonAdmin
 * @returns  { { users: list<object>} }
 *  *      where <object> corresponds to
 *        { id: string,
 *          email: string,
 *          name: string,
 *          password: string,
 */
const getAllNonAdminUsers = () => axios.get("/api/users/all/nonAdmin");

/**
 * Create a user
 * @name POST/api/users/
 * @body {string} name
 * @body {string} email
 * @body {string} password
 * @return {string} - id of account created
 * @throws {400} - if invalid request
 * @throws {401} - if username already exists
 */
const createUser = (data) => axios.post("/api/users", data);

/**
 * Check if user is signed in
 * @name GET/api/users/isSignedIn
 * @returns { {isSignedIn: bool } } whether user is signed in
 */
const isSignedIn = () => axios.get("/api/users/isSignedIn");

/**
 * Sign in for a particular user
 * @name POST/api/users/signin
 * @body {string} email
 * @body {string} password
 * @return { {id: string} } id of account
 * @throws {400} - if invalid request
 * @throws {401} - if wrong user/pass combo
 * @throws {403} - if already signed in
 */
const signIn = (data) => axios.post("/api/users/signin", data);

/**
 * Sign out of a user session
 * @name DELETE/api/users/signout
 * @return { {id: string} } uuid of signed out user
 * @throws {401} if not signed in
 */
const signOut = () => axios.delete("/api/users/signout");

/**
 * Deletes the logged in users account
 * @name DELETE/api/users/
 * @body {string} password
 * @returns { { message: string } } "Deleted" if deleted
 * @throws {401} if no id given or id doesnt correspond to user
 * @throws {403} if incorrect password given
 */
const deleteAccount = (data) => axios.delete("/api/users/", data);

/**
 * Get a users name from uuid
 * @name GET/api/users/:id
 * @param {string} id (NOT OBJECT - JUST STRING)
 * @returns { { name: string } } name of user
 * @returns {401} if no id given or id doesnt correspond to user
 */
const getNameFromUUID = (data) => axios.get("/api/users/" + data);

/**
 * Changes user name for signed in user
 * @name PUT/api/users/change/name
 * @body {string} name
 * @body {string} password
 * @returns { {name: string } } new name of user
 * @throws {400} for empty name
 * @throws {401} for not signed in user
 * @throws {403} for incorrect password for user
 */
const setUserName = (data) => axios.put("/api/users/name", data);

/**
 * Changes user email for signed in user
 * @name PUT/api/users/change/email
 * @body {string} email
 * @body {string} password
 * @returns { {email: string } } new email of user
 * @throws {400} for empty email or already taken email
 * @throws {401} for not signed in user
 * @throws {403} for incorrect password for user
 */
const setUserEmail = (data) => axios.put("/api/users/email", data);

/**
 * Changes user password for signed in user
 * @name PUT/api/users/change/password
 * @body {string} newPassword - new password
 * @body {string} password - current password
 * @returns nothing - will not send password back
 * @throws {400} if new password does not contain any characters
 * @throws {401} for not signed in user
 * @throws {403} for incorrect password for user
 */
const setUserPassword = (data) => axios.put("/api/users/password", data);

/**
 * Gets a users email
 * @name GET/api/users/email/:id
 * @params {string} id - uuid of user
 * @returns { {email: string} }
 * @throws {400} if no user associated with uuid
 */
const getEmailFromUUID = (data) => axios.get("/api/users/email/" + data);

/**
 * Authenticate user cookie
 * @name POST/api/users/auth
 * @body {string} cookie
 * @return { {id: string} } id of account
 * @throws {404} empty cookie
 * @throws {400} no user associated with userId
 */
const authenticateCookie = (data) => axios.post("/api/users/auth", data);

const requestUserFunctions = {
  getAllUsers,
  getAllNonAdminUsers,
  createUser,
  isSignedIn,
  signIn,
  signOut,
  deleteAccount,
  getNameFromUUID,
  setUserName,
  setUserEmail,
  setUserPassword,
  getEmailFromUUID,
  authenticateCookie,
};

export default requestUserFunctions;

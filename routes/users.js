var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/Users");
const Templates = require("../models/Templates");
const Moderation = require("../models/Moderation");
const Contacts = require("../models/Contacts");

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
router.get("/", async (req, res) => {
  const data = await Users.getAllUsers();
  if (data == undefined) {
    res.status(200).json({ users: [] });
  } else {
    res.status(200).json({ users: data });
  }
});

/**
 * Create a user
 * @name POST/api/users/
 * @body {string} name
 * @body {string} email
 * @body {string} password
 * @return {string} - id of account created
 * @throws {400} - if invalid request
 * @throws {401} - if email already exists or banned email
 */
router.post("/", async (req, res) => {
  if (req.body.name == "" || req.body.email == "" || req.body.password == "") {
    res
      .status(400)
      .json({ error: "Username/email/password must be >0 characters" });
    return;
  }
  const emailExists = await Users.getUserExists(req.body.email.toLowerCase());
  const isBannedEmail = await Moderation.isBannedEmail(
    req.body.email.toLowerCase()
  );
  if (!emailExists && !isBannedEmail) {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userInfo = await Users.addUser(
      req.body.name,
      req.body.email.toLowerCase(),
      hashedPassword
    );
    res.status(200).json(userInfo);
  } else {
    res.status(401).json({ error: "This email is not available." });
  }
});

/**
 * Check if user is signed in
 * @name GET/api/users/isSignedIn
 * @returns { {isSignedIn: bool } } whether user is signed in
 */
router.get("/isSignedIn", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(200).json({ isSignedIn: false });
  } else {
    res.status(200).json({ isSignedIn: true });
  }
});

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
router.post("/signin", async (req, res) => {
  if (req.session.userId === undefined) {
    if (req.body.email.length === 0 || req.body.password.length === 0) {
      res.status(400).json({
        error: "The email and/or password must be at least 1 character.",
      });
    } else {
      const userInfo = await Users.findUserInfo(req.body.email.toLowerCase());
      if (userInfo == undefined) {
        res.status(401).json({ error: "No user associated with this email." });
      } else {
        const verify = await bcrypt.compare(
          req.body.password,
          userInfo.password
        );
        if (verify) {
          req.session.userId = userInfo.id;
          res.status(200).json({ id: userInfo.id });
        } else {
          res
            .status(401)
            .json({ error: "Username and/or password are incorrect" });
        }
      }
    }
  } else {
    res.status(403).json({ error: "You are already signed in." });
  }
});

/**
 * Sign out of a user session
 * @name DELETE/api/users/signout
 * @return { {id: string} } uuid of signed out user
 * @throws {401} if not signed in
 */
router.delete("/signout", (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res.status(401).json({ error: "You are not signed in." });
  } else {
    req.session.userId = undefined;
    res.status(200).json({ id: userID });
  }
});

/**
 * Get a users name from uuid
 * @name GET/api/users/:id
 * @param {string} id
 * @returns { { name: string } } name of user
 * @throws {401} if no id given or id doesnt correspond to user
 */
router.get("/:id", async (req, res) => {
  if (req.params.id == "") {
    res.status(400).json({ error: "No id given." });
  } else {
    const userInfo = await Users.findUser(req.params.id);
    if (userInfo === undefined) {
      res.status(400).json({ error: "No user associated with this id" });
    } else {
      res.status(200).json({ name: userInfo.name });
    }
  }
});

/**
 * Deletes the logged in users account
 * @name DELETE/api/users/
 * @body {string} password
 * @returns { { message: string } } "Deleted" if deleted
 * @throws {401} if no id given or id doesnt correspond to user
 * @throws {403} if incorrect password given
 */
router.delete("/", async (req, res) => {
  const userID = req.session.userId;
  if (req.session.userId === undefined) {
    res.status(401).json({ error: "Cannot delete a non logged in user." });
  } else {
    const userInfo = await Users.findUser(userID);
    const verify = await bcrypt.compare(req.body.password, userInfo.password);
    if (verify) {
      const publishedIDs = await Templates.getAuthorPublishedTemplatesIDs(
        userID
      );
      const draftIDs = await Templates.getAuthorDraftTemplateIDs(userID);
      for (let row of publishedIDs) {
        await Templates.removeTemplate(row.id);
      }
      for (let row of draftIDs) {
        await Templates.removeTemplate(row.id);
      }
      await Users.deleteBookmarks(userID);
      await Templates.deleteComments(userID);
      await Users.deleteUser(userID);
      await Contacts.deleteAllContactsForUser(userID);
      await Moderation.resolveUser(userID);
      await Moderation.removeAdmin(userID);
      //req.session.userId = undefined;
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(403).json({ error: "Incorrect password for given user." });
    }
  }
});

/**
 * Changes user name for signed in user
 * @name PUT/api/users/name
 * @body {string} name
 * @body {string} password
 * @returns { {name: string } } new name of user
 * @throws {400} for empty name
 * @throws {401} for not signed in user
 * @throws {403} for incorrect password for user
 */
router.put("/name", async (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res
      .status(401)
      .json({ error: "Cannot change name for a non signed in user." });
  } else if (req.body.name == "") {
    res
      .status(400)
      .json({ error: "Name has to be at least one character long" });
  } else {
    const userInfo = await Users.findUser(userID);
    const verify = await bcrypt.compare(req.body.password, userInfo.password);
    if (verify) {
      await Users.setName(userID, req.body.name);
      res.status(200).json({ name: req.body.name });
    } else {
      res.status(403).json({ error: "Incorrect password for given user." });
    }
  }
});

/**
 * Changes user email for signed in user
 * @name PUT/api/users/email
 * @body {string} email
 * @body {string} password
 * @returns { {email: string } } new email of user
 * @throws {400} for empty email or already taken email
 * @throws {401} for not signed in user
 * @throws {403} for incorrect password for user
 */
router.put("/email", async (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res
      .status(401)
      .json({ error: "Cannot change email for a non signed in user." });
  } else if (req.body.email == "") {
    res.status(400).json({ error: "Cannot set email to empty email" });
  } else {
    const userInfo = await Users.findUser(userID);
    const verify = await bcrypt.compare(req.body.password, userInfo.password);
    if (verify) {
      const emailTaken = await Users.getUserExists(req.body.email);
      if (emailTaken) {
        res.status(400).json({ error: "Email was already taken" });
      } else {
        await Users.setEmail(userID, req.body.email);
        res.status(200).json({ email: req.body.email });
      }
    } else {
      res.status(403).json({ error: "Incorrect password for given user." });
    }
  }
});

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
router.put("/password", async (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res
      .status(401)
      .json({ error: "Cannot change password for a non signed in user." });
  } else if (req.body.newPassword == "") {
    res
      .status(400)
      .json({ error: "Password has to contain at least one character." });
  } else {
    const userInfo = await Users.findUser(userID);
    const verify = await bcrypt.compare(req.body.password, userInfo.password);
    if (verify) {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      await Users.setPassword(userID, newHashedPassword);
      res.status(200).json({});
    } else {
      res
        .status(403)
        .json({ error: "Incorrect current password for given user." });
    }
  }
});

/**
 * Gets a users
 * @name GET/api/users/email/:id
 * @params {string} id - uuid of user
 * @returns { {email: string} }
 * @throws {400} if no user associated with uuid
 */
router.get("/email/:id", async (req, res) => {
  const data = await Users.findUser(req.params.id);
  if (data == undefined) {
    res.status(400).json({ error: "No user associated with uuid" });
  } else {
    res.status(200).json({ email: data.email });
  }
});

/**
 * Authenticate user cookie
 * @name POST/api/users/auth
 * @body {string} cookie
 * @return { {id: string} } id of account
 * @throws {404} empty cookie
 * @throws {400} no user associated with userId
 */
router.post("/auth", async (req, res) => {
  if (req.body.cookie === undefined) {
    res.status(404).json({ error: "Cookie not passed in" });
  } else {
    const userInfo = await Users.findUser(req.body.cookie);
    if (userInfo === undefined) {
      res.status(400).json({ error: "No user associated with this id" });
    } else {
      // user exists/authenticated
      req.session.userId = userInfo.id; // sign in
      res.status(200).json({ id: userInfo.id }); // return userId
    }
  }
});

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
router.get("/all/nonAdmin", async (req, res) => {
  const data = await Users.getAllNonAdminUsers();
  if (data == undefined) {
    res.status(200).json({ users: [] });
  } else {
    res.status(200).json({ users: data });
  }
});

module.exports = router;

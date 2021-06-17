var express = require("express");
var router = express.Router();
const Contacts = require("../models/Contacts");

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
router.post("/groups", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot add a contact group for not signed in user." });
  } else {
    if (req.body.name == undefined || req.body.name == "") {
      res.status(400).json({ error: "Cannot create group with empty name" });
    } else {
      const groupExists = await Contacts.groupExistsForUser(
        req.session.userId,
        req.body.name
      );
      if (groupExists) {
        res
          .status(400)
          .json({
            error:
              "Cannot create a group with a name that is already used for another group.",
          });
      } else {
        if (req.body.members == undefined || req.body.members.length == 0) {
          res
            .status(400)
            .json({ error: "Cannot create group with no members" });
        } else {
          const id = await Contacts.addGroup(
            req.session.userId,
            req.body.name,
            {members: req.body.members}
          );
          res.status(200).json({ id: id });
        }
      }
    }
  }
});

/**
 * Adds individual for signed in user
 * @name POST/api/contacts/individuals
 * @body {string} name - name of individual to add
 * @body {string} email - name of email to add
 * @returns {id: {string}} of individual id
 * @throws {401} for not logged in
 * @throws {400} if individual name/email is empty
 * @throws {400} if individual with email already exists for user
 */
router.post("/individuals", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({
        error: "Cannot add a contact individual for not signed in user.",
      });
  } else if (req.body.name == undefined || req.body.name == "") {
    res
      .status(400)
      .json({ error: "Cannot create contact individual with empty name" });
  } else if (req.body.email == undefined || req.body.email == "") {
    res
      .status(400)
      .json({ error: "Cannot create contact individual with empty email" });
  } else {
    const individualEmailExists = await Contacts.individualExistsForUserWithEmail(
      req.session.userId,
      req.body.email
    );
    if (individualEmailExists) {
      res
        .status(400)
        .json({
          error:
            "Cannot create an individual contact with an email that is already used for another individual.",
        });
    } else {
      const id = await Contacts.addIndividual(
        req.session.userId,
        req.body.name,
        req.body.email
      );
      res.status(200).json({ id: id });
    }
  }
});

/**
 * Gets groups for signed in user
 * @name GET/api/contacts/groups
 * @returns {groups: list<object>} (alphabetized by group name) where object corresponds to:
 *      { id: {string} uuid of group,
 *        name: {string} name of group,
 *        members: list<{name: string (possibly null), email: string}> }
 * @throws {401} for not logged in user
 */
router.get("/groups", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot get groups for non-logged in user." });
  } else {
    const data = await Contacts.getGroupsForUser(req.session.userId);
    if (data == undefined || data.length == 0) {
      res.status(200).json({ groups: [] });
      return;
    }
    const groups = [];
    for (let row of data) {
      const group = { id: row.id, name: row.group_name, members: row.members.members };
      groups.push(group);
    }
    res.status(200).json({ groups: groups });
  }
});

/**
 * Gets individuals for signed in user
 * @name GET/api/contacts/individuals
 * @returns {individuals: list<object>} (alphabetized by individual name) where object corresponds to:
 *      { id: {string} uuid of individual,
 *        name: {string} name of individual,
 *        email: {string} email of individual}
 * @throws {401} for not logged in user
 */
router.get("/individuals", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot get individuals for non-logged in user." });
  } else {
    const data = await Contacts.getIndividualsForUser(req.session.userId);
    if (data == undefined) {
      res.status(200).json({ individuals: [] });
    } else {
      res.status(200).json({ individuals: data });
    }
  }
});

/**
 * Gets contacts for signed in user
 * @name GET/api/contacts/
 * @returns { contacts: list<object>} (alphabetized by name) where object corresponds to either groups or individual object
 *      as seen in GET/api/contacts/groups and GET/api/contacts/individuals
 * @throws {401} for not logged in user
 */
router.get("/", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot get contacts for non-logged in user." });
  } else {
    const contacts = [];
    const groupData = await Contacts.getGroupsForUser(req.session.userId);
    if (!(groupData == undefined || groupData.length == 0)) {
      const groups = [];
      for (let row of groupData) {
        const group = {
          id: row.id,
          name: row.group_name,
          members: row.members.members,
        };
        groups.push(group);
      }
      contacts.push.apply(contacts, groups);
    }
    const individualData = await Contacts.getIndividualsForUser(
      req.session.userId
    );
    if (!(individualData == undefined)) {
      contacts.push.apply(contacts, individualData);
    }
    contacts.sort((a, b) => (a.name > b.name ? 1 : -1));
    res.status(200).json({ contacts: contacts });
  }
});

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
router.put("/groups", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot edit a contact group for not signed in user." });
  } else if (req.body.name == undefined || req.body.name == "") {
    res.status(400).json({ error: "Cannot change group name to empty name" });
  } else if (req.body.id == undefined || req.body.id.length != 36) {
    res.status(400).json({ error: "Group id invalid" });
  } else {
    const groupIdExists = await Contacts.groupIdExists(
      req.session.userId,
      req.body.id
    );
    const nameExistsForDiffGroup = await Contacts.groupExistsForUserButNotGroupId(
      req.session.userId,
      req.body.name,
      req.body.id
    );
    if (nameExistsForDiffGroup) {
      res
        .status(400)
        .json({
          error:
            "Cannot create a group with a name that is already used for another group.",
        });
    } else if (!groupIdExists) {
      res
        .status(400)
        .json({
          error: "Cannot edit group for group id that does not exist for user",
        });
    } else {
      if (req.body.members == undefined || req.body.members.length == 0) {
        res.status(400).json({ error: "Cannot create group with no members" });
      } else {
        const id = await Contacts.editGroup(
          req.session.userId,
          req.body.id,
          req.body.name,
          {members: req.body.members}
        );
        res.status(200).json({ id: id });
      }
    }
  }
});

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
router.put("/individuals", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({
        error: "Cannot edit an individual contact for not signed in user.",
      });
  } else if (req.body.name == undefined || req.body.name == "") {
    res
      .status(400)
      .json({ error: "Cannot change individual name to empty name" });
  } else if (req.body.id == undefined || req.body.id.length != 36) {
    res.status(400).json({ error: "Individual id invalid" });
  } else if (req.body.email == undefined || req.body.email == "") {
    res
      .status(400)
      .json({ error: "Cannot change individual email to empty email" });
  } else {
    const individualIdExists = await Contacts.individualIdExists(
      req.session.userId,
      req.body.id
    );
    const emailExistsForDiffIndividual = await Contacts.emailExistsForUserButNotIndividual(
      req.session.userId,
      req.body.email,
      req.body.id
    );
    if (emailExistsForDiffIndividual) {
      res
        .status(400)
        .json({
          error:
            "Cannot change individual email to an email that is already used for another individual.",
        });
    } else if (!individualIdExists) {
      res
        .status(400)
        .json({
          error:
            "Cannot edit individual for individual id that does not exist for user",
        });
    } else {
      const id = await Contacts.editIndividual(
        req.body.id,
        req.body.name,
        req.body.email
      );
      res.status(200).json({ id: id });
    }
  }
});

/**
 * Deletes a group for a user
 * @name DELETE/api/contacts/groups
 * @body {string} id - group to delte
 * @returns { {deleted: bool} } true if removed
 * @throws {401} if not logged in
 * @throws {400} if group id invalid or does not exist for user
 */
router.delete("/groups", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot delete a group for not signed in user." });
  } else if (req.body.id == undefined || req.body.id.length != 36) {
    res
      .status(400)
      .json({ error: "Cannot delete group for invalid group id." });
  } else {
    const groupIdExists = await Contacts.groupIdExists(
      req.session.userId,
      req.body.id
    );
    if (!groupIdExists) {
      res.status(400).json({ error: "No group id associated for this user." });
    } else {
      await Contacts.deleteGroup(req.body.id);
      res.status(200).json({ deleted: true });
    }
  }
});

/**
 * Deletes an individual for a user
 * @name DELETE/api/contacts/individuals
 * @body {string} id - individual to delete
 * @returns { {deleted: bool} } true if removed
 * @throws {401} if not logged in
 * @throws {400} if individual id invalid or does not exist for user
 */
router.delete("/individuals", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot delete an individual for not signed in user." });
  } else if (req.body.id == undefined || req.body.id.length != 36) {
    res
      .status(400)
      .json({ error: "Cannot delete individual for invalid individual id." });
  } else {
    const individualIdExists = await Contacts.individualIdExists(
      req.session.userId,
      req.body.id
    );
    if (!individualIdExists) {
      res
        .status(400)
        .json({ error: "No individual id associated for this user." });
    } else {
      await Contacts.deleteIndividual(req.body.id);
      res.status(200).json({ deleted: true });
    }
  }
});

module.exports = router;

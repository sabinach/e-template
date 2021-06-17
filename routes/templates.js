var express = require("express");
const Moderation = require("../models/Moderation");
var router = express.Router();
const Templates = require("../models/Templates");
const Users = require("../models/Users");
const Locations = require("../models/Locations");

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
router.post("/", async (req, res) => { // TODO
  if (req.session.userId === undefined) {
    res.status(401).json({ error: "Sign in to create a template!" });
  } else {
    if (req.body.published == undefined) {
      res.status(400).json({ error: "Published bool must be specified." });
    } else {
      const template = await Templates.addTemplate(
        req.session.userId,
        req.body.title,
        req.body.blurb,
        req.body.locationId,
        req.body.locationName,
        req.body.tags,
        {recipients: req.body.toRecipients},
        {recipients: req.body.ccRecipients},
        {recipients: req.body.bccRecipients},
        req.body.subject,
        req.body.content,
        req.body.published
      );
      res.status(200).json({ id: template });
    }
  }
});

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
router.put("/id", async (req, res) => { // TODO
  const id = req.body.id;
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "You must be logged in to edit a template." });
  } else {
    const data = await Templates.getTemplateById(id);
    if (data.creator_id !== req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot edit templates you didn't write." });
    } else if (req.body.published == undefined) {
      res.status(400).json({ error: "Published bool must be specified." });
    } else {
      const template = await Templates.editTemplate(
        id,
        req.body.title,
        req.body.blurb,
        req.body.locationId,
        req.body.locationName,
        req.body.tags,
        {recipients: req.body.toRecipients},
        {recipients: req.body.ccRecipients},
        {recipients: req.body.bccRecipients},
        req.body.subject,
        req.body.content,
        req.body.published,
        data.published
      );
      res.status(200).json({ id: template.id });
    }
  }
});

/**
 * Deletes template with id
 * @name DELETE/api/templates/id
 * @body {string} id
 * @throws {400} for no template associated with id
 * @throws {401} for not logged
 * @throws {403} for not correct author
 * @returns { {message: string} } - message saying its been deleted
 */
router.delete("/id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "You must be logged in to delete a template." });
  } else {
    const data = await Templates.getTemplateById(req.body.id);
    if (data === undefined) {
      res.status(400).json({ error: "No template associated with this id" });
    } else if (data.creator_id !== req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot delete templates you didn't write." });
    } else {
      await Templates.removeTemplate(req.body.id);
      res.status(200).json({ message: "Deleted" });
    }
  }
});

/**
 * Publishes a template with id
 * @name PUT/api/templates/publish/id
 * @body {string} id - template id to publish
 * @returns { {message: string} } saying its been published
 * @throws {400} if no template associated with id
 * @throws {401} if not logged in
 * @throws {403} if not users own template
 */
router.put("/publish/id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "You must be logged in to publish a template" });
  } else {
    const data = await Templates.getTemplateById(req.body.id);
    if (data === undefined) {
      res.status(400).json({ error: "No template associated with this id" });
    } else if (data.creator_id !== req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot publish templates you didn't write." });
    } else {
      await Templates.publish(req.body.id);
      res.status(200).json({ message: "Published" });
    }
  }
});

/**
 * Unpublishes a template with id
 * @name PUT/api/templates/unpublish/id
 * @body {string} id - template to unpublish
 * @returns { {message: string} } saying its been unpublished
 * @throws {400} if no template associated with id
 * @throws {401} if not logged in
 * @throws {403} if not users own template
 */
router.put("/unpublish/id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "You must be logged in to unpublish a template" });
  } else {
    const data = await Templates.getTemplateById(req.body.id);
    if (data === undefined) {
      res.status(400).json({ error: "No template associated with this id" });
    } else if (data.creator_id !== req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot unpublish templates you didn't write." });
    } else {
      await Templates.unpublish(req.body.id);
      res.status(200).json({ message: "Unpublished" });
    }
  }
});

/**
 * Creates a duplicate from given id
 * NOTE: initializes it to an unpublished draft
 * @name POST/api/templates/duplicate/:id
 * @params {string} id - id of template to duplicate
 * @returns { { id: string } } uuid of new duplicated template
 * @throws {401} if not logged in
 * @throws {400} if no template associated with id
 */
router.post("/duplicate/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "You must be logged in to duplicate a template." });
  } else {
    const isValid = await Templates.getTemplateExists(req.params.id);
    if (isValid) {
      const newId = await Templates.createDuplicate(
        req.params.id,
        req.session.userId
      );
      res.status(200).json({ id: newId });
    } else {
      res.status(400).json({ error: "No template associated for given id." });
    }
  }
});

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
router.get("/id/:id", async (req, res) => { // TODO
  const id = req.params.id;
  if (id === undefined) {
    res.status(400).json({ error: "No id was passed in" });
    return;
  }
  const data = await Templates.getTemplateById(id);
  if (data === undefined) {
    res.status(400).json({ error: "No template exists with this id." });
    return;
  }
  const tags = await Templates.getTags(id);
  const to = await Templates.getToRecipients(id);
  const cc = await Templates.getCCRecipients(id);
  const bcc = await Templates.getBCCRecipients(id);
  const author = await Users.findUser(data.creator_id);
  data.author = author.name;
  data.tags = tags.map((row) => row.tag);
  data.display_location = await Locations.getPlaceName(data.location_id);
  data.toRecipients = to.recipients;
  data.ccRecipients = cc.recipients;
  data.bccRecipients = bcc.recipients;
  res.status(200).json(data);
});

/**
 * Gets template info for multiple template ids
 * @name POST/api/templates/ids
 * @body {list<string>} ids
 * @returns {list<object>} data - where <object> corresponds to:
 *      {id: string,
 *        title: string,
 *        blurb: string,
 *        location: string,
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
router.post("/ids", async (req, res) => { // TODO
  const ids = req.body.ids;
  const data = [];
  if (ids == [] || ids == "") {
    res.status(400).json({ error: "Must send at least one id" });
    return;
  }
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const tempData = await Templates.getTemplateById(id);
    if (tempData != undefined) {
      const tags = await Templates.getTags(id);
      const to = await Templates.getToRecipients(id);
      const cc = await Templates.getCCRecipients(id);
      const bcc = await Templates.getBCCRecipients(id);
      const author = await Users.findUser(tempData.creator_id);
      tempData.author = author.name;
      tempData.tags = tags.map((row) => row.tag);
      tempData.display_location = await Locations.getPlaceName(tempData.location_id);
      tempData.toRecipients = to.recipients;
      tempData.ccRecipients = cc.recipients;
      tempData.bccRecipients = bcc.recipients;
      data.push(tempData);
    }
  }
  res.status(200).json({ data: data });
});

/**
 * Find all published template ids
 * @name GET/api/templates/
 * @returns { {ids: list<string>} }
 */
router.get("/", async (req, res) => {
  const data = await Templates.getPublishedTemplateIDs();
  if (data.length === 0) {
    res.status(200).json({ ids: [] });
  } else {
    const ids = data.map((row) => row.id);
    res.status(200).json({ ids: ids });
  }
});

/**
 * Find all published templates with filters
 * @name POST/api/templates/filters
 * @body {list<string>} tags
 * @body {list<string>} authors (names not uuid)
 * @body {list<string>} locations
 * @returns { { ids: list<string> } }
 */
router.post("/filters", async (req, res) => { // TODO
  const templateIds = [];
  if (!(req.body.tags == [] || req.body.tags == "")) {
    for (let i = 0; i < req.body.tags.length; i++) {
      const tag = req.body.tags[i];
      const data = await Templates.getTemplateIDsForTag(tag);
      if (data.length != 0) {
        const ids = data.map((row) => row.template_id);
        templateIds.push.apply(templateIds, ids);
      }
    }
  }
  if (!(req.body.locations == [] || req.body.locations == "")) {
    for (let i = 0; i < req.body.locations.length; i++) {
      const location_id = req.body.locations[i];
      const data = await Templates.getTemplateIDsForLocation(location_id);
      if (data.length != 0) {
        const ids = data.map((row) => row.id);
        templateIds.push.apply(templateIds, ids);
      }
    }
  }
  if (!(req.body.authors == [] || req.body.authors == "")) {
    let creatorIds = [];
    for (let i = 0; i < req.body.authors.length; i++) {
      const name = req.body.authors[i];
      const data = await Users.getUserIdsFromName(name);
      if (data.length != 0) {
        const ids = data.map((row) => row.id);
        creatorIds.push.apply(creatorIds, ids);
      }
    }
    if (!(creatorIds == [])) {
      for (let i = 0; i < creatorIds.length; i++) {
        const creatorId = creatorIds[i];
        const data = await Templates.getAuthorPublishedTemplatesIDs(creatorId);
        if (data.length != 0) {
          const ids = data.map((row) => row.id);
          templateIds.push.apply(templateIds, ids);
        }
      }
    }
    if (!(creatorIds == [])) {
      for (let i = 0; i < creatorIds.length; i++) {
        const creatorId = creatorIds[i];
        const data = await Templates.getAuthorDraftTemplateIDs(creatorId);
        if (data.length != 0) {
          const ids = data.map((row) => row.id);
          templateIds.push.apply(templateIds, ids);
        }
      }
    }
  }
  const noDupes = [...new Set(templateIds)];
  if (noDupes.length !== 0) {
    const data = await Templates.getTemplateIDsInOrder(
      noDupes.map((i) => `'${i}'`).join(",")
    );
    const ids = data.map((row) => row.id);
    res.status(200).json({ ids: ids });
  } else {
    res.status(200).json({ ids: [] });
  }
});

/**
 * Find templates IDs by tag
 * @name POST/api/templates/tags
 * @body {list<string>} tags - list of tags
 * @return { {ids: list<string>} } list of ids
 * @throws {400} if empty tag
 */
router.post("/tags", async (req, res) => {
  if (req.body.tags === [] || req.body.tags === "") {
    res.status(400).json({ error: "Cannot filter for empty tags" });
  } else {
    let templateIds = [];
    for (let i = 0; i < req.body.tags.length; i++) {
      const tag = req.body.tags[i];
      const lowerTag = tag.toLowerCase();
      const data = await Templates.getTemplateIDsForTag(lowerTag);
      if (data.length !== 0) {
        const ids = data.map((row) => row.template_id);
        templateIds.push.apply(templateIds, ids);
      }
    }
    const noDupes = [...new Set(templateIds)];
    if (noDupes.length !== 0) {
      const data = await Templates.getTemplateIDsInOrder(
        noDupes.map((i) => `'${i}'`).join(",")
      );
      const ids = data.map((row) => row.id);
      res.status(200).json({ ids: ids });
    } else {
      res.status(200).json({ ids: [] });
    }
  }
  res.status(200).json({ ids: templateIds });
});

/**
 * Find template IDs by location
 * @name POST/api/templates/locations
 * @body {list<string>} locations - list of location ids
 * @return { {ids: list<string>} } list of locations
 * @throws {400} if empty location
 */
router.post("/locations", async (req, res) => { // TODO
  if (req.body.locations === [] || req.body.locations === "") {
    res.status(400).json({ error: "Cannot filter for empty location" });
  } else {
    let templateIds = [];
    for (let i = 0; i < req.body.locations.length; i++) {
      const location_id = req.body.locations[i];
      const data = await Templates.getTemplateIDsForLocation(location_id);
      if (data.length !== 0) {
        const ids = data.map((row) => row.id);
        templateIds.push.apply(templateIds, ids);
      }
    }
    res.status(200).json({ ids: templateIds });
  }
});

/**
 * Find *published* template IDs by authors
 * @name POST/api/templates/authors
 * @body {list<string>} authors - list of names of author
 * @return { {ids: list<string>} } list of ids
 * @throws {400} if empty author/author does not exist
 */
router.post("/authors", async (req, res) => {
  if (req.body.authors === [] || req.body.authors === "") {
    res.status(400).json({ error: "Cannot filter for empty authors" });
  } else {
    let creatorIds = [];
    for (let i = 0; i < req.body.authors.length; i++) {
      const name = req.body.authors[i];
      const data = await Users.getUserIdsFromName(name);
      if (data.length !== 0) {
        const ids = data.map((row) => row.id);
        creatorIds.push.apply(creatorIds, ids);
      }
    }
    if (creatorIds === []) {
      res.status(200).json({ ids: [] });
    } else {
      let templateIds = [];
      const inStatement = creatorIds.map((i) => `'${i}'`).join(",");
      const data = await Templates.getPublishedTemplatesForMultAuthors(
        inStatement
      );
      if (data.length !== 0) {
        const ids = data.map((row) => row.id);
        templateIds.push.apply(templateIds, ids);
      }
      res.status(200).json({ ids: templateIds });
    }
  }
  let templateIds = [];
  for (let i = 0; i < creatorIds.length; i++) {
    const creatorId = creatorIds[i];
    const data = await Templates.getAuthorPublishedTemplatesIDs(creatorId);
    if (data.length !== 0) {
      const ids = data.map((row) => row.id);
      templateIds.push.apply(templateIds, ids);
    }
  }
  res.status(200).json({ ids: templateIds });
});

/**
 * Find *published* template IDs by user uuid
 * @name GET/api/templates/authors/:id
 * @param {string} id
 * @returns { {ids: list<string> } } list of template ids
 * @throws {400} if empty uuid
 */
router.get("/authors/:id", async (req, res) => {
  if (req.params.id == "") {
    res.status(400).json({ error: "Cannot filter for empty uuid" });
  } else {
    const data = await Templates.getAuthorPublishedTemplatesIDs(req.params.id);
    let templateIds = [];
    if (data.length !== 0) {
      const ids = data.map((row) => row.id);
      templateIds.push.apply(templateIds, ids);
    }
    res.status(200).json({ ids: templateIds });
  }
});

/**
 * Find draft template IDs for signed in user
 * @name GET/api/templates/drafts
 * @return { {ids: list<string>} } list of ids
 * @throws {401} if user not logged in
 * @throws {403} if invalid username or username does not match logged in user
 */
router.get("/drafts", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Can't get drafts for a non logged in user." });
  } else {
    const data = await Templates.getAuthorDraftTemplateIDs(req.session.userId);
    if (data.length === 0) {
      res.status(200).json({ ids: [] });
    } else {
      const ids = data.map((row) => row.id);
      res.status(200).json({ ids: ids });
    }
  }
});

/**
 * Get template ids for signed in user bookmarked templates
 * @name GET/api/templates/bookmarks
 * @returns { { ids: list<string> } } bookmarked template ids
 * @returns {401} if not logged in
 */
router.get("/bookmarks", async (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res.status(401).json({ error: "You are not signed in." });
  } else {
    const userInfo = await Users.findUser(req.session.userId);
    if (userInfo === undefined) {
      res.status(400).json({ error: "No user associated with this id" });
    } else {
      const data = await Users.getBookmarkedTemplates(userID);
      const ids = data.map((row) => row.template_id);
      if (ids.length !== 0) {
        const data = await Templates.getTemplateIDsInOrder(
          ids.map((i) => `'${i}'`).join(",")
        );
        const orderedIds = data.map((row) => row.id);
        res.status(200).json({ ids: orderedIds });
      } else {
        res.status(200).json({ ids: [] });
      }
    }
  }
});

/**
 * Adds template to users bookmarked templates
 * @name POST/api/templates/bookmarks/:id
 * @params {string} id - template id to be bookmarked
 * @returns { {template_id: string }} template that was bookmarked
 * @throws {400} if no template associated w ID or template already bookmarked
 * @throws {401} if user not signed in
 */
router.post("/bookmarks/:id", async (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res
      .status(401)
      .json({ error: "Cannot add bookmark for not signed in user." });
  } else {
    const validTemplate = await Templates.getTemplateExists(req.params.id);
    if (validTemplate) {
      const isBookmarked = await Users.hasBookmark(userID, req.params.id);
      if (isBookmarked) {
        res.status(400).json({ error: "User already bookmarked template" });
      } else {
        await Users.addBookmark(userID, req.params.id);
        res.status(200).json({ template_id: req.params.id });
      }
    } else {
      res.status(400).json({ error: "No template associated with this uuid" });
    }
  }
});

/**
 * Removes template from users bookmarked templates
 * @name DELETE/api/templates/bookmarks/:id
 * @params {string} id - template id to be removed
 * @returns { {template_id: string }} template that was bookmarked
 * @throws {400} if no template associated w ID or template not initially bookmarked
 * @throws {401} if user not signed in
 */
router.delete("/bookmarks/:id", async (req, res) => {
  const userID = req.session.userId;
  if (userID === undefined) {
    res
      .status(401)
      .json({ error: "Cannot add bookmark for not signed in user." });
  } else {
    const validTemplate = await Templates.getTemplateExists(req.params.id);
    if (validTemplate) {
      const isBookmarked = await Users.hasBookmark(userID, req.params.id);
      if (isBookmarked) {
        await Users.deleteBookmark(userID, req.params.id);
        res.status(200).json({ template_id: req.params.id });
      } else {
        res.status(400).json({ error: "User has not bookmarked template" });
      }
    } else {
      res.status(400).json({ error: "No template associated with this uuid" });
    }
  }
});

/**
 * Gets all tags for published templates
 * @name GET/api/templates/tags
 * @returns {tags: list<string>} all tags of published templates
 */
router.get("/tags", async (req, res) => {
  const publishedIds = await Templates.getPublishedTemplateIDs();
  if (publishedIds == undefined || publishedIds.length == 0) {
    res.status(200).json({ tags: [] });
  } else {
    const inStatement = publishedIds.map((i) => `'${i.id}'`).join(",");
    const data = await Templates.getAllTags(inStatement);
    if (data == undefined || data.length == 0) {
      res.status(200).json({ tags: [] });
    } else {
      const tags = data.map((row) => row.tag);
      const noDupes = [...new Set(tags)];
      res.status(200).json({ tags: noDupes });
    }
  }
});

/**
 * Gets all published locations
 * @name GET/api/templates/locations
 * @returns {locations: list<object> where object contains keys id and name} all locations
 */
router.get("/locations", async (req, res) => { // TODO
  const data = await Templates.getAllLocations();
  if (data == undefined || data.length == 0) {
    res.status(200).json({ locations: [] });
  } else {
    const seen = new Set();
    const locations = [];
    data.forEach(row => {
      if (!seen.has(row.id)) {
        seen.add(row.id)
        locations.push(row);
      }
    })
    res.status(200).json({ locations });
  }
});

/**
 * Gets all published authors
 * @name GET/api/templates/authors
 * @returns {authors: list<string>} all names
 */
router.get("/authors", async (req, res) => {
  const authorIds = await Templates.getAllAuthorIds();
  if (authorIds == undefined || authorIds.length == 0) {
    res.status(200).json({ authors: [] });
  } else {
    const inStatement = authorIds.map((i) => `'${i.creator_id}'`).join(",");
    const data = await Users.getAllNames(inStatement);
    if (data == undefined || data.length == 0) {
      res.status(200).json({ authors: [] });
    } else {
      const names = data.map((row) => row.name);
      const noDupes = [...new Set(names)];
      res.status(200).json({ authors: noDupes });
    }
  }
});

/**
 * Gets all draft tags for signed in user
 * @name GET/api/templates/drafts/tags
 * @returns { {tags: list<string> } } list of draft tags
 * @throws {401} for non logged in user
 */
router.get("/drafts/tags", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({ error: "Sign in to see draft tags." });
  } else {
    const draftIds = await Templates.getAuthorDraftTemplateIDs(
      req.session.userId
    );
    if (draftIds == undefined || draftIds.length == 0) {
      res.status(200).json({ tags: [] });
    } else {
      const inStatement = draftIds.map((i) => `'${i.id}'`).join(",");
      const data = await Templates.getAllTags(inStatement);
      if (data == undefined || data.length == 0) {
        res.status(200).json({ tags: [] });
      } else {
        const tags = data.map((row) => row.tag);
        const noDupes = [...new Set(tags)];
        res.status(200).json({ tags: noDupes });
      }
    }
  }
});

/**
 * Gets all draft locations for signed in user
 * @name GET/api/templates/drafts/locations
 * @returns { {locations: list<string> } } list of draft locations
 * @throws {401} for non logged in user
 */
router.get("/drafts/locations", async (req, res) => { // TODO
  if (req.session.userId === undefined) {
    res.status(401).json({ error: "Sign in to see draft locations." });
  } else {
    const data = await Templates.getAllDraftLocations(req.session.userId);
    if (data == undefined || data.length == 0) {
      res.status(200).json({ locations: [] });
    } else {
      const seen = new Set();
      const locations = [];
      data.forEach(row => {
        if (!seen.has(row.id)) {
          seen.add(row.id)
          locations.push(row);
        }
      })
      res.status(200).json({ locations });
    }
  }
});

/**
 * Adds comment to a template
 * @name POST/api/templates/comments
 * @body {string} id - template ID to comment on
 * @body {string} comment - to comment
 * @returns { {id: string} } comment id
 * @throws {401} if user not logged in
 * @throws {400} if empty comment or template id
 */
router.post("/comments", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({ error: "Sign in to comment on a template." });
  } else {
    if (req.body.comment == undefined || req.body.comment == "") {
      res.status(400).json({ error: "Cannot comment an empty comment." });
    } else {
      if (req.body.id == undefined || req.body.id == "") {
        res
          .status(400)
          .json({ error: "Cannot comment for empty template ID." });
      } else {
        const id = await Templates.addComment(
          req.session.userId,
          req.body.id,
          req.body.comment
        );
        res.status(200).json({ id: id });
      }
    }
  }
});

/**
 * Deletes a comment from a template
 * @name DELETE/api/templates/comments
 * @body {string} id - comment id to remove
 * @returns { {deleted: true} } if removed
 * @throws {401} if user not signed in
 * @throws {403} if user did not write the comment
 * @throws {400} if no comment with id exists
 */
router.delete("/comments", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({ error: "Sign in to delete your comments." });
  } else {
    if (req.body.id == undefined || req.body.id == "") {
      res.status(400).json({ error: "No comment exists with empty id" });
    } else {
      const data = await Templates.getAuthorIdForComment(req.body.id);
      if (data == undefined) {
        res.status(400).json({ error: "No comment exists with this id" });
      } else if (data.user_id != req.session.userId) {
        res.status(403).json({ error: "Cannot delete other peoples comments" });
      } else {
        await Moderation.resolveComment(req.body.id);
        await Templates.deleteComment(req.body.id);
        res.status(200).json({ deleted: true });
      }
    }
  }
});

/**
 * Gets comments for a template
 * @name GET/api/templates/comments/:id
 * @param {string} id - template id to get comments for
 * @returns { { comments: list<object>} }
 *      where <object> corresponds to
 *        { id: string,
 *          user_id: string,
 *          comment: string,
 *          commented_on: timestamp (I think string) ,
 *          name: string (the display name for user)}
 * @throws {400} if no id/empty id given
 */
router.get("/comments/:id", async (req, res) => {
  if (req.params.id == "" || req.params.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot get comments for empty templated id" });
  } else {
    const data = await Templates.getCommentsForTemplate(req.params.id);
    if (data == undefined) {
      res.status(200).json({ comments: [] });
    } else {
      res.status(200).json({ comments: data });
    }
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
const Insights = require("../models/Insights");
const Templates = require("../models/Templates");

/**
 * Adds view for template
 * @name POST/api/insights/viewCount
 * @body {string} id - of template to add view for
 * @returns { added: bool } true if added
 * @throws {400} if template id is undefined or no template exists with this id
 */
router.post("/viewCount", async (req, res) => {
  if (req.body.id == undefined) {
    res.status(400).json({ error: "Cannot add view for undefined template." });
  } else {
    const templateExists = await Templates.getTemplateExists(req.body.id);
    if (!templateExists) {
      res
        .status(400)
        .json({ error: "Cannot add view for nonexistent template." });
    } else {
      await Insights.addView(req.body.id);
      res.status(200).json({ added: true });
    }
  }
});

/**
 * Adds mail count for template
 * @name POST/api/insights/mailCount
 * @body {string} id - of template to add mail count for
 * @returns { added: bool } true if added
 * @throws {400} if template id is undefined or no template exists with this id
 */
router.post("/mailCount", async (req, res) => {
  if (req.body.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot add mail count for undefined template." });
  } else {
    const templateExists = await Templates.getTemplateExists(req.body.id);
    if (!templateExists) {
      res
        .status(400)
        .json({ error: "Cannot add mail count for nonexistent template." });
    } else {
      await Insights.addMail(req.body.id);
      res.status(200).json({ added: true });
    }
  }
});

/**
 * Adds filter buster count for template
 * @name POST/api/insights/filterBusterCount
 * @body {string} id - of template to add filter buster count for
 * @returns { added: bool } true if added
 * @throws {400} if template id is undefined or no template exists with this id
 */
router.post("/filterBusterCount", async (req, res) => {
  if (req.body.id == undefined) {
    res
      .status(400)
      .json({
        error: "Cannot add filter buster count for undefined template.",
      });
  } else {
    const templateExists = await Templates.getTemplateExists(req.body.id);
    if (!templateExists) {
      res
        .status(400)
        .json({
          error: "Cannot add filter buster count for nonexistent template.",
        });
    } else {
      await Insights.addFilterBuster(req.body.id);
      res.status(200).json({ added: true });
    }
  }
});

/**
 * Gets view count for a template
 * @name GET/api/insights/viewCount/:id
 * @param {string} id - of template to get view count for
 * @returns { viewCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
router.get("/viewCount/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Must be logged in to see template insights." });
  } else if (req.params.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot get view count for undefined template." });
  } else {
    const template = await Templates.getTemplateById(req.params.id);
    if (template == undefined) {
      res.status(400).json({ error: "No template with this id exists." });
    } else if (template.creator_id != req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot get view count for template thats not yours." });
    } else {
      const data = await Insights.getViewCount(req.params.id);
      res.status(200).json({ viewCount: data.view_count });
    }
  }
});

/**
 * Gets mail count for a template
 * @name GET/api/insights/mailCount/:id
 * @param {string} id - of template to get mail count for
 * @returns { mailCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
router.get("/mailCount/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Must be logged in to see template insights." });
  } else if (req.params.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot get mail count for undefined template." });
  } else {
    const template = await Templates.getTemplateById(req.params.id);
    if (template == undefined) {
      res.status(400).json({ error: "No template with this id exists." });
    } else if (template.creator_id != req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot get mail count for template thats not yours." });
    } else {
      const data = await Insights.getMailedCount(req.params.id);
      res.status(200).json({ mailCount: data.mail_count });
    }
  }
});

/**
 * Gets filter buster count for a template
 * @name GET/api/insights/filterBusterCount/:id
 * @param {string} id - of template to get filter buster count for
 * @returns { filterBusterCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
router.get("/filterBusterCount/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Must be logged in to see template insights." });
  } else if (req.params.id == undefined) {
    res
      .status(400)
      .json({
        error: "Cannot get filter buster count for undefined template.",
      });
  } else {
    const template = await Templates.getTemplateById(req.params.id);
    if (template == undefined) {
      res.status(400).json({ error: "No template with this id exists." });
    } else if (template.creator_id != req.session.userId) {
      res
        .status(403)
        .json({
          error: "Cannot get filter buster count for template thats not yours.",
        });
    } else {
      const data = await Insights.getFilterBusterCount(req.params.id);
      res.status(200).json({ filterBusterCount: data.filter_count });
    }
  }
});

/**
 * Gets bookmark count for a template
 * @name GET/api/insights/bookmarkCount/:id
 * @param {string} id - of template to get bookmark count for
 * @returns { bookmarkCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
router.get("/bookmarkCount/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Must be logged in to see template insights." });
  } else if (req.params.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot get bookmark count for undefined template." });
  } else {
    const template = await Templates.getTemplateById(req.params.id);
    if (template == undefined) {
      res.status(400).json({ error: "No template with this id exists." });
    } else if (template.creator_id != req.session.userId) {
      res
        .status(403)
        .json({
          error: "Cannot get bookmark count for template thats not yours.",
        });
    } else {
      const data = await Insights.getBookmarkCount(req.params.id);
      res.status(200).json({ bookmarkCount: data.bookmark_count });
    }
  }
});

/**
 * Gets comment count for a template
 * @name GET/api/insights/commentCount/:id
 * @param {string} id - of template to get comment count for
 * @returns { commentCount: int }
 * @throws {400} if no template id given or template with id does not exist
 * @throws {401} if user not logged in
 * @throws {403} if user is not the author of the template
 */
router.get("/commentCount/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Must be logged in to see template insights." });
  } else if (req.params.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot get comment count for undefined template." });
  } else {
    const template = await Templates.getTemplateById(req.params.id);
    if (template == undefined) {
      res.status(400).json({ error: "No template with this id exists." });
    } else if (template.creator_id != req.session.userId) {
      res
        .status(403)
        .json({
          error: "Cannot get comment count for template thats not yours.",
        });
    } else {
      const data = await Insights.getCommentCount(req.params.id);
      res.status(200).json({ commentCount: data.comment_count });
    }
  }
});

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
router.get("/:id", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Must be logged in to see template insights." });
  } else if (req.params.id == undefined) {
    res
      .status(400)
      .json({ error: "Cannot get insights for undefined template." });
  } else {
    const template = await Templates.getTemplateById(req.params.id);
    if (template == undefined) {
      res.status(400).json({ error: "No template with this id exists." });
    } else if (template.creator_id != req.session.userId) {
      res
        .status(403)
        .json({ error: "Cannot get insights for template thats not yours." });
    } else {
      const data = await Insights.getAllStats(req.params.id);
      res.status(200).json({
        viewCount: data.view_count,
        mailCount: data.mail_count,
        filterBusterCount: data.filter_count,
        bookmarkCount: data.bookmark_count,
        commentCount: data.comment_count,
      });
    }
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
const Moderation = require("../models/Moderation");
const Users = require("../models/Users");
const Templates = require("../models/Templates");
const Contacts = require("../models/Contacts");

/**
 * Adds a user to admin
 * @name POST/api/moderation/admins
 * @body {string} id - user id to add
 * @returns { {id: string} } uuid of added admin
 * @throws {400} if no user associated with uuid or user in admin
 * @throws {500} if unknown error inserting into admin table
 */
router.post("/admins", async (req, res) => {
  const id = req.body.id;
  const user = await Users.findUser(id);
  if (user === undefined) {
    res.status(400).json({ error: "No user associated with this id" });
  } else {
    const isAdmin = await Moderation.isAdmin(id);
    if (isAdmin) {
      res.status(400).json({ error: "User is already an admin" });
    } else {
      const inserted = await Moderation.addAdmin(id);
      if (inserted) {
        res.status(200).json({ id: id });
      } else {
        res.status(500).json({ error: "Unknown error inserted user to admin" });
      }
    }
  }
});

/**
 * Removes a user from the admins
 * @name DELETE/api/moderation/admins
 * @body {string} id - user id to remove
 * @returns { {id: string} } uuid of removed admin
 * @throws {400} if no user associated with uuid or user not in admin
 * @throws {500} if unknown error removing user
 */
router.delete("/admins", async (req, res) => {
  const id = req.body.id;
  const user = await Users.findUser(id);
  if (user === undefined) {
    res.status(400).json({ error: "No user associated with this id" });
  } else {
    const isAdmin = await Moderation.isAdmin(id);
    if (!isAdmin) {
      res.status(400).json({ error: "User is already not an admin" });
    } else {
      await Moderation.removeAdmin(id);
      res.status(200).json({ id: id });
    }
  }
});

/**
 * Gets if a user with uuid is an admin
 * @name GET/api/moderation/admins/:id
 * @params {string} id - uuid of user to check
 * @returns { {isAdmin: bool} } whether or not user is an admin
 * @throws {400} if no user associated with uuid
 */
router.get("/admins/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findUser(id);
  if (user === undefined) {
    res.status(400).json({ error: "No user associated with this id" });
  } else {
    const isAdmin = await Moderation.isAdmin(id);
    res.status(200).json({ isAdmin: isAdmin });
  }
});

/**
 * Reports a template
 * @name POST/api/moderation/reports/templates
 * @body {string} id - template id to be reported
 * @body {string} reason - reason for reporting
 * @returns { {reported: bool} } true if reported
 * @throws {401} if user not signed in
 * @throws {400} if template does not exist or user already reported template
 */
router.post("/reports/templates", async (req, res) => {
  if (req.session.userId == undefined) {
    res.status(401).json({ error: "You must be signed in to report." });
  } else {
    const templateExists = await Templates.getTemplateExists(req.body.id);
    if (!templateExists) {
      res.status(400).json({ error: "No template exists with this id." });
    } else {
      const alreadyReported = await Moderation.isTemplateReportedByUser(
        req.session.userId,
        req.body.id
      );
      if (alreadyReported) {
        res.status(400).json({ error: "Template already reported by user." });
      } else if (req.body.reason == "") {
        await Moderation.reportTemplate(req.session.userId, req.body.id);
        res.status(200).json({ reported: true });
      } else {
        await Moderation.reportTemplate(
          req.session.userId,
          req.body.id,
          req.body.reason
        );
        res.status(200).json({ reported: true });
      }
    }
  }
});

/**
 * Reports a user
 * @name POST/api/moderation/reports/users
 * @body {string} id - user id to be reported
 * @body {string} reason - reason for reporting
 * @returns { {reported: bool} } true if reported
 * @throws {401} if user not signed in
 * @throws {400} if reported user does not exist or user already reported user
 */
router.post("/reports/users", async (req, res) => {
  if (req.session.userId == undefined) {
    res.status(401).json({ error: "You must be signed in to report." });
  } else {
    const userInfo = await Users.findUser(req.body.id);
    if (userInfo === undefined) {
      res.status(400).json({ error: "No user exists with this id." });
    } else {
      const alreadyReported = await Moderation.isUserReportedByUser(
        req.session.userId,
        req.body.id
      );
      if (alreadyReported) {
        res
          .status(400)
          .json({ error: "User already reported by signed in user." });
      } else if (req.body.reason == "") {
        await Moderation.reportUser(req.session.userId, req.body.id);
        res.status(200).json({ reported: true });
      } else {
        await Moderation.reportUser(
          req.session.userId,
          req.body.id,
          req.body.reason
        );
        res.status(200).json({ reported: true });
      }
    }
  }
});

/**
 * Reports a comment
 * @name POST/api/moderation/reports/comments
 * @body {string} id - comment id to be reported
 * @body {string} reason - reason for reporting
 * @returns { {reported: bool} } true if reported
 * @throws {401} if user not signed in
 * @throws {400} if reported comment does not exist or user already reported comment
 */
router.post("/reports/comments", async (req, res) => {
  if (req.session.userId == undefined) {
    res.status(401).json({ error: "You must be signed in to report." });
  } else {
    const alreadyReported = await Moderation.isCommentReportedByUser(
      req.session.userId,
      req.body.id
    );
    if (alreadyReported) {
      res
        .status(400)
        .json({ error: "Comment already reported by signed in user." });
    } else if (req.body.reason == "") {
      await Moderation.reportComment(req.session.userId, req.body.id);
      res.status(200).json({ reported: true });
    } else {
      await Moderation.reportComment(
        req.session.userId,
        req.body.id,
        req.body.reason
      );
      res.status(200).json({ reported: true });
    }
  }
});

/**
 * Gets all current reports for templates along with reasons for admin
 * @name GET/api/moderation/reports/templates
 * @returns { {reports: list{template_id: string, reason: string (possibly null) } } }
 * @throws {401} if not signed in
 * @throws {403} if signed in but not admin
 */
router.get("/reports/templates", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot see reports for non-logged in user." });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (isAdmin) {
      const data = await Moderation.getTemplateReports();
      res.status(200).json({ reports: data });
    } else {
      res.status(403).json({ error: "Cannot see reports for non-admin user." });
    }
  }
});

/**
 * Gets all current reports for users along with reasons for admin
 * @name GET/api/moderation/reports/users
 * @returns { {reports: list{user_id: string, reason: string (possibly null) } } }
 * @throws {401} if not signed in
 * @throws {403} if signed in but not admin
 */
router.get("/reports/users", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot see reports for non-logged in user." });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (isAdmin) {
      const data = await Moderation.getUserReports();
      res.status(200).json({ reports: data });
    } else {
      res.status(403).json({ error: "Cannot see reports for non-admin user." });
    }
  }
});

/**
 * Gets all current reports for comments along with reasons for admin
 * @name GET/api/moderation/reports/comments
 * @returns { {reports: list{comment_id: string, reason: string (possibly null) } } }
 * @throws {401} if not signed in
 * @throws {403} if signed in but not admin
 */
router.get("/reports/comments", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot see reports for non-logged in user." });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (isAdmin) {
      const data = await Moderation.getCommentReports();
      res.status(200).json({ reports: data });
    } else {
      res.status(403).json({ error: "Cannot see reports for non-admin user." });
    }
  }
});

/**
 * Deletes a template due to report
 * @name DELETE/api/moderation/reports/templates/remove
 * @body {string} id - uuid of template to remove
 * @returns { {removed: bool} } true if removed
 * @throws {400} if template wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
router.delete("/reports/templates/deletion", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({
      error: "Cannot delete a reported template if you're not logged in.",
    });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (!isAdmin) {
      res.status(403).json({
        error: "Cannot delete a reported template for non admin user.",
      });
    } else {
      const isReported = await Moderation.isTemplateReported(req.body.id);
      if (isReported) {
        await Moderation.resolveTemplate(req.body.id);
        await Templates.removeTemplate(req.body.id);
        res.status(200).json({ removed: true });
      } else {
        res.status(400).json({
          error: "Cannot delete a template for an unreported template.",
        });
      }
    }
  }
});

/**
 * Resolves a template in reported templates (ignores report request)
 * @name DELETE/api/moderation/reports/templates/resolve
 * @returns { {resolved: bool} } true if resolved
 * @throws {400} if template wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
router.delete("/reports/templates/resolution", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({
      error: "Cannot resolve a report for a template if you're not logged in.",
    });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (!isAdmin) {
      res.status(403).json({
        error: "Cannot resolve a report for a template for non admin user.",
      });
    } else {
      const isReported = await Moderation.isTemplateReported(req.body.id);
      if (isReported) {
        await Moderation.resolveTemplate(req.body.id);
        res.status(200).json({ resolved: true });
      } else {
        res.status(400).json({
          error: "Cannot resolve a report for an unreported template.",
        });
      }
    }
  }
});

/**
 * Deletes a comment due to report
 * @name DELETE/api/moderation/reports/comments/deletion
 * @body {string} id - uuid of comment to remove
 * @returns { {removed: bool} } true if removed
 * @throws {400} if comment wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
router.delete("/reports/comments/deletion", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({
      error: "Cannot delete a reported comment if you're not logged in.",
    });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (!isAdmin) {
      res.status(403).json({
        error: "Cannot delete a reported comment for non admin user.",
      });
    } else {
      const isReported = await Moderation.isCommentReported(req.body.id);
      if (isReported) {
        await Moderation.resolveComment(req.body.id);
        await Templates.deleteComment(req.body.id);
        res.status(200).json({ removed: true });
      } else {
        res.status(400).json({
          error: "Cannot delete a comment for an unreported comment.",
        });
      }
    }
  }
});

/**
 * Resolves a comment in reported comments (ignores report request)
 * @name DELETE/api/moderation/reports/comments/resolution
 * @returns { {resolved: bool} } true if resolved
 * @throws {400} if comment wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
router.delete("/reports/comments/resolution", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({
      error: "Cannot resolve a report for a comment if you're not logged in.",
    });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (!isAdmin) {
      res.status(403).json({
        error: "Cannot resolve a report for a comment for non admin user.",
      });
    } else {
      const isReported = await Moderation.isCommentReported(req.body.id);
      if (isReported) {
        await Moderation.resolveComment(req.body.id);
        res.status(200).json({ resolved: true });
      } else {
        res.status(400).json({
          error: "Cannot resolve a report for an unreported template.",
        });
      }
    }
  }
});

/**
 * Gets banned user emails
 * @name GET/api/moderation/users/banned
 * @returns { emails: list<string> } banned emails
 */
router.get("/users/banned", async (req, res) => {
  const data = await Moderation.getBannedUsers();
  if (data == undefined) {
    res.status(200).json({ banned: [] });
  } else {
    const emails = data.map((row) => row.email);
    res.status(200).json({ emails: emails });
  }
});

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
router.post("/reports/users/banned", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot ban a user if you're not logged in." });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (!isAdmin) {
      res.status(403).json({ error: "Cannot ban a user for non admin user." });
    } else {
      const isReported = await Moderation.isUserReported(req.body.id);
      if (true) {
        // TODO do we still need isReported check
        const userID = req.body.id;
        const userData = await Users.findUser(userID);
        if (userData == undefined) {
          res.status(400).json({ error: "User does not exist." });
          return;
        }
        await Moderation.banUser(userID, userData.email);
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
        await Contacts.deleteAllContactsForUser(userID);
        await Templates.deleteComments(userID);
        await Users.deleteBookmarks(userID);
        await Users.deleteUser(userID);
        await Moderation.removeAdmin(userID);
        res.status(200).json({ banned: true });
      } else {
        res
          .status(400)
          .json({ error: "Cannot ban a user for an unreported user." });
      }
    }
  }
});

/**
 * Resolves a user in reported users (ignores the report)
 * @body {string} id - uuid of user to resolve
 * @returns { {resolved: bool} } true if resolved
 * @throws {400} if user wasnt reported
 * @throws {401} if admin not signed in
 * @throws {403} if signed in user is not admin
 */
router.delete("/reports/users/resolution", async (req, res) => {
  if (req.session.userId === undefined) {
    res.status(401).json({
      error: "Cannot resolve a report for a user if you're not logged in.",
    });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (!isAdmin) {
      res.status(403).json({
        error: "Cannot resolve a report for a user for non admin user.",
      });
    } else {
      const isReported = await Moderation.isUserReported(req.body.id);
      if (isReported) {
        await Moderation.resolveUser(req.body.id);
        res.status(200).json({ resolved: true });
      } else {
        res
          .status(400)
          .json({ error: "Cannot resolve a report for an unreported user." });
      }
    }
  }
});

/**
 * Gets reported template ids for a user
 * @name GET/api/moderation/reports/templates/:id
 * @params {string} id
 * @returns { reported: list<string> } ids reported
 */
router.get("/reports/templates/:id", async (req, res) => {
  const data = await Moderation.getTemplateReportsForUser(req.params.id);
  if (data == undefined) {
    res.status(200).json({ reported: [] });
  } else {
    const ids = data.map((row) => row.template_id);
    res.status(200).json({ reported: ids });
  }
});

/**
 * Gets reported comment ids for a user
 * @name GET/api/moderation/reports/comments/:id
 * @params {string} id
 * @returns { comment_id: list<string> } comment ids reported
 */
router.get("/reports/comments/:id", async (req, res) => {
  const data = await Moderation.getCommentReportsForUser(req.params.id);
  if (data == undefined) {
    res.status(200).json({ reported: [] });
  } else {
    const ids = data.map((row) => row.comment_id);
    res.status(200).json({ reported: ids });
  }
});

/**
 * Gets admins for an admin user
 * @name GET/moderation/admins
 *  @returns { { admins: list<object>} }
 *      where <object> corresponds to
 *        { user_id: string,
 *          name: string,
 *          email: string
 *        }
 * @throws {401} if not logged in
 * @throws {403} for logged in user not admin
 */
router.get("/admins", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot get admins for non logged in user." });
  } else {
    const isAdmin = await Moderation.isAdmin(req.session.userId);
    if (isAdmin) {
      const data = await Moderation.getAdmins();
      if (data == undefined) {
        res.status(200).json({ admins: [] });
      } else {
        res.status(200).json({ admins: data });
      }
    } else {
      res.status(403).json({ error: "Cannot get admins for non admin user." });
    }
  }
});

/**
 * Unbans an email
 * @name DELETE/api/moderation/reports/users/banned
 * @body {string} email - to unban
 * @returns { unbanned: bool } true if unbanned
 * @throws {400} if no email given
 * @throws {401} if not logged in
 * @throws {403} if not admin user
 */
router.delete("/reports/users/banned", async (req, res) => {
  if (req.session.userId === undefined) {
    res
      .status(401)
      .json({ error: "Cannot unban email for non logged in user." });
  } else if (req.body.email == undefined || req.body.email == "") {
    res.status(400).json({ error: "Cannot unban empty email." });
  } else {
    const isAdmin = Moderation.isAdmin(req.session.userId);
    if (isAdmin) {
      await Moderation.unbanEmail(req.body.email);
      res.status(200).json({ unbanned: true });
    } else {
      res.status(403).json({ error: "Cannot unban email for non admin user." });
    }
  }
});

module.exports = router;

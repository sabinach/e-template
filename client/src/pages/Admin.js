import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import RequestModeration from "../services/RequestModeration.js";
import RequestTemplates from "../services/RequestTemplates.js";
import RequestUsers from "../services/RequestUsers.js";
import AdminAddNew from "../components/AdminAddNew.js";
import AdminCurrentTable from "../components/AdminCurrentTable.js";
import AdminTemplateTable from "../components/AdminTemplateTable.js";
import AdminCommentTable from "../components/AdminCommentTable.js";
import AdminBannedEmails from "../components/AdminBannedEmails.js";

export default function Admin({
  sessionUsername,
  isAdmin,
  handleSessionTimeout,
}) {
  // redirection
  const history = useHistory();

  // admin states
  const [adminIds, setAdminIds] = React.useState([]);
  const [adminUserNames, setAdminUserNames] = React.useState([]);
  const [adminEmails, setAdminEmails] = React.useState([]);

  // general
  const [userNames, setUserNames] = React.useState(new Map()); // user_id -> username

  // search users
  const [emails, setEmails] = React.useState([]);
  const [emailToId, setEmailToId] = React.useState(new Map()); // email -> user_id

  // reported template states
  const [usersToTemplates, setUsersToTemplates] = React.useState(new Map()); // user_id -> [template_ids]
  const [templates, setTemplates] = React.useState(new Map()); // template_id -> [reasons]
  const [templateNames, setTemplateNames] = React.useState(new Map()); // template_id -> template title

  // reported commented states
  const [usersToComments, setUsersToComments] = React.useState(new Map()); // user_id -> [comment_ids]
  const [commentIdToTemplateId, setCommentIdToTemplateId] = React.useState(
    new Map()
  ); // comment_id -> template_id
  const [commentText, setCommentText] = React.useState([]); // comment_ids -> comment
  const [commentReasons, setCommentReasons] = React.useState(new Map()); // comment_ids -> [reasons]
  const [commentUsername, setCommentUsername] = React.useState(new Map()); // user_id -> display_name

  // banned email states
  const [bannedEmails, setBannedEmails] = React.useState([]);

  function handleError(error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      handleSessionTimeout();
    } else {
      console.log(error);
      history.push("/error");
    }
  }

  // redirect to home page if NOT signed in, or is NOT admin
  React.useEffect(() => {
    console.log("sessionUsername: ", sessionUsername);
    console.log("isAdmin: ", isAdmin);
    if (sessionUsername === "" || !isAdmin) {
      history.push("/");
      return;
    }
  }, [sessionUsername, isAdmin, history]);

  // get reported templates and users
  React.useEffect(() => {
    refreshAdminTables();
  }, []); // run once

  function refreshAdminTables() {
    getSearchUsers();
    getAdminData();
    getReportedTemplatesData();
    getReportedCommentsData();
    getBannedUsersData();
  }

  function getAdminData() {
    RequestModeration.getAdmins()
      .then((res) => {
        const admins = res.data.admins;
        console.log("admins: ", admins);
        if (admins.length > 0) {
          setAdminIds(admins.map((admin) => admin.user_id));
          setAdminUserNames(admins.map((admin) => admin.name));
          setAdminEmails(admins.map((admin) => admin.email));
        } else {
          setAdminIds([""]);
          setAdminUserNames([""]);
          setAdminEmails([""]);
        }
      })
      .catch((error) => {
        console.log("getAdmins error: ");
        handleError(error);
      });
  }

  function getSearchUsers() {
    RequestUsers.getAllNonAdminUsers()
      .then((res) => {
        const users = res.data.users;
        let emailToIdData = new Map();
        console.log("users: ", users);
        if (users.length > 0) {
          setEmails(users.map((user) => user.email));
          users.forEach((user) => {
            emailToIdData.set(user.email, user.id);
          });
        } else {
          setEmails([""]);
        }
        setEmailToId(emailToIdData);
      })
      .catch((error) => {
        console.log("getAllNonAdminUsers error: ");
        console.log(error);
      });
  }

  function getReportedTemplatesData() {
    RequestModeration.getReportedTemplates()
      .then((res) => {
        let reports = res.data.reports;
        let data = new Map();
        let ids = [];

        reports.forEach((el) => {
          let id = el.template_id;
          let reason = el.reason;
          if (!data.has(id)) {
            data.set(id, []);
            ids.push(id);
          }
          data.get(id).push(reason);
        });
        setTemplates(data);
        data.forEach((val, key) => console.log(`templates[${key}] = ${val}`));

        // template ids
        console.log(`ids: ${ids}`);
        if (ids.length === 0) return { data: { data: [] } };
        return RequestTemplates.getTemplatesByIds({ ids });
      })
      .then((res) => {
        let data = res.data.data;
        console.log(`Got templates: ${data}`);

        let userNameData = new Map();
        let templateTitleData = new Map();
        let userTemplateData = new Map();

        data.forEach((template) => {
          let creator_id = template.creator_id;
          let author = template.author;
          let template_id = template.id;
          let title = template.title;

          userNameData.set(creator_id, author);
          templateTitleData.set(template_id, title);
          if (!userTemplateData.has(creator_id)) {
            userTemplateData.set(creator_id, []);
          }
          userTemplateData.get(creator_id).push(template_id);
        });
        setUsersToTemplates(userTemplateData);
        setUserNames(userNameData);
        setTemplateNames(templateTitleData);
      })
      .catch((error) => {
        console.log("getReportedTemplates, getTemplatesByIds error: ");
        handleError(error);
      });
  }

  function getReportedCommentsData() {
    RequestModeration.getReportedComments()
      .then((res) => {
        console.log("reported comments: ", res.data.reports);
        const reports = res.data.reports;
        const idToReason = new Map();
        const idToText = new Map();
        const userCommentData = new Map();
        const commentTemplateData = new Map();
        const commentUsernameData = new Map();
        reports.forEach((report) => {
          const comment_id = report.comment_id;
          const text = report.comment;
          const reason = report.reason;
          if (!idToReason.has(comment_id)) {
            idToReason.set(comment_id, []);
            idToText.set(comment_id, text);
          }
          idToReason.get(comment_id).push(reason);
          if (!userCommentData.has(report.user_id)) {
            userCommentData.set(report.user_id, []);
          }

          if (
            !userCommentData.get(report.user_id).includes(report.comment_id)
          ) {
            userCommentData.get(report.user_id).push(report.comment_id);
          }

          if (!commentTemplateData.has(report.comment_id)) {
            commentTemplateData.set(report.comment_id, report.template_id);
          }

          if (!commentUsernameData.has(report.user_id)) {
            commentUsernameData.set(report.user_id, report.name);
          }
        });
        idToReason.forEach((val, key) =>
          console.log(`comments[${key}] = ${val}`)
        );
        setCommentReasons(idToReason);
        setCommentText(idToText);
        setUsersToComments(userCommentData);
        setCommentIdToTemplateId(commentTemplateData);
        setCommentUsername(commentUsernameData);
      })
      .catch((error) => {
        console.log("getReportedComments error: ");
        handleError(error);
      });
  }

  function getBannedUsersData() {
    RequestModeration.getBannedUsers()
      .then((res) => {
        const emails = res.data.emails;
        console.log("banned emails: ", emails);
        setBannedEmails(emails);
      })
      .catch((error) => {
        console.log("getBannedUsers error: ");
        handleError(error);
      });
  }

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-md-center mb-3">
        <Col lg="7">
          <h3>Admin Portal</h3>
          <br></br>
          <AdminAddNew
            refreshAdminTables={refreshAdminTables}
            emails={emails}
            emailToId={emailToId}
          />
          <br></br>
          <AdminCurrentTable
            sessionUsername={sessionUsername}
            adminIds={adminIds}
            adminUserNames={adminUserNames}
            adminEmails={adminEmails}
            refreshAdminTables={refreshAdminTables}
          />
          <br></br>
          {templates ? (
            <AdminTemplateTable
              usersToTemplates={usersToTemplates}
              templates={templates}
              userNames={userNames}
              templateNames={templateNames}
              refreshAdminTables={refreshAdminTables}
            />
          ) : (
            <></>
          )}

          <br></br>
          <AdminCommentTable
            usersToComments={usersToComments}
            commentIdToTemplateId={commentIdToTemplateId}
            commentUsername={commentUsername}
            commentText={commentText}
            commentReasons={commentReasons}
            refreshAdminTables={refreshAdminTables}
          />
          <br></br>
          <AdminBannedEmails
            bannedEmails={bannedEmails}
            refreshAdminTables={refreshAdminTables}
          />
        </Col>
      </Row>
    </Container>
  );
}

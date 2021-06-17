import React from "react";
import { Table, Row, Container, Button } from "react-bootstrap";
import { PersonX, Trash, CheckCircle } from "react-bootstrap-icons";
import AdminModal from "./AdminModal.js";
import "../styles/AdminTable.css";

export default function AdminCommentTable({
  usersToComments,
  commentIdToTemplateId,
  commentUsername,
  commentText,
  commentReasons,
  refreshAdminTables,
}) {
  // modal type
  const [type, setType] = React.useState(false);
  const [uuid, setUuid] = React.useState("");
  const [name, setName] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const commentTableRows = () => {
    let res = [];
    if (
      usersToComments.size > 0 &&
      commentText.size > 0 &&
      commentReasons.size > 0
    ) {
      usersToComments.forEach((comment_ids, user_id) => {
        comment_ids.forEach((comment_id, index) => {
          res.push(
            <tr key={index + comment_id}>
              {index === 0 ? (
                // User
                <td rowSpan={comment_ids.length} className="align-top">
                  <Container fluid>
                    <Row className="px-0 d-flex align-items-center">
                      <PersonX
                        className="mr-2 admin-ban-user"
                        style={{ color: "#BF0000" }}
                        onClick={(e) => {
                          setType("banUser");
                          setUuid(user_id);
                          setName(commentUsername.get(user_id));
                          setShowModal(true);
                        }}
                      />
                      {commentUsername.get(user_id)}
                    </Row>
                  </Container>
                </td>
              ) : (
                <></>
              )}
              {/* Reported Comments */}
              <td>
                <Container fluid>
                  <Row className="px-0 d-flex align-items-center">
                    <a href={`/use/${commentIdToTemplateId.get(comment_id)}`}>
                      {commentText.get(comment_id)}
                    </a>
                  </Row>
                </Container>
              </td>
              {/* Reasons */}
              <td>
                <ul className="pl-3">
                  {commentReasons &&
                  commentReasons.get(comment_id) &&
                  commentReasons.get(comment_id).length > 0 ? (
                    commentReasons
                      .get(comment_id)
                      .map((reason) => (
                        <li key={reason}>
                          {reason ? reason : "(no reason given)"}
                        </li>
                      ))
                  ) : (
                    <li>{"(no reason given)"}</li>
                  )}
                </ul>
              </td>
              {/* Actions */}
              <td>
                <Container fluid>
                  <Row className="px-0  d-flex justify-content-center">
                    <Button
                      className="mr-3 d-flex align-items-center"
                      variant="outline-success"
                      onClick={(e) => {
                        setType("resolveComment");
                        setUuid(comment_id);
                        setName(commentText.get(comment_id));
                        setShowModal(true);
                      }}
                    >
                      <CheckCircle />
                    </Button>
                    <Button
                      className="mr-3 d-flex align-items-center"
                      variant="outline-danger"
                      onClick={(e) => {
                        setType("deleteComment");
                        setUuid(comment_id);
                        setName(commentText.get(comment_id));
                        setShowModal(true);
                      }}
                    >
                      <Trash />
                    </Button>
                  </Row>
                </Container>
              </td>
            </tr>
          );
        });
      });
    }
    // no comments reported
    if (res.length === 0) {
      res.push(
        <tr key={0}>
          <td>None!</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      );
    }
    return res;
  };

  return (
    <>
      <h5>Reported Comments</h5>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Author</th>
            <th style={{ width: "20%" }}>Comment</th>
            <th style={{ width: "40%" }}>Reasons</th>
            <th style={{ width: "20%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>{commentTableRows()}</tbody>
      </Table>
      <AdminModal
        type={type}
        id={uuid}
        name={name}
        showModal={showModal}
        setShowModal={setShowModal}
        refreshAdminTables={refreshAdminTables}
      />
    </>
  );
}

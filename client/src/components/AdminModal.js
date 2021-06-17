import React from "react";
import { Modal, Button } from "react-bootstrap";
import RequestModeration from "../services/RequestModeration.js";

export default function AdminModal({
  type,
  id,
  name,
  showModal,
  setShowModal,
  refreshAdminTables,
}) {
  const greenActions = ["unbanUser", "resolveTemplate", "resolveComment"];
  const redActions = [
    "banUser",
    "removeAdmin",
    "deleteTemplate",
    "deleteComment",
  ];

  function handleConfirmAction(e) {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(false);
    refreshAdminTables();

    if (type === "unbanUser") {
      if (id !== "") {
        RequestModeration.unbanEmail({ email: id })
          .then((res) => {
            console.log("unbanned email: ", res.data.unbanned);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (type === "banUser") {
      if (id !== "") {
        RequestModeration.banReportedUser({ id })
          .then((res) => {
            console.log("banned: ", res.data.banned);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (type === "removeAdmin") {
      if (id !== "") {
        RequestModeration.removeAdmin({ id })
          .then((res) => {
            console.log("removed admin: ", res.data.id);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (type === "resolveTemplate") {
      if (id !== "") {
        RequestModeration.resolveReportedTemplate({ id })
          .then((res) => {
            console.log("resolved template: ", res.data.resolved);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (type === "deleteTemplate") {
      if (id !== "") {
        RequestModeration.deleteReportedTemplate({ id })
          .then((res) => {
            console.log("deleted template: ", res.data.removed);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (type === "resolveComment") {
      if (id !== "") {
        RequestModeration.resolveReportedComment({ id })
          .then((res) => {
            console.log("resolved comment: ", res.data.resolved);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (type === "deleteComment") {
      if (id !== "") {
        RequestModeration.deleteReportedComment({ id })
          .then((res) => {
            console.log("deleted comment: ", res.data.removed);
            refreshAdminTables();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  return (
    <Modal centered show={showModal} onHide={setShowModal}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {type === "unbanUser"
            ? 'Unban user "' + name + '"'
            : type === "banUser"
            ? 'Ban user "' + name + '"'
            : type === "removeAdmin"
            ? 'Remove admin "' + name + '"'
            : type === "resolveTemplate"
            ? 'Resolve template "' + name + '"'
            : type === "deleteTemplate"
            ? 'Delete template "' + name + '"'
            : type === "resolveComment"
            ? 'Resolve comment "' + name + '"'
            : type === "deleteComment"
            ? 'Delete comment "' + name + '"'
            : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure? This action cannot be undone.</span>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={"secondary"}
          className="rounded-pill"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant={
            greenActions.includes(type)
              ? "outline-success"
              : redActions.includes(type)
              ? "outline-danger"
              : ""
          }
          className="rounded-pill"
          onClick={handleConfirmAction}
        >
          {type === "unbanUser"
            ? "Unban"
            : type === "banUser"
            ? "Ban"
            : type === "removeAdmin"
            ? "Remove"
            : type === "resolveTemplate"
            ? "Resolve"
            : type === "deleteTemplate"
            ? "Delete"
            : type === "resolveComment"
            ? "Resolve"
            : type === "deleteComment"
            ? "Delete"
            : ""}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

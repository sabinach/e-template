import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import RequestTemplates from "../services/RequestTemplates.js";

export default function ReportCommentModal({
  comment,
  showDeleteCommentModal,
  setShowDeleteCommentModal,
  handleSessionTimeout,
  refreshComments,
}) {
  const history = useHistory();
  function handleConfirmDelete() {
    RequestTemplates.deleteCommentForTemplate({
      id: comment.id,
    })
      .then((res) => {
        console.log(`deleted comment: ${res.data.deleted}`);
        refreshComments(false);
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.status &&
          error.response.status === 401
        ) {
          handleSessionTimeout();
        } else {
          history.push("/error");
        }
      });
  }
  return (
    <Modal
      centered
      show={showDeleteCommentModal}
      onHide={setShowDeleteCommentModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete Comment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure? This action cannot be undone.</Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          className="rounded-pill"
          onClick={() => setShowDeleteCommentModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="rounded-pill"
          onClick={() => {
            setShowDeleteCommentModal(false);
            handleConfirmDelete();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

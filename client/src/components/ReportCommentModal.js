import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import RequestModeration from "../services/RequestModeration.js";

export default function ReportCommentModal({
  comment,
  showReportCommentModal,
  setShowReportCommentModal,
  handleSessionTimeout,
  refreshComments,
}) {
  const history = useHistory();
  const [reportReason, setReportReason] = React.useState("");

  function handleConfirmReport() {
    RequestModeration.reportComment({
      id: comment.id,
      reason: reportReason,
    })
      .then((res) => {
        console.log(`reported comment: ${res.data.reported}`);
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
      show={showReportCommentModal}
      onHide={setShowReportCommentModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Report Comment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              (optional) Reason for reporting this comment:
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder={"Text"}
              value={reportReason}
              onChange={(e) => {
                setReportReason(e.target.value);
              }}
              rows="4"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          className="rounded-pill"
          onClick={() => setShowReportCommentModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="rounded-pill"
          onClick={() => {
            setShowReportCommentModal(false);
            handleConfirmReport();
          }}
        >
          Submit Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

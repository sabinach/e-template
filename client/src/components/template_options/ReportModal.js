import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import RequestModeration from "../../services/RequestModeration.js";

export default function ReportModal({
  template,
  showReportTemplateModal,
  setShowReportTemplateModal,
  handleSessionTimeout,
  type,
  refreshTemplates = null,
}) {
  const history = useHistory();
  const [reportReason, setReportReason] = React.useState("");

  function handleConfirmReport() {
    RequestModeration.reportTemplate({
      id: template.id,
      reason: reportReason,
    })
      .then((res) => {
        console.log(`reported template: ${res.data.reported}`); // successfully deleted
        if (type === "templateCard") {
          console.log("refreshing page");
          refreshTemplates(false); // refresh page
        } else if (type === "templateUse") {
          console.log("redirecting home");
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status && error.response.status === 401) {
          handleSessionTimeout();
        } else {
          history.push("/error");
        }
      });
  }
  return (
    <Modal
      centered
      show={showReportTemplateModal}
      onHide={setShowReportTemplateModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Report Template
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              (optional) Reason for reporting this template:
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
          onClick={() => setShowReportTemplateModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="rounded-pill"
          onClick={() => {
            setShowReportTemplateModal(false);
            handleConfirmReport();
          }}
        >
          Submit Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

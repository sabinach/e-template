import React from "react";
import { Modal, Button } from "react-bootstrap";
import { BASE_URL } from "../../constants/ShareModal.js";

export default function ShareModal({
  showShareModal,
  setShowShareModal,
  template,
}) {
  const templateUrl = `${BASE_URL}/use/${template.id}`;
  function copyToClipboard() {
    navigator.clipboard.writeText(templateUrl);
  }
  return (
    <Modal centered show={showShareModal} onHide={setShowShareModal}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Share this template!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <a target="_blank" rel="noreferrer" href={templateUrl}>
          {templateUrl}
        </a>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          className="rounded-pill"
          onClick={() => setShowShareModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="rounded-pill"
          onClick={() => copyToClipboard()}
        >
          Copy Link
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

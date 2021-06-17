import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import RequestTemplates from "../../services/RequestTemplates.js";

export default function DeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  template,
  type,
  handleSessionTimeout,
  refreshTemplates = null,
}) {
  const history = useHistory();
  function handleConfirmDelete(e) {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteModal(false);
    RequestTemplates.deleteTemplateById({
      data: { id: template.id },
    })
      .then((res) => {
        console.log(`deleted template: ${res.data.message}`); // successfully deleted
        if (type === "templateCard") {
          refreshTemplates(false); // refresh page
        } else if (type === "templateUse") {
          history.push("/");
        } else if (type === "templateEdit") {
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
    <Modal centered show={showDeleteModal} onHide={setShowDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure you want to delete this template?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>This action cannot be undone.</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="rounded-pill"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="outline-danger"
          className="rounded-pill"
          onClick={handleConfirmDelete}
        >
          Yes, I'm sure
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

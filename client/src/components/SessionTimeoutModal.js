import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function SessionTimeoutModal({ show, onHide }) {
  const history = useHistory();
  const location = useLocation();

  function isProtected(path) {
    const protectedPages = [
      "edit",
      "create",
      "profile",
      "contacts",
      "settings",
      "admin",
    ];
    let ret = false;
    protectedPages.forEach((page) => {
      if (path.includes(page)) {
        ret = true;
      }
    });
    return ret;
  }

  function closeSessionTimeoutModal(to) {
    onHide();
    if (to) {
      history.push(to);
    } else if (isProtected(location.pathname)) {
      history.push("/");
    }
  }

  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        closeSessionTimeoutModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Session Timeout
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Your session has timed out. Please log in again to ${
          isProtected(location.pathname)
            ? "continue."
            : "access all the features e-Template has to offer!"
        }`}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={isProtected(location.pathname) ? "primary" : "outline-dark"}
          className="rounded-pill"
          onClick={() => {
            closeSessionTimeoutModal("/login");
          }}
        >
          Login
        </Button>
        {!isProtected(location.pathname) && (
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={() => {
              closeSessionTimeoutModal();
            }}
          >
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

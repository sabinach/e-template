import React from "react";
import { QuestionCircle } from "react-bootstrap-icons";
import { Modal, Button } from "react-bootstrap";

export default function HelpIcon({ title, body }) {
  const [opened, setOpened] = React.useState(false);
  return (
    <>
      <Button
        variant="link"
        className="m-0 p-0"
        onClick={() => setOpened(true)}
      >
        <QuestionCircle size={18} className="align-top" />
      </Button>
      <Modal size="sm" centered show={opened} onHide={() => setOpened(false)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="rounded-pill"
            onClick={() => setOpened(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

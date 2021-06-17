import React from "react";
import { Form, Button, Modal } from "react-bootstrap";

function ForgotPassword() {
  // forgot password
  const [opened, setOpened] = React.useState(false);
  return (
    <>
      <Form.Text className="text-right">
        <Button
          variant="link"
          size="sm"
          className="login-forgot-password"
          onClick={() => setOpened(true)}
        >
          Forgot password?
        </Button>
      </Form.Text>
      <Modal centered show={opened} onHide={() => setOpened(false)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Need help?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <a
            href={`mailto:6.170-not-fritter@mit.edu?subject=${encodeURIComponent(
              "Forgot Password"
            )}`}
          >
            Contact us by email!
          </a>
        </Modal.Body>
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

export default ForgotPassword;

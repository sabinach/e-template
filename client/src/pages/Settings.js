import React from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateVerifyPassword,
} from "../utils/Validation.js";
import RequestUsers from "../services/RequestUsers.js";
import "../styles/Settings.css";
import ForgotPassword from "../components/ForgotPassword";

export default function Settings({
  sessionUsername,
  handleSessionTimeout,
  handleLogout,
  updateDisplayName,
}) {
  const history = useHistory();
  // TODO - identify error type, invalid password stay on page and prompt again
  function handleError(error) {
    setVerifyPassword("");
    setEditType("");
    if (error.response.status === 401) {
      handleSessionTimeout();
    } else if (error.response.status === 403) {
      // alert("invalid password verification");
      setValidVerifyPassword(false);
    } else {
      console.log(error);
      history.push("/error");
    }
  }
  // redirect to home page if signed in
  React.useEffect(() => {
    if (sessionUsername === "") {
      history.push("/");
      return;
    }
  }, [sessionUsername, history]);

  // get current values on mount
  React.useEffect(() => {
    // name
    RequestUsers.getNameFromUUID(sessionUsername)
      .then((res) => {
        const name = res.data.name;
        setCurrentName(name);
      })
      .catch((error) => {
        console.log(error);
      });
    // email
    RequestUsers.getEmailFromUUID(sessionUsername)
      .then((res) => {
        const email = res.data.email;
        setCurrentEmail(email);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionUsername]);

  // states for current values
  const [currentName, setCurrentName] = React.useState("");
  const [currentEmail, setCurrentEmail] = React.useState("");

  // states for form input
  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");

  // states for form validation
  const [validName, setValidName] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState(false);
  const [validPassword, setValidPassword] = React.useState(false);
  const [validConfirmNewPassword, setValidConfirmNewPassword] = React.useState(
    false
  );
  const [validVerifyPassword, setValidVerifyPassword] = React.useState(true);

  // state for edit type
  const [editType, setEditType] = React.useState("");

  // state for success change message
  const [newNameSuccess, setNewNameSuccess] = React.useState(false);
  const [newEmailSuccess, setNewEmailSuccess] = React.useState(false);
  const [newPasswordSuccess, setNewPasswordSuccess] = React.useState(false);

  // state for modals
  const [showVerifyPasswordModal, setShowVerifyPasswordModal] = React.useState(
    false
  );
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // submit credential updates
  function handleNewName(e) {
    e.preventDefault(); // don't refresh page
    setShowVerifyPasswordModal(true);
    setEditType("name");
  }

  function handleNewEmail(e) {
    e.preventDefault(); // don't refresh page
    setShowVerifyPasswordModal(true);
    setEditType("email");
  }

  function handleNewPassword(e) {
    e.preventDefault(); // don't refresh page
    setShowVerifyPasswordModal(true);
    setEditType("password");
  }

  function handleDelete(e) {
    e.preventDefault();
    setShowDeleteModal(true);
  }

  function handleConfirmDelete() {
    setShowDeleteModal(false);
    setShowVerifyPasswordModal(true);
    setEditType("delete");
  }

  function handleVerifyPassword(e) {
    e.preventDefault(); // don't refresh page
    if (editType === "name") {
      RequestUsers.setUserName({
        name: newName,
        password: verifyPassword,
      })
        .then((res) => {
          setNewName("");
          setCurrentName(newName);
          setValidName(false);
          setVerifyPassword("");
          setValidVerifyPassword(true);
          setEditType("");
          setNewNameSuccess(true);
          updateDisplayName();
          setShowVerifyPasswordModal(false);
        })
        .catch((error) => {
          handleError(error);
        });
    } else if (editType === "email") {
      RequestUsers.setUserEmail({
        email: newEmail,
        password: verifyPassword,
      })
        .then((res) => {
          setNewEmail("");
          setCurrentEmail(newEmail);
          setValidEmail(false);
          setVerifyPassword("");
          setValidVerifyPassword(true);
          setEditType("");
          setNewEmailSuccess(true);
          setShowVerifyPasswordModal(false);
        })
        .catch((error) => {
          handleError(error);
        });
    } else if (editType === "password") {
      RequestUsers.setUserPassword({
        newPassword: newPassword,
        password: verifyPassword,
      })
        .then((res) => {
          setNewPassword("");
          setValidPassword(false);
          setConfirmNewPassword("");
          setValidConfirmNewPassword(false);
          setVerifyPassword("");
          setValidVerifyPassword(true);
          setEditType("");
          setNewPasswordSuccess(true);
          setShowVerifyPasswordModal(false);
        })
        .catch((error) => {
          handleError(error);
        });
    } else if (editType === "delete") {
      RequestUsers.deleteAccount({
        data: { password: verifyPassword },
      })
        .then((res) => {
          handleLogout();
        })
        .catch((error) => {
          handleError(error);
        });
    }
  }

  return (
    <Container>
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Row>
              <Col>
                <h3>Settings</h3>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* Change Name */}
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Change Name</Card.Title>
                    <Form
                      noValidate
                      validated={validName}
                      onSubmit={handleNewName}
                    >
                      {/* Name change success */}
                      {newNameSuccess ? (
                        <Form.Text className="text-muted" align="right">
                          Name successfully changed!
                        </Form.Text>
                      ) : (
                        <></>
                      )}

                      {/* New Name */}
                      <Form.Group>
                        <Form.Control
                          type="text"
                          value={newName}
                          placeholder={currentName}
                          onChange={(e) => {
                            setNewName(e.target.value);
                            setValidName(validateName(e.target.value));
                          }}
                          isValid={validName}
                          isInvalid={!validName && newName !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid name.
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Save */}
                      <Button
                        block
                        className="rounded-pill"
                        type="submit"
                        disabled={!validName}
                      >
                        Change name
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* Change Email */}
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Change Email</Card.Title>
                    <Form
                      noValidate
                      validated={validEmail}
                      onSubmit={handleNewEmail}
                    >
                      {/* Email change success */}
                      {newEmailSuccess ? (
                        <Form.Text className="text-muted" align="right">
                          Email successfully changed!
                        </Form.Text>
                      ) : (
                        <></>
                      )}

                      {/* New Email */}
                      <Form.Group>
                        <Form.Control
                          required
                          type="email"
                          value={newEmail}
                          placeholder={currentEmail}
                          onChange={(e) => {
                            setNewEmail(e.target.value);
                            setValidEmail(validateEmail(e.target.value));
                          }}
                          isValid={validEmail}
                          isInvalid={!validEmail && newEmail !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid email.
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Save */}
                      <Button
                        block
                        className="rounded-pill"
                        type="submit"
                        disabled={!validEmail}
                      >
                        Change email
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* Change Password */}
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Change Password</Card.Title>

                    <Form
                      noValidate
                      validated={validPassword && validConfirmNewPassword}
                      onSubmit={handleNewPassword}
                    >
                      {/* Password change success */}
                      {newPasswordSuccess ? (
                        <Form.Text className="text-muted" align="right">
                          Password successfully changed!
                        </Form.Text>
                      ) : (
                        <></>
                      )}

                      {/* New Password */}
                      <Form.Group>
                        <Form.Control
                          required
                          type="password"
                          value={newPassword}
                          placeholder="New password"
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setValidPassword(validatePassword(e.target.value));
                          }}
                          isValid={validPassword}
                          isInvalid={!validPassword && newPassword !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          Password must be at least 4 characters.
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Confirm New Password */}
                      <Form.Group>
                        <Form.Control
                          required
                          type="password"
                          value={confirmNewPassword}
                          placeholder="Retype new password"
                          onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                            setValidConfirmNewPassword(
                              validateConfirmPassword(
                                newPassword,
                                e.target.value
                              )
                            );
                          }}
                          isValid={validConfirmNewPassword}
                          isInvalid={
                            !validConfirmNewPassword &&
                            confirmNewPassword !== ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Password must match above.
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Save */}
                      <Button
                        block
                        className="rounded-pill"
                        type="submit"
                        disabled={!(validPassword && validConfirmNewPassword)}
                      >
                        Change password
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* Delete Account */}
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Delete account</Card.Title>
                    <Form noValidate onSubmit={handleDelete}>
                      <Button
                        className="rounded-pill"
                        block
                        type="submit"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* Verify Password */}
      <Modal
        centered
        show={showVerifyPasswordModal}
        onHide={setShowVerifyPasswordModal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Verify your current password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Verify Current Password */}
          <Form noValidate onSubmit={handleVerifyPassword}>
            <Form.Group>
              <Form.Control
                required
                type="password"
                value={verifyPassword}
                placeholder="Current password"
                onChange={(e) => {
                  setVerifyPassword(e.target.value);
                  setValidVerifyPassword(true);
                }}
                isInvalid={!validVerifyPassword}
              />
              <Form.Control.Feedback type="invalid">
                Incorrect password.
              </Form.Control.Feedback>
              {/* Forgot password */}
              <ForgotPassword />
            </Form.Group>
            {/* Submit */}
            <Button
              blockclassName="rounded-pill"
              type="submit"
              disabled={verifyPassword.length === 0}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirm Delete Account */}
      <Modal centered show={showDeleteModal} onHide={setShowDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Are you sure you want to delete this account?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="outline-danger"
            onClick={handleConfirmDelete}
          >
            Yes, I'm sure
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

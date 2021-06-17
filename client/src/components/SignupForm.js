import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/Validation.js";

import RequestUsers from "../services/RequestUsers.js";

function SignupForm({ handleLogin }) {
  // states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const history = useHistory();

  // states for form validation
  const [validName, setValidName] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState("");
  const [validPassword, setValidPassword] = React.useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = React.useState(false);

  const [submitDisabled, setSubmitDisabled] = React.useState(false);

  // form validation
  function validateForm() {
    // TODO: pop-up warning if password!==confirmPassword
    return (
      validateName(name) &&
      validateEmail(email) &&
      validatePassword(password) &&
      validatePassword(confirmPassword) &&
      validateConfirmPassword(password, confirmPassword)
    );
  }

  // axios handle submit
  function handleSubmit(event) {
    console.log("signup submitted: ", {
      name,
      email,
      password,
      confirmPassword,
    });
    event.preventDefault(); // don't refresh page
    setSubmitDisabled(true);
    RequestUsers.createUser({ name, email, password })
      .then((res) => {
        const userId = res.data;
        console.log("created user successful: ", userId);
        handleSignin(email, password);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setValidEmail("User already exists.");
          setSubmitDisabled(false);
        } else {
          history.push("/error");
        }
      });
  }

  function handleSignin(email, password) {
    RequestUsers.signIn({ email, password })
      .then((res) => {
        const userId = res.data.id;
        console.log("backend signin successful: ", userId);
        handleLogin(userId);
        setSubmitDisabled(false);
      })
      .catch((error) => {
        history.push("/error");
        setSubmitDisabled(false);
      });
  }

  return (
    <Container className="py-3">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group>
              <Form.Control
                required
                type="text"
                value={name}
                placeholder="your name"
                onChange={(e) => {
                  setName(e.target.value);
                  setValidName(validateName(e.target.value));
                }}
                isValid={validName}
                isInvalid={!validName && name !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Required field.
              </Form.Control.Feedback>
            </Form.Group>
            {/* Email */}
            <Form.Group>
              <Form.Control
                required
                type="email"
                value={email}
                placeholder="email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidEmail(
                    validateEmail(e.target.value) ? "" : "Invalid email"
                  );
                }}
                isValid={!validEmail && email !== ""}
                isInvalid={!!validEmail && email !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {validEmail}
              </Form.Control.Feedback>
            </Form.Group>
            {/* Password */}
            <Form.Group>
              <Form.Control
                required
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidPassword(validatePassword(e.target.value));
                }}
                isValid={validPassword}
                isInvalid={!validPassword && password !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 4 characters.
              </Form.Control.Feedback>
            </Form.Group>
            {/* Confirm Password */}
            <Form.Group>
              <Form.Control
                required
                type="password"
                value={confirmPassword}
                placeholder="confirm password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidConfirmPassword(
                    validateConfirmPassword(password, e.target.value)
                  );
                }}
                isValid={validConfirmPassword}
                isInvalid={!validConfirmPassword && confirmPassword !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Password must match above.
              </Form.Control.Feedback>
            </Form.Group>
            {/* Sign Up */}
            <Button
              block
              className="rounded-pill"
              type="submit"
              disabled={!validateForm() || submitDisabled}
            >
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupForm;

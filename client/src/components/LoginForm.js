import React from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import RequestUsers from "../services/RequestUsers.js";
import "../styles/LoginForm.css";
import ForgotPassword from "./ForgotPassword";

function LoginForm({ handleLogin }) {
  // states for form input
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // states for form validation
  const [validEmail, setValidEmail] = React.useState(true);
  const [validPassword, setValidPassword] = React.useState(true);

  // determine if button should be disabled based on form input
  function validateForm() {
    return email.length && password.length;
  }

  // axios handle submit
  function handleSubmit(e) {
    console.log("login submitted");
    e.preventDefault(); // don't refresh page

    RequestUsers.signIn({ email, password })
      .then((res) => {
        const userId = res.data.id;
        console.log("backend signin successful: ", userId);
        handleLogin(userId);
      })
      .catch((error) => {
        setValidEmail(false);
        setValidPassword(false);
        // TODO: update the error message on the login form
      });
  }

  return (
    <Container className="py-3">
      <Row>
        <Col>
          <Form noValidate onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group>
              <Form.Control
                required
                type="email"
                value={email}
                placeholder="email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                isInvalid={!validEmail && email !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Incorrect username or password.
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
                }}
                isInvalid={!validPassword && password !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Incorrect username or password.
              </Form.Control.Feedback>
              <ForgotPassword />
            </Form.Group>
            {/* Login */}
            <Button
              block
              className="rounded-pill"
              type="submit"
              disabled={!validateForm()}
            >
              Log In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;

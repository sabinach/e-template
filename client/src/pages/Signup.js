import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import SignupMessage from "../components/SignupMessage";
import SignupForm from "../components/SignupForm";
import "../styles/Signup.css";

export default function Signup({ handleLogin, sessionUsername }) {
  const history = useHistory();

  // redirect to home page if signed in
  React.useEffect(() => {
    if (sessionUsername !== "") {
      history.push("/");
      return;
    }
  }, [sessionUsername, history]);

  return (
    <Container fluid className="h-100 login-container">
      <Row className="justify-content-center h-100">
        <Col
          xl="9"
          lg="8"
          md="7"
          className="login-leftSide d-flex align-items-center"
        >
          <SignupMessage />
        </Col>
        <Col
          xl="3"
          lg="4"
          md="5"
          className="login-rightSide d-flex align-items-center"
        >
          <SignupForm handleLogin={handleLogin} />
        </Col>
      </Row>
    </Container>
  );
}

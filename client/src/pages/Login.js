import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import LoginMessage from "../components/LoginMessage";
import LoginForm from "../components/LoginForm";
import "../styles/Login.css";

export default function Login({ handleLogin, sessionUsername }) {
  const history = useHistory();
  const tipOfTheDay =
    "It’s important to make sure that your email template is personal, so that it is memorable and more likely to make an impact!";

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
          <LoginMessage tipOfTheDay={tipOfTheDay} />
        </Col>
        <Col
          xl="3"
          lg="4"
          md="5"
          className="login-rightSide d-flex align-items-center"
        >
          <LoginForm handleLogin={handleLogin} />
        </Col>
      </Row>
    </Container>
  );
}

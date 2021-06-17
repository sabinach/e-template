import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function LoginMessage({ tipOfTheDay }) {
  return (
    <Container fluid className="py-3">
      <Row>
        <Col>
          <h4 className="display-4">Welcome back</h4>
          <p className="lead">
            Log in to create, publish, and bookmark email templates.
          </p>
          <br />
          <p className="mb-1 text-muted lead medium">
            <i>Here's a tip:</i>
          </p>
          <p className="lead medium">{tipOfTheDay}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginMessage;

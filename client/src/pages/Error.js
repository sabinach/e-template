import React from "react";
import { Container, Jumbotron, Row, Col } from "react-bootstrap";

export default function Error({ errorMessage }) {
  return (
    <Container fluid>
      <Row className="mt-3">
        <Col>
          <Jumbotron>
            <h1 className="display-4">Oops!</h1>
            <p className="lead">{errorMessage}</p>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
}

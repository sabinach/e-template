import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Profile({ name }) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h4>Hello, {name}!</h4>
          <h6>Browse templates you've written or bookmarked.</h6>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;

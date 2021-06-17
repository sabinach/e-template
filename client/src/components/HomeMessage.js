import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import HelpIcon from "./HelpIcon";

function HomeMessage() {
  const body = (
    <>
      <ol className="ml-0 pl-3">
        <li>Click an email template card to start using it</li>
        <li>Edit the recipients and customize the body</li>
        <li>Finalize the content of your email</li>
        <li>Open it in your mail app and send!</li>
      </ol>
    </>
  );
  return (
    <Container fluid>
      <Row>
        <Col>
          <h4>
            Want to make your voice heard, but need help actually doing it?
          </h4>
          <h6>
            Choose a template to get started.{" "}
            <HelpIcon body={body} title="How does this work?" />
          </h6>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeMessage;

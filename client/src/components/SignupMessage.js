import React from "react";
import { Container, Row, Col } from "react-bootstrap";
function SignupMessage() {
  return (
    <Container fluid className="py-3">
      <Row>
        <Col>
          <h4 className="display-4">
            Want to make your voice heard, but need help actually doing it?
          </h4>
          <p className="lead">
            Sign up to create, publish, and bookmark email templates.
          </p>
          <br />
          <p className="lead medium">
            Thanks to resources like{" "}
            <a
              href="https://defund12.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              defund12.org
            </a>{" "}
            and{" "}
            <a
              href="https://sayitagain.carrd.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Emails for Justice
            </a>
            , making one's voice heard has never been easier — by clicking a
            link, one can contact institution leaders and government officials
            in a matter of seconds. Inspired by these activists' powerful use of
            technology, Sarah Yoon and Stephanie Yoon built an early version of
            e-Template: a tool that makes this kind of email templating simpler
            and more accessible.
          </p>
          <p className="lead medium">
            Stephanie Yoon, Sabina Chen, Tess Gustafson, and Jonathan Wang
            introduce e-Template 2.0: a platform for not only creating, but also
            finding and publishing email templates. With a greatly expanded
            feature set and an intuitive user interface, e-Template makes
            digital activism easier than ever before.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupMessage;

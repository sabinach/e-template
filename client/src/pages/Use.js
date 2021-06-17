import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TemplateUse from "../components/TemplateUse";
import { Switch, Route } from "react-router-dom";

export default function Use({
  sessionUsername,
  contacts,
  handleSessionTimeout,
}) {
  return (
    <Container className="my-3">
      <Row>
        <Col>
          <Switch>
            <Route
              path="/use/:templateId"
              children={
                <TemplateUse
                  sessionUsername={sessionUsername}
                  contacts={contacts}
                  handleSessionTimeout={handleSessionTimeout}
                />
              }
            />
          </Switch>
        </Col>
      </Row>
    </Container>
  );
}

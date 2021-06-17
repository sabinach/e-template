import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import RTE from "../components/RTE";
import { RTEInputTypes } from "../constants/RTE";
import RequestModeration from "../services/RequestModeration.js";
import LocationAutocomplete from "../components/LocationAutocomplete";

function ComponentTester({ sessionUsername, handleSessionTimeout }) {
  const iframeRef = React.useRef(null);

  /*-----------------  Admin Moderation -----------------*/

  function addAdmin(e) {
    console.log("adding sessionUsername as admin: ", sessionUsername);
    RequestModeration.addAdmin({ id: sessionUsername })
      .then((res) => {
        const id = res.data.id;
        console.log("ADDED sessionUsername as admin: ", id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteAdmin(e) {
    console.log("deleting sessionUsername as admin: ", sessionUsername);
    RequestModeration.removeAdmin({ id: sessionUsername })
      .then((res) => {
        const id = res.data.id;
        console.log("DELETED sessionUsername as admin: ", id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /*-----------------  Render -----------------*/

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Button onClick={addAdmin} variant="danger">
            Add as Admin
          </Button>
          <Button onClick={deleteAdmin} variant="danger">
            Delete Admin
          </Button>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
          Location Search
          <LocationAutocomplete
            onSelect={(selected) => {
              console.log(`selected: ${selected}`);
            }}
            showExistingLocations={false}
          />
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
          <Form>
            <RTE
              iframeRef={iframeRef}
              inputType={RTEInputTypes.BLURB}
              initialContent=""
              handleChange={() => {}}
            />
          </Form>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
          <p>Other components can be added like so!</p>
        </Col>
      </Row>
    </Container>
  );
}

export default ComponentTester;

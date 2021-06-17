import React, { useRef } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import RequestModeration from "../services/RequestModeration";

export default function AdminAddNew({ emails, emailToId, refreshAdminTables }) {
  const [selected, setSelected] = React.useState("");

  const typeaheadRef = useRef(null);

  function handleSubmit() {
    const userId = emailToId.get(selected);
    RequestModeration.addAdmin({ id: userId })
      .then((res) => {
        console.log("added admin: ", res.data.id);
        typeaheadRef.current.clear();
        refreshAdminTables();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <h5>Add Admin</h5>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Typeahead
            id="admin-search-bar"
            placeholder="Search Emails"
            options={emails}
            minLength={1}
            highlightOnlyResult
            clearButton
            shouldSelectHint
            ref={typeaheadRef}
            onChange={(selected) => {
              if (selected.length > 0) {
                setSelected(selected[0]);
              }
            }}
          />
          <InputGroup.Append>
            <Button onClick={() => handleSubmit()} variant="outline-secondary">
              Add Admin
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </div>
  );
}

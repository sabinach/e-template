import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { PencilFill } from "react-bootstrap-icons";

export default function EditDropdownItem({ template }) {
  const history = useHistory();
  function handleEditClick(e) {
    e.stopPropagation();
    e.preventDefault();
    history.push(`/edit/${template.id}`);
  }
  return (
    <Dropdown.Item as="button" onClick={handleEditClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Edit
        <PencilFill />
      </Row>
    </Dropdown.Item>
  );
}

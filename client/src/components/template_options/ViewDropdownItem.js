import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";

export default function ViewDropdownItem({ template }) {
  const history = useHistory();
  function handleViewClick(e) {
    e.stopPropagation();
    e.preventDefault();
    history.push(`/use/${template.id}`);
  }
  return (
    <Dropdown.Item as="button" onClick={handleViewClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        View
        <Eye />
      </Row>
    </Dropdown.Item>
  );
}

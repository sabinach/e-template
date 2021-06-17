import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";

export default function DeleteDropdownItem({ setShowDeleteModal }) {
  function handleDeleteClick(e) {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteModal(true);
  }
  return (
    <Dropdown.Item as="button" onClick={handleDeleteClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Delete
        <TrashFill />
      </Row>
    </Dropdown.Item>
  );
}

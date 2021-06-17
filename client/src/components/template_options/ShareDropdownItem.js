import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { ShareFill } from "react-bootstrap-icons";

export default function ShareDropdownItem({ setShowShareModal }) {
  function handleShareClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  }
  return (
    <Dropdown.Item as="button" onClick={handleShareClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Share
        <ShareFill />
      </Row>
    </Dropdown.Item>
  );
}

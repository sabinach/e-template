import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { FlagFill } from "react-bootstrap-icons";

export default function ReportDropdownItem({ setShowReportTemplateModal }) {
  function handleReportClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowReportTemplateModal(true);
  }
  return (
    <Dropdown.Item as="button" onClick={handleReportClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Report
        <FlagFill />
      </Row>
    </Dropdown.Item>
  );
}

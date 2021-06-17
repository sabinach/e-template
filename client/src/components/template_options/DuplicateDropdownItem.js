import React from "react";
import { useHistory } from "react-router-dom";
import { Dropdown, Row } from "react-bootstrap";
import { Files } from "react-bootstrap-icons";
import RequestTemplates from "../../services/RequestTemplates.js";

export default function DuplicateDropdownItem({
  template,
  handleSessionTimeout,
}) {
  const history = useHistory();
  function handleDuplicateClick(e) {
    e.stopPropagation();
    e.preventDefault();
    RequestTemplates.duplicateTemplate(template.id)
      .then((res) => {
        console.log(`duplicated template ${template.id} to ${res.data.id}`);
        history.push(`/edit/${res.data.id}`);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status && error.response.status === 401) {
          handleSessionTimeout();
        } else {
          history.push("/error");
        }
      });
  }
  return (
    <Dropdown.Item as="button" onClick={handleDuplicateClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Duplicate
        <Files />
      </Row>
    </Dropdown.Item>
  );
}

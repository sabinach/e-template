import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { XCircleFill } from "react-bootstrap-icons";
import RequestTemplates from "../../services/RequestTemplates.js";

export default function UnpublishDropdownItem({
  template,
  refreshTemplates = null,
  handleSessionTimeout,
  type = "",
  setRerender = null,
}) {
  const history = useHistory();
  function handleUnpublishClick(e) {
    e.preventDefault();
    e.stopPropagation();
    RequestTemplates.unpublishTemplateById({ id: template.id })
      .then((res) => {
        console.log(`unpublished template: ${res.data.message}`);
        if (type === "templateCard") {
          refreshTemplates(false); // refresh page
        } else if (type === "templateEdit") {
          setRerender(true); // force refresh edit page to apply changes
        } else if (type === "templateUse") {
          setRerender(true);
        }
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
    <Dropdown.Item as="button" onClick={handleUnpublishClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Unpublish
        <XCircleFill />
      </Row>
    </Dropdown.Item>
  );
}

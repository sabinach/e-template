import React from "react";
import { useHistory } from "react-router-dom";
import { Dropdown, Row } from "react-bootstrap";
import { CheckCircle } from "react-bootstrap-icons";
import RequestTemplates from "../../services/RequestTemplates.js";

export default function PublishDropdownItem({
  template,
  refreshTemplates = null,
  handleSessionTimeout,
  type = "",
  setRerender = null,
}) {
  const history = useHistory();
  function handlePublishClick(e) {
    e.preventDefault();
    e.stopPropagation();
    RequestTemplates.publishTemplateById({ id: template.id })
      .then((res) => {
        console.log(`published template: ${res.data.message}`);
        if (type === "templateCard") {
          refreshTemplates(false); // refresh page
        } else if (type === "templateEdit") {
          history.push(`/use/${template.id}`); // use page
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
    <Dropdown.Item as="button" onClick={handlePublishClick}>
      <Row className="px-3 d-flex justify-content-between align-items-center">
        Publish
        <CheckCircle />
      </Row>
    </Dropdown.Item>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import TemplateEditor from "../components/TemplateEditor";
import requestTemplateFunctions from "../services/RequestTemplates";
import { EDIT_CARD_SETTINGS_ICON_SIZE } from "../constants/TemplateEdit.js";
import BackButton from "./BackButton";

import DeleteModal from "./template_options/DeleteModal.js";
import DeleteDropdownItem from "./template_options/DeleteDropdownItem.js";
import ViewDropdownItem from "./template_options/ViewDropdownItem.js";
import OptionsDropdownToggle from "./template_options/OptionsDropdownToggle.js";

export default function TemplateEdit({
  sessionUsername,
  contacts,
  handleSessionTimeout,
}) {
  const history = useHistory();
  const { templateId } = useParams();
  const [template, setTemplate] = React.useState(null);

  const [dropdownMenu, setDropdownMenu] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  React.useEffect(() => {
    // if not logged in
    if (sessionUsername === "") {
      history.push("/");
      return;
    }
    if (templateId) {
      requestTemplateFunctions
        .getTemplateById({ id: templateId })
        .then((res) => {
          console.log(res);
          // if the sessionUsername !== template's author, redirect
          const data = res.data;
          if (data.creator_id !== sessionUsername) {
            history.push("/");
            return;
          }
          setTemplate(data);
        })
        .catch((err) => {
          history.push("/notfound");
        });
    }
  }, [templateId, sessionUsername]);

  React.useEffect(() => {
    if (template) {
      const menu = (
        <Dropdown.Menu>
          <ViewDropdownItem template={template} />
          <DeleteDropdownItem setShowDeleteModal={setShowDeleteModal} />
        </Dropdown.Menu>
      );
      setDropdownMenu(menu);
    }
  }, [template]);

  return (
    <Container className="mt-3 mb-3">
      <Row>
        <Col>
          <Container fluid>
            <Row noGutters className="justify-content-md-center">
              <Col lg="7">
                <Row>
                  <Col>
                    <h3>
                      <span className="p-0 m-0 d-flex align-items-center">
                        <BackButton />
                        <span className="px-2">{`${
                          template && templateId
                            ? template.published
                              ? "Edit Template"
                              : "Edit Draft"
                            : "Create Template"
                        }`}</span>
                        {template ? (
                          <OptionsDropdownToggle
                            THREEDOT_ICON_SIZE={EDIT_CARD_SETTINGS_ICON_SIZE}
                            dropdownMenu={dropdownMenu}
                          />
                        ) : (
                          <small></small>
                        )}
                      </span>
                    </h3>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      <Row>
        <Col>
          <TemplateEditor
            templateId={templateId}
            template={template}
            contacts={contacts}
            handleSessionTimeout={handleSessionTimeout}
          />
        </Col>
      </Row>

      {/* Confirm Delete Template */}
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        template={template}
        type={"templateEdit"}
      />
    </Container>
  );
}

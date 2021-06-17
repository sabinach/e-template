/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Container,
  Modal,
} from "react-bootstrap";
import {
  validateEmail,
  validateTitle,
  validateContent,
  validateLocation,
  validateTags,
  validateRecipients,
} from "../utils/Validation.js";
import RequestTemplates from "../services/RequestTemplates.js";
import { RTEInputTypes } from "../constants/RTE";
import RTE from "./RTE";
import TemplateEditorConstants from "../constants/TemplateEditor";
import TagInput from "./TagInput";
import RecipientInput from "./RecipientInput";
import DuplicatedFrom from "./DuplicatedFrom.js";
import ContactToken from "./ContactToken.js";
import LocationAutocomplete from "./LocationAutocomplete";
import { Token } from "react-bootstrap-typeahead";

function TemplateEditor({
  templateId = "",
  template,
  handleSessionTimeout,
  contacts,
}) {
  const history = useHistory();
  const blurbRef = React.useRef(null);
  const contentRef = React.useRef(null);

  const [title, setTitle] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [finalizedBlurb, setFinalizedBlurb] = React.useState("");
  const [finalizedContent, setFinalizedContent] = React.useState("");
  const [locationId, setLocationId] = React.useState("");
  const [locationName, setLocationName] = React.useState("");
  const [published, setPublished] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [toRecipients, setToRecipients] = React.useState([]);
  const [ccRecipients, setCcRecipients] = React.useState([]);
  const [bccRecipients, setBccRecipients] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);

  const [existingTags, setExistingTags] = React.useState([]);

  const [submitDisabled, setSubmitDisabled] = React.useState(false);
  const [pressedSave, setPressedSave] = React.useState(false);

  const [showContactModal, setShowContactModal] = React.useState(false);
  const [expandedContact, setExpandedContact] = React.useState(null);

  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [expandedGroup, setExpandedGroup] = React.useState(null);
  const [currentField, setCurrentField] = React.useState("");

  function handleError(error) {
    console.log(error);
    setSubmitDisabled(false);
    if (error.response.status === 401) {
      console.log("401");
      handleSessionTimeout();
    } else {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (template) {
      console.log(template.blurb);
      setTitle(template.title);
      setBlurb(template.blurb);
      setFinalizedBlurb(template.blurb);
      setFinalizedContent(template.content);
      setToRecipients(template.toRecipients);
      setCcRecipients(template.ccRecipients);
      setBccRecipients(template.bccRecipients);
      setContent(template.content);
      setLocationId(template.location_id);
      setLocationName(template.display_location);
      setSubject(template.subject);
      setPublished(template.published);
      setTags(template.tags);
    }
  }, [template]);

  React.useEffect(() => {
    RequestTemplates.getAllTags()
      .then((response) => {
        console.log(response.data.tags);
        setExistingTags(response.data.tags);
      })
      .catch((error) => {});
  }, []);

  // axios request hooks
  const [templateIdState, setTemplateId] = React.useState(templateId); // post response
  const [submitted, setSubmitted] = React.useState(false); // posted data successfully

  function validateTemplate() {
    return (
      validateContent(subject) ||
      validateContent(finalizedContent) ||
      validateRecipients(toRecipients) ||
      validateRecipients(ccRecipients) ||
      validateRecipients(bccRecipients)
    );
  }
  function validateFormPublish() {
    return (
      validateTitle(title) &&
      validateContent(finalizedBlurb) &&
      validateLocation(locationId) &&
      validateTags(tags, TemplateEditorConstants.MAX_TAGS) &&
      validateTemplate()
    );
  }

  function validateFormSave() {
    return (
      validateTitle(title) ||
      validateContent(finalizedBlurb) ||
      validateLocation(locationId) ||
      validateTags(tags) ||
      validateTemplate()
    );
  }

  function handleSubmit(event) {
    event.preventDefault(); // don't refresh page
    setSubmitDisabled(true);
    let data = {
      title,
      blurb: finalizedBlurb,
      locationId,
      locationName,
      published,
      subject,
      content: finalizedContent,
      tags,
      toRecipients,
      ccRecipients,
      bccRecipients,
    };

    // if new template
    if (templateIdState === "") {
      console.log(`create`);
      RequestTemplates.createTemplate(data)
        .then((res) => {
          console.log(`createTemplate response: ${res}`);
          setTemplateId(res.data.id);
          setSubmitted(true);
          return res.data.id;
        })
        .then((newId) => {
          if (redirect) {
            history.push(`/use/${newId}`);
            setTemplateId("");
          } else {
            setPressedSave(true);
            setSubmitDisabled(false);
          }
        })
        .catch((error) => {
          handleError(error);
        });
    }
    // if current template
    else {
      data.id = templateIdState;
      console.log(`edit: id ${templateIdState}`);
      RequestTemplates.editTemplate(data)
        .then((res) => {
          console.log(`editTemplate response: ${res.data.id}`);
          setSubmitted(true);
        })
        .then(() => {
          if (redirect) {
            history.push(`/use/${templateIdState}`);
            setTemplateId("");
          } else {
            setPressedSave(true);
            setSubmitDisabled(false);
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error);
        });
    }

    // TODO: differentiate between edit and create?
    // TODO: redirect to view template page
    // TODO: add success notification
  }

  const rteError = (field, isRequired) => {
    if (submitted) {
      if (published && isRequired && !validateContent(field)) {
        return "This field is required.";
      }
      if (!validateFormSave()) {
        return "At least one field needs to be filled.";
      }
    }
    return "";
  };

  function handleExpandGroup(contact, field) {
    setShowGroupModal(true);
    setExpandedGroup(contact);
    setCurrentField(field);
  }

  function groupModal() {
    if (!expandedGroup) {
      return <></>;
    }
    function updateGroup(newMembers) {
      const newGroup = { ...expandedGroup, members: newMembers };
      setExpandedGroup(newGroup);
      if (currentField === "to") {
        setToRecipients(
          toRecipients.map((recipient) => {
            if (typeof recipient === "object") {
              if (recipient.name === expandedGroup.name) {
                return newGroup;
              }
            }
            return recipient;
          })
        );
      } else if (currentField === "cc") {
        setCcRecipients(
          toRecipients.map((recipient) => {
            if (typeof recipient === "object") {
              if (recipient.name === expandedGroup.name) {
                return newGroup;
              }
            }
            return recipient;
          })
        );
      } else if (currentField === "bcc") {
        setBccRecipients(
          toRecipients.map((recipient) => {
            if (typeof recipient === "object") {
              if (recipient.name === expandedGroup.name) {
                return newGroup;
              }
            }
            return recipient;
          })
        );
      }
    }
    return (
      <>
        <p>
          Tap the "x" button to remove a group member from the recipients list.
        </p>
        {expandedGroup.members.map((member, index) =>
          typeof member === "object" ? (
            <ContactToken
              key={index}
              option={{ label: member.name, contact: member }}
              onRemove={() => {
                const newMembers = expandedGroup.members.filter(
                  (m) => m.name !== member.name
                );

                updateGroup(newMembers);
              }}
              index={index}
              tabIndex={index}
              setShowContactModal={setShowContactModal}
              setExpandedContact={setExpandedContact}
              handleExpandGroup={() => {}}
            />
          ) : (
            <Token
              key={index}
              option={member}
              onRemove={() => {
                const newMembers = expandedGroup.members.filter(
                  (m) => typeof m === "object" || m === member
                );
                updateGroup(newMembers);
              }}
              index={index}
              tabIndex={index}
            >
              {member}
            </Token>
          )
        )}
      </>
    );
  }

  return (
    <Container fluid>
      <Row noGutters className="justify-content-md-center">
        <Col lg="7">
          {template ? <DuplicatedFrom template={template} /> : <br></br>}
          <Form noValidate onSubmit={handleSubmit}>
            {/* Title */}
            <Form.Group>
              <Container fluid>
                <Row className="d-flex justify-content-space-between">
                  <Col className="px-0">
                    <Form.Label>Title*</Form.Label>
                  </Col>
                  <Col className="px-0 text-right text-muted">
                    <small>(*) required fields</small>
                  </Col>
                </Row>
              </Container>

              <Form.Control
                required
                type="text"
                value={title}
                placeholder="What is this template for?"
                onChange={(e) => {
                  if (
                    e.target.value.length <=
                    TemplateEditorConstants.MAX_TITLE_LENGTH
                  ) {
                    setTitle(e.target.value);
                    setPressedSave(false);
                  }
                }}
              />
              <Form.Text className="text-muted text-right">{`${title.length}/${TemplateEditorConstants.MAX_TITLE_LENGTH}`}</Form.Text>
              <Form.Control.Feedback type="invalid">
                Title is required.
              </Form.Control.Feedback>
            </Form.Group>

            {/* Location */}
            <Form.Group>
              <Form.Label>Location*</Form.Label>
              <LocationAutocomplete
                placeholder={
                  locationName === ""
                    ? "Where is this template relevant?"
                    : locationName
                }
                onSelect={(selected) => {
                  setLocationId(selected.id);
                  setLocationName(selected.name);
                }}
                showExistingLocations={false}
              />
              <Form.Control.Feedback type="invalid">
                Location is required.
              </Form.Control.Feedback>
            </Form.Group>

            {/* Tags */}
            <TagInput
              options={existingTags}
              handleChange={(items) => {
                setTags(items);
                setPressedSave(false);
              }}
              validate={(tag) => ""}
              maxTagLength={TemplateEditorConstants.MAX_TAG_LENGTH}
              maxTags={TemplateEditorConstants.MAX_TAGS}
              formLabel="Tags"
              selected={tags}
              placeholder="Up to three topics"
            />
            {/* Context */}
            <RTE
              inputType={RTEInputTypes.BLURB}
              initialContent={blurb}
              iframeRef={blurbRef}
              handleChange={(b) => {
                setFinalizedBlurb(b);
                setPressedSave(false);
              }}
              error={rteError(finalizedBlurb, true)}
            />
            <Card className="mt-3 mb-3">
              <Card.Body>
                {/* To */}
                <RecipientInput
                  options={contacts}
                  handleChange={(items) => {
                    setToRecipients(items);
                    setPressedSave(false);
                  }}
                  validate={(input) => {
                    return !input || validateEmail(input)
                      ? ""
                      : "Not a valid email";
                  }}
                  formLabel="To"
                  selected={toRecipients}
                  setShowContactModal={setShowContactModal}
                  setExpandedContact={setExpandedContact}
                  handleExpandGroup={handleExpandGroup}
                  field="to"
                />

                {/* Cc */}
                <RecipientInput
                  options={contacts}
                  handleChange={(items) => {
                    setCcRecipients(items);
                    setPressedSave(false);
                  }}
                  validate={(input) => {
                    return !input || validateEmail(input)
                      ? ""
                      : "Not a valid email";
                  }}
                  formLabel="Cc"
                  selected={ccRecipients}
                  setShowContactModal={setShowContactModal}
                  setExpandedContact={setExpandedContact}
                  handleExpandGroup={handleExpandGroup}
                  field="cc"
                />

                {/* BCC */}
                <RecipientInput
                  options={contacts}
                  handleChange={(items) => {
                    setBccRecipients(items);
                    setPressedSave(false);
                  }}
                  validate={(input) => {
                    return !input || validateEmail(input)
                      ? ""
                      : "Not a valid email";
                  }}
                  formLabel="Bcc"
                  selected={bccRecipients}
                  setShowContactModal={setShowContactModal}
                  setExpandedContact={setExpandedContact}
                  handleExpandGroup={handleExpandGroup}
                  field="bcc"
                />

                {/* Subject */}
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    placeholder=""
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Form.Group>

                {/* Content */}
                <RTE
                  inputType={RTEInputTypes.BODY}
                  initialContent={content}
                  iframeRef={contentRef}
                  handleChange={(c) => {
                    setFinalizedContent(c);
                    setPressedSave(false);
                  }}
                  error={rteError(finalizedContent, false)}
                />
              </Card.Body>
            </Card>

            {/* Publish and Save */}
            <Row className="justify-content-md-end">
              <Col className="text-right">
                {template ? (
                  template.published ? (
                    <>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!validateFormPublish() || submitDisabled}
                        className="rounded-pill"
                        onClick={() => setRedirect(true)}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={pressedSave ? "success" : "secondary"}
                        type="submit"
                        disabled={!validateFormSave() || submitDisabled}
                        className="rounded-pill"
                      >
                        {pressedSave
                          ? "Saved!"
                          : submitDisabled
                          ? "Saving..."
                          : "Save Draft"}
                      </Button>
                      <Button
                        className="ml-2 rounded-pill"
                        type="submit"
                        onClick={() => {
                          setPublished(true);
                          setRedirect(true);
                        }}
                        disabled={!validateFormPublish() || submitDisabled}
                      >
                        Publish
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <Button
                      variant={pressedSave ? "success" : "secondary"}
                      type="submit"
                      disabled={!validateFormSave() || submitDisabled}
                      className="rounded-pill"
                    >
                      {pressedSave
                        ? "Saved!"
                        : submitDisabled
                        ? "Saving..."
                        : "Save to Drafts"}
                    </Button>
                    <Button
                      className="ml-2 rounded-pill"
                      type="submit"
                      onClick={() => {
                        setPublished(true);
                        setRedirect(true);
                      }}
                      disabled={!validateFormPublish() || submitDisabled}
                    >
                      Publish
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Modal
        size="sm"
        centered
        show={showContactModal}
        onHide={() => {
          setShowContactModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {expandedContact ? expandedContact.name : "Contact name"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {expandedContact ? expandedContact.email : "Contact name"}
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={showGroupModal}
        onHide={() => {
          setShowGroupModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {expandedGroup ? expandedGroup.name : "Group name"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{expandedGroup ? groupModal() : "Group"}</Modal.Body>
      </Modal>
    </Container>
  );
}

export default TemplateEditor;

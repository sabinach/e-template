/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Dropdown,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import {
  PlusCircle,
  Trash,
  Pencil,
  Person,
  People,
} from "react-bootstrap-icons";
import {
  validateName,
  validateEmail,
  validateTags,
} from "../utils/Validation.js";
import RecipientInput from "../components/RecipientInput";
import RequestContacts from "../services/RequestContacts.js";
import "../styles/Contacts.css";

export default function Contacts({
  sessionUsername,
  handleSessionTimeout,
  contacts,
  updateContacts,
}) {
  const history = useHistory();
  const [
    showCreateIndividualModal,
    setShowCreateIndividualModal,
  ] = React.useState(false);
  const [showEditIndividualModal, setShowEditIndividualModal] = React.useState(
    false
  );
  const [showCreateGroupModal, setShowCreateGroupModal] = React.useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [currentContact, setCurrentContact] = React.useState(null);

  const [members, setMembers] = React.useState([]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  const [showContactModal, setShowContactModal] = React.useState(false);
  const [expandedContact, setExpandedContact] = React.useState(null);

  const [filteredGroups, setFilteredGroups] = React.useState([]);
  const [filteredIndividuals, setFilteredIndividuals] = React.useState([]);
  const [searchString, setSearchString] = React.useState("");

  function getGroups(contactList) {
    return contactList.filter((contact) => "members" in contact);
  }

  function getIndividuals(contactList) {
    return contactList.filter((contact) => "email" in contact);
  }

  React.useEffect(() => {
    const groups = getGroups(contacts);
    console.log(groups);
    const individuals = getIndividuals(contacts);
    console.log(individuals);
    setFilteredGroups(groups);
    setFilteredIndividuals(individuals);
    setSearchString("");
  }, [contacts]);

  React.useEffect(() => {
    console.log("searchstring effect");
    let newFilteredGroups = getGroups(contacts);
    let newFilteredIndividuals = getIndividuals(contacts);
    if (searchString) {
      newFilteredGroups = newFilteredGroups.filter((contact) => {
        console.log(contact);
        let groupMatch = contact.name
          .toLowerCase()
          .includes(searchString.toLowerCase());
        console.log(contact.name);
        contact.members.forEach((member) => {
          console.log(member);
          if (
            (member.name !== null &&
              member.name.toLowerCase().includes(searchString.toLowerCase())) ||
            member.email.toLowerCase().includes(searchString.toLowerCase())
          ) {
            console.log(member);
            groupMatch = true;
          }
        });
        return groupMatch || searchString === "";
      });
      newFilteredIndividuals = newFilteredIndividuals.filter((contact) => {
        if (contact.name.toLowerCase().includes(searchString.toLowerCase())) {
          return true;
        }
        if (
          "email" in contact &&
          contact.email.toLowerCase().includes(searchString.toLowerCase())
        ) {
          return true;
        }
        return searchString === "";
      });
    }
    console.log(newFilteredGroups);
    setFilteredGroups(newFilteredGroups);

    console.log(newFilteredIndividuals);
    setFilteredIndividuals(newFilteredIndividuals);
  }, [searchString, contacts]);

  function handleError(error) {
    console.log(error);
    if (error.response.status === 401) {
      handleSessionTimeout();
    } else {
      console.log(error);
      history.push("/error");
    }
  }
  // redirect to home page if NOT signed in
  React.useEffect(() => {
    if (sessionUsername === "") {
      history.push("/");
      // return;
    }
    console.log("get contacts");
  }, [sessionUsername, history]);

  function onClick(e, contact) {
    e.stopPropagation();
    setCurrentContact(contact);
    setName(contact.name);
    if ("members" in contact) {
      setShowEditGroupModal(true);
      setMembers(contact.members);
    } else {
      setShowEditIndividualModal(true);
      setEmail(contact.email);
    }
  }

  function onDelete(e, contact) {
    e.stopPropagation();
    setCurrentContact(contact);
    setShowDeleteModal(true);
  }

  function onConfirmDelete() {
    setIsSaving(true);
    console.log("deleting current contact: ", currentContact);
    if (currentContact.email) {
      // group
      RequestContacts.deleteIndividual({ id: currentContact.id })
        .then((res) => {
          console.log("DELETED individual contact: ", res.data.deleted);
          setShowDeleteModal(false);
          setCurrentContact(null);
          setName("");
          setMembers([]);
          setEmail("");
          setIsSaving(false);
          updateContacts();
        })
        .catch((error) => {
          handleError(error);
        });
    } else if (currentContact.members) {
      // individual
      RequestContacts.deleteGroup({ id: currentContact.id })
        .then((res) => {
          console.log("DELETED group contact: ", res.data.deleted);
          setShowDeleteModal(false);
          setCurrentContact(null);
          setName("");
          setMembers([]);
          setEmail("");
          setIsSaving(false);
          updateContacts();
        })
        .catch((error) => {
          handleError(error);
        });
    }
  }

  const newToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      onClick={(e) => {
        e.preventDefault();
        setCurrentContact(null);
        onClick(e);
      }}
      className="p-0 m-0 d-flex align-items-center"
      ref={ref}
    >
      <PlusCircle size={23} className="align-top new-contact-dropdown" />
    </span>
  ));

  function onAddIndividual() {
    console.log("adding individual contact: ", { name, email });
    setIsSaving(true);
    RequestContacts.addIndividual({ name, email })
      .then((res) => {
        setShowCreateIndividualModal(false);
        setCurrentContact(null);
        setName("");
        setMembers([]);
        setEmail("");
        setIsSaving(false);
        updateContacts();
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function onSaveIndividual() {
    setIsSaving(true);
    console.log("saving individual contact: ", {
      id: currentContact.id,
      name: name ? name : currentContact.name,
      email: email ? email : currentContact.email,
    });
    RequestContacts.editIndividual({
      id: currentContact.id,
      name: name ? name : currentContact.name,
      email: email ? email : currentContact.email,
    })
      .then((res) => {
        setShowEditIndividualModal(false);
        setCurrentContact(null);
        setName("");
        setMembers([]);
        setEmail("");
        setIsSaving(false);
        updateContacts();
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function onAddGroup() {
    console.log("adding group contact: ", members);
    RequestContacts.createGroup({ name, members })
      .then((res) => {
        setShowCreateGroupModal(false);
        setCurrentContact(null);
        setName("");
        setMembers([]);
        setEmail("");
        setIsSaving(false);
        updateContacts();
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function onSaveGroup() {
    setIsSaving(true);
    console.log("saving group contact: ", {
      id: currentContact.id,
      name,
      members,
    });
    RequestContacts.editGroup({
      id: currentContact.id,
      name,
      members,
    })
      .then((res) => {
        setShowEditGroupModal(false);
        setCurrentContact(null);
        setName("");
        setMembers([]);
        setEmail("");
        setIsSaving(false);
        updateContacts();
      })
      .catch((error) => {
        handleError(error);
      });
  }

  return (
    <Container>
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Row>
              <Col>
                <h3 className="d-flex align-items-center">
                  <span className="pr-2">Contacts</span>
                  <Dropdown>
                    <Dropdown.Toggle as={newToggle} />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as="button"
                        onClick={() => {
                          setShowCreateIndividualModal(true);
                          setCurrentContact(null);
                          setName("");
                          setMembers([]);
                          setEmail("");
                        }}
                      >
                        <span className="p-0 m-0 d-flex align-items-center">
                          <Person size={25} className="align-top pr-2" />
                          <span className="contact-name">Individual</span>
                        </span>
                      </Dropdown.Item>

                      <Dropdown.Item
                        as="button"
                        onClick={() => {
                          setShowCreateGroupModal(true);
                          setCurrentContact(null);
                          setMembers([]);
                          setName("");
                          setEmail("");
                        }}
                      >
                        <span className="p-0 m-0 d-flex align-items-center">
                          <People size={25} className="align-top pr-2" />
                          <span className="contact-name">Group</span>
                        </span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </h3>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row className="mt-3 justify-content-center">
        <Col lg="7">
          <Container fluid>
            <Form.Group className="mb-4">
              <Form.Control
                placeholder="Filter contacts by name or email"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </Form.Group>
            {filteredIndividuals.length > 0 && (
              <Card>
                <ListGroup variant="flush">
                  {filteredIndividuals.map((contact) => {
                    return (
                      <ListGroup.Item
                        key={contact.name + contact.email}
                        className="contact-item"
                        onClick={(e) => {
                          onClick(e, contact);
                        }}
                      >
                        <Row>
                          <Col className="d-flex align-items-center" md={7}>
                            <span className="p-0 m-0 d-flex align-items-center contact-name">
                              <Person size={25} className="align-top pr-2" />
                              <span className="contact-name">
                                {contact.name}
                              </span>
                            </span>
                          </Col>
                          <Col className="d-flex align-items-center justify-content-end">
                            <Button
                              size="sm"
                              className="p-1 m-0 text-dark"
                              variant="link"
                              onClick={(e) => {
                                onClick(e, contact);
                              }}
                            >
                              <Pencil size={20} />
                            </Button>
                            <span className="pr-3" />
                            <Button
                              size="sm"
                              className="p-1 m-0 text-danger"
                              variant="link"
                              onClick={(e) => onDelete(e, contact)}
                            >
                              <Trash size={20} />
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
            )}
            {filteredGroups.length > 0 && (
              <Card className="mt-4">
                <ListGroup variant="flush">
                  {filteredGroups.map((contact) => {
                    return (
                      <ListGroup.Item
                        key={contact.name + "-group"}
                        className="contact-item"
                        onClick={(e) => {
                          onClick(e, contact);
                        }}
                      >
                        <Row>
                          <Col className="d-flex align-items-center" md={7}>
                            <span className="p-0 m-0 d-flex align-items-center contact-name">
                              <People size={25} className="align-top pr-2" />
                              <span className="contact-name">
                                {contact.name}
                              </span>
                            </span>
                          </Col>
                          <Col className="d-flex align-items-center justify-content-end">
                            <Button
                              size="sm"
                              className="p-1 m-0 text-dark"
                              variant="link"
                              onClick={(e) => {
                                onClick(e, contact);
                              }}
                            >
                              <Pencil size={20} />
                            </Button>
                            <span className="pr-3" />
                            <Button
                              size="sm"
                              className="p-1 m-0 text-danger"
                              variant="link"
                              onClick={(e) => onDelete(e, contact)}
                            >
                              <Trash size={20} />
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
            )}
            {filteredIndividuals.length === 0 &&
              filteredGroups.length === 0 && (
                <p>
                  {contacts.length > 0 ? "No matches found." : "Add contacts!"}
                </p>
              )}
          </Container>
        </Col>
      </Row>

      <Modal
        centered
        show={showCreateIndividualModal}
        onHide={() => {
          if (!isSaving) {
            setShowCreateIndividualModal(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Contact (Individual)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsSaved(false);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsSaved(false);
                }}
                isInvalid={email.length > 0 && !validateEmail(email)}
              />
              <Form.Control.Feedback type="invalid">
                Not a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="secondary"
            onClick={() => {
              setShowCreateIndividualModal(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={() => {
              onAddIndividual();
            }}
            disabled={!validateName(name) || !validateEmail(email) || isSaving}
          >
            {isSaving ? "Adding..." : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showEditIndividualModal}
        onHide={() => {
          if (!isSaving) {
            setShowEditIndividualModal(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact (Individual)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder={currentContact ? currentContact.name : "Name"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsSaved(false);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                placeholder={currentContact ? currentContact.email : "Email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsSaved(false);
                }}
                isInvalid={email.length > 0 && !validateEmail(email)}
              />
              <Form.Control.Feedback type="invalid">
                Not a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="secondary"
            onClick={() => {
              setShowEditIndividualModal(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant={isSaved ? "success" : "primary"}
            onClick={() => {
              onSaveIndividual();
            }}
            disabled={
              (!validateEmail(email) && email.length > 0) ||
              (!validateName(name) && email.length === 0) ||
              isSaving
            }
          >
            {isSaved ? "Saved!" : isSaving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        centered
        show={showCreateGroupModal}
        onHide={() => {
          if (!isSaving) {
            setShowCreateGroupModal(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Contact (Group)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder={"Group Name"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsSaved(false);
                }}
              />
            </Form.Group>
            <RecipientInput
              options={contacts.filter((c) => !("members" in c))}
              handleChange={(items) => {
                setMembers(items);
                setIsSaved(false);
              }}
              validate={(input) => {
                return !input || validateEmail(input)
                  ? ""
                  : "Not a valid email";
              }}
              formLabel="Members"
              selected={members}
              setShowContactModal={setShowContactModal}
              setExpandedContact={setExpandedContact}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="secondary"
            onClick={() => {
              setShowCreateGroupModal(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={() => {
              onAddGroup();
            }}
            disabled={!validateName(name) || !validateTags(members) || isSaving}
          >
            {isSaving ? "Adding..." : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showEditGroupModal}
        onHide={() => {
          if (!isSaving) {
            setShowEditGroupModal(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact (Group)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder={
                  currentContact ? currentContact.name : "Group Name"
                }
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsSaved(false);
                }}
              />
            </Form.Group>
            <RecipientInput
              options={contacts.filter((c) => !("members" in c))}
              handleChange={(items) => {
                console.log("edit group items: ", items);
                setMembers(items);
                setIsSaved(false);
              }}
              validate={(input) => {
                return !input || validateEmail(input)
                  ? ""
                  : "Not a valid email";
              }}
              formLabel="Members"
              setShowContactModal={setShowContactModal}
              setExpandedContact={setExpandedContact}
              selected={members}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="secondary"
            onClick={() => {
              setShowEditGroupModal(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant={isSaved ? "success" : "primary"}
            onClick={() => {
              onSaveGroup();
            }}
            disabled={!validateName(name) || !validateTags(members) || isSaving}
          >
            {isSaved ? "Saved!" : isSaving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showDeleteModal}
        onHide={() => {
          if (!isSaving) {
            setShowDeleteModal(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Delete "${
            currentContact ? currentContact.name : ""
          }"`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="outline-danger"
            className="rounded-pill"
            onClick={onConfirmDelete}
          >
            {isSaving ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
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
          {expandedContact ? expandedContact.email : "Contact email"}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

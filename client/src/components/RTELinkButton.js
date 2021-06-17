/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import { Link45deg } from "react-bootstrap-icons";
import { RTEConstants } from "../constants/RTE";
import "../styles/RTE.css";

const RTELinkButton = React.forwardRef(({ addContent, onChange }, ref) => {
  const [showPopover, setShowPopover] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [newLinkDisplay, setNewLinkDisplay] = React.useState("");
  const [newLinkUrl, setNewLinkUrl] = React.useState("");
  const [target, setTarget] = React.useState(null);
  const validUrl = require("valid-url");

  function onChangeNewLinkDisplay(e) {
    setNewLinkDisplay(e.target.value);
  }

  function onChangeNewLinkUrl(e) {
    setNewLinkUrl(removeHttps(e.target.value));
  }

  function newLinkOnClick(t, linkUrl, linkDisplay) {
    console.log("new link on click");
    setTarget(t);
    setNewLinkDisplay(linkDisplay);
    setNewLinkUrl(linkUrl);
    setShowEditModal(true);
  }

  React.useImperativeHandle(ref, () => ({ newLinkOnClick }));

  function onHideEditModal() {
    clearNewLink();
    setShowEditModal(false);
  }

  function addNewLink() {
    hidePopover();
    const newLink = document.createElement("a");
    newLink.href = addHttps(removeHttps(newLinkUrl));
    newLink.innerHTML = newLinkDisplay || addHttps(removeHttps(newLinkUrl));
    newLink.target = "_blank";
    newLink.rel = "noreferrer";
    newLink.onclick = (e) =>
      newLinkOnClick(e.target, newLink.href, newLink.innerHTML);
    addContent(newLink);
    clearNewLink();
  }

  function modifyTargetLink() {
    target.innerHTML = newLinkDisplay;
    target.href = newLinkUrl;
    onChange();
    onHideEditModal();
  }

  function clearNewLink() {
    setNewLinkDisplay("");
    setNewLinkUrl("");
    setTarget(null);
    setShowPopover(false);
  }

  function hidePopover() {
    setShowPopover(false);
  }

  function addHttps(link) {
    return `https://${link}`;
  }
  function removeHttps(link) {
    return link.replace("https://", "").replace("http://", "");
  }
  function isValidLink(link) {
    return !!validUrl.isUri(addHttps(removeHttps(link)));
  }

  return (
    <>
      <Button
        variant="link"
        onClick={() => {
          setShowPopover(true);
        }}
        className={`${RTEConstants.ICON_CLASS} m-0 p-0`}
      >
        <Link45deg size={RTEConstants.ICON_SIZE} />
      </Button>
      <Modal centered show={showPopover} onHide={hidePopover}>
        <Modal.Header closeButton>
          <Modal.Title>New Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>New Link</Form.Label>
            <Form.Group>
              <Form.Control
                placeholder={
                  addHttps(removeHttps(newLinkUrl)) || "Text to display"
                }
                value={newLinkDisplay}
                onChange={onChangeNewLinkDisplay}
              />
            </Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">https://</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder="URL"
                value={removeHttps(newLinkUrl)}
                onChange={onChangeNewLinkUrl}
              />
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={clearNewLink}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={addNewLink}
            disabled={
              (newLinkDisplay.length === 0 && newLinkUrl.length === 0) ||
              !isValidLink(newLinkUrl)
            }
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered show={showEditModal} onHide={onHideEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder={
                  addHttps(removeHttps(newLinkUrl)) || "Text to display"
                }
                value={newLinkDisplay}
                onChange={onChangeNewLinkDisplay}
              />
            </Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">https://</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder="URL"
                value={removeHttps(newLinkUrl)}
                onChange={onChangeNewLinkUrl}
              />
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideEditModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={modifyTargetLink}
            disabled={
              (newLinkDisplay.length === 0 && newLinkUrl.length === 0) ||
              !isValidLink(newLinkUrl)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default RTELinkButton;

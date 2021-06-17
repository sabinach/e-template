/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { RTEConstants } from "../constants/RTE";
import "../styles/RTE.css";

const RTEInsertButton = React.forwardRef(({ addContent, onChange }, ref) => {
  // Blank

  const [showCreateBlankModal, setShowCreateBlankModal] = React.useState(false);
  const [newBlankPlaceholder, setNewBlankPlaceholder] = React.useState("");
  const [showEditBlankModal, setShowEditBlankModal] = React.useState(false);
  const [target, setTarget] = React.useState(null);

  function onClickBlank(e) {
    e.preventDefault();
    setShowCreateBlankModal(true);
  }
  function onHideCreateBlankModal() {
    setShowCreateBlankModal(false);
  }
  function onChangeNewBlankPlaceholder(e) {
    setNewBlankPlaceholder(e.target.value);
  }

  function newBlankOnClick(t, placeholder) {
    console.log("new blank");
    setTarget(t);
    setNewBlankPlaceholder(placeholder);
    setShowEditBlankModal(true);
  }

  function onHideEditBlankModal() {
    clearNewPlaceholder();
    setShowEditBlankModal(false);
  }

  function addNewBlankInput() {
    onHideCreateBlankModal();
    const newInput = document.createElement("input");
    newInput.placeholder = newBlankPlaceholder;
    newInput.style = RTEConstants.INPUT_STYLE;
    newInput.onclick = (e) => newBlankOnClick(e.target, newInput.placeholder);
    addContent(newInput);
    clearNewPlaceholder();
  }

  function modifyTargetPlaceholder() {
    target.placeholder = newBlankPlaceholder;
    onChange();
    onHideEditBlankModal();
  }

  function clearNewPlaceholder() {
    setNewBlankPlaceholder("");
    setTarget(null);
  }

  const blankForm = (
    <Form>
      <Form.Label>Placeholder</Form.Label>
      <Form.Group>
        <Form.Control
          value={newBlankPlaceholder}
          onChange={onChangeNewBlankPlaceholder}
        />
      </Form.Group>
    </Form>
  );

  // Optional

  const [showCreateOptionalModal, setShowCreateOptionalModal] = React.useState(
    false
  );
  const [newOptionalLabel, setNewOptionalLabel] = React.useState("");
  const [showEditOptionalModal, setShowEditOptionalModal] = React.useState(
    false
  );
  function onClickOptional(e) {
    e.preventDefault();
    setShowCreateOptionalModal(true);
  }
  function onHideCreateOptionalModal() {
    setShowCreateOptionalModal(false);
  }
  function onChangeNewLabel(e) {
    setNewOptionalLabel(e.target.value);
  }

  function newOptionalOnClick(t, label) {
    console.log("new optional");
    setTarget(t);
    setNewOptionalLabel(label);
    setShowEditOptionalModal(true);
  }

  function onHideEditOptionalModal() {
    clearNewOptionalLabel();
    setShowEditOptionalModal(false);
  }

  function addNewOptionalInput() {
    onHideCreateOptionalModal();
    const space = document.createElement("span");
    space.innerHTML = RTEConstants.SPACE;
    addContent(space);
    const newInput = document.createElement("button");
    newInput.className = "btn btn-light btn-block text-left";
    newInput.innerHTML = newOptionalLabel.split("\n").join("<br/>");
    newInput.style = RTEConstants.READONLY_STYLE;
    newInput.onclick = (e) => newOptionalOnClick(e.target, newInput.innerHTML);
    addContent(newInput);
    addContent(space);
    clearNewOptionalLabel();
  }

  function modifyTargetLabel() {
    target.innerHTML = newOptionalLabel;
    onChange();
    onHideEditOptionalModal();
  }

  function clearNewOptionalLabel() {
    setNewOptionalLabel("");
    setTarget(null);
  }

  const optionalForm = (
    <Form>
      <Form.Label>Content (plain text)</Form.Label>
      <Form.Group>
        <Form.Control
          as="textarea"
          className="prewrap"
          value={newOptionalLabel}
          onChange={onChangeNewLabel}
        />
      </Form.Group>
    </Form>
  );

  // Dropdown
  const [showCreateDropdownModal, setShowCreateDropdownModal] = React.useState(
    false
  );
  const [newOptions, setNewOptions] = React.useState([]);
  const [showEditDropdownModal, setShowEditDropdownModal] = React.useState(
    false
  );
  const [isDropdownBlank, setIsDropdownBlank] = React.useState(true);

  function onClickDropdown(e) {
    e.preventDefault();
    setShowCreateDropdownModal(true);
  }
  function onHideCreateDropdownModal() {
    setShowCreateDropdownModal(false);
  }

  function newDropdownOnClick(t, options) {
    console.log("new dropdown");
    setTarget(t);
    setNewOptions(options);
    setShowEditDropdownModal(true);
  }

  function onHideEditDropdownModal() {
    clearNewOptions();
    setShowEditDropdownModal(false);
  }

  function isDropdownFilled() {
    return newOptions.reduce(
      (anyFilledSoFar, option) => anyFilledSoFar || option.length > 0,
      false
    );
  }
  React.useEffect(() => {
    setIsDropdownBlank(!isDropdownFilled());
  }, [newOptions]);

  function addNewSelect() {
    onHideCreateDropdownModal();
    const newSelect = document.createElement("select");
    newSelect.style = RTEConstants.INPUT_STYLE;
    const options = [];
    newOptions.forEach((value) => {
      if (value) {
        options.push(value);
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        newSelect.appendChild(option);
      }
    });
    newSelect.onclick = (e) => newDropdownOnClick(e.target, options);
    addContent(newSelect);
    clearNewOptions();
  }

  function modifyTargetOptions() {
    target.innerHTML = "";
    const options = [];
    newOptions.forEach((value) => {
      if (value) {
        options.push(value);
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        target.appendChild(option);
      }
    });
    target.onclick = (e) => newDropdownOnClick(e.target, options);
    onChange();
    onHideEditDropdownModal();
  }

  function clearNewOptions() {
    setNewOptions([""]);
    setTarget(null);
  }

  function updateOption(e, index) {
    const updatedOptions = newOptions.map((option, i) => {
      if (index === i) {
        return e.target.value;
      } else {
        return option;
      }
    });
    setNewOptions(updatedOptions);
  }

  function addAnotherOption() {
    setNewOptions([...newOptions, ""]);
  }

  const dropdownForm = (
    <Form>
      {newOptions.map((option, index) => {
        return (
          <Form.Group key={`option-${index}`}>
            <Form.Control
              value={option}
              placeholder="Leave blank to remove"
              onChange={(e) => {
                updateOption(e, index);
              }}
            ></Form.Control>
          </Form.Group>
        );
      })}
      <Button
        block
        className="rounded-pill"
        variant="success"
        onClick={addAnotherOption}
      >
        Add an option
      </Button>
    </Form>
  );

  const InsertToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
      variant="primary"
      className="rounded-pill mb-1"
      size="sm"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </Button>
  ));

  React.useImperativeHandle(ref, () => ({
    newBlankOnClick,
    newOptionalOnClick,
    newDropdownOnClick,
  }));

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={InsertToggle}>Insert</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as="button" onClick={onClickBlank}>
            Blank
          </Dropdown.Item>

          <Dropdown.Item as="button" onClick={onClickOptional}>
            Optional Paragraph
          </Dropdown.Item>

          <Dropdown.Item as="button" onClick={onClickDropdown}>
            Dropdown
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Modal
        centered
        show={showCreateBlankModal}
        onHide={onHideCreateBlankModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Blank</Modal.Title>
        </Modal.Header>
        <Modal.Body>{blankForm}</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideCreateBlankModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            disabled={newBlankPlaceholder.length === 0}
            onClick={addNewBlankInput}
          >
            Add Blank
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered show={showEditBlankModal} onHide={onHideEditBlankModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blank</Modal.Title>
        </Modal.Header>
        <Modal.Body>{blankForm}</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideEditBlankModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            disabled={newBlankPlaceholder.length === 0}
            onClick={modifyTargetPlaceholder}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showCreateOptionalModal}
        onHide={onHideCreateOptionalModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Optional Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>{optionalForm}</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideCreateOptionalModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            disabled={newOptionalLabel.length === 0}
            onClick={addNewOptionalInput}
          >
            Add Optional Content
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showEditOptionalModal}
        onHide={onHideEditOptionalModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Optional Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>{optionalForm}</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideEditOptionalModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={modifyTargetLabel}
            disabled={newOptionalLabel.length === 0}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showCreateDropdownModal}
        onHide={onHideCreateDropdownModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Dropdown</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dropdownForm}</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideCreateDropdownModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={addNewSelect}
            disabled={isDropdownBlank}
          >
            Add Dropdown
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={showEditDropdownModal}
        onHide={onHideEditDropdownModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Dropdown</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dropdownForm}</Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={onHideEditDropdownModal}
          >
            Cancel
          </Button>
          <Button
            className="rounded-pill"
            variant="primary"
            onClick={modifyTargetOptions}
            disabled={isDropdownBlank}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default RTEInsertButton;

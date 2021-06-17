/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Form } from "react-bootstrap";
import { Token, Typeahead } from "react-bootstrap-typeahead";
import ContactToken from "./ContactToken";

export function toOptionArray(contactArray) {
  return contactArray.map((s) =>
    typeof s === "object" ? { label: s.name, contact: s } : { label: s }
  );
}

export default function RecipientInput({
  options, // initial options available
  selected, // selected tags
  handleChange, // update external state with selectedTags
  validate, // returns error message string or empty string
  maxNameLength = 0, // max length of each token (inclusive) - 0 if no max
  maxMembers = 20, // max number of tokens (inclusive) - 0 if no max
  formLabel = "",
  placeholder = "Add contacts or emails",
  newSelectionPrefix = "Add: ",
  setShowContactModal,
  setExpandedContact,
  handleExpandGroup,
  field,
}) {
  const [error, setError] = React.useState("");

  function optionIncluded(optionsArray, tag) {
    return optionsArray.filter((v) => v.label === tag).length > 0;
  }

  function isTooLong(tag) {
    if (maxNameLength > 0 && tag.length >= maxNameLength) {
      return `Tags must be shorter than ${maxNameLength} characters.`;
    }
    return "";
  }
  function getEmails(tags) {
    const emailsIncluded = [];
    tags.forEach((t) => {
      if (t.contact) {
        if (t.contact.email) {
          emailsIncluded.push(t.contact.email);
        } else {
          t.contact.members.forEach((member) => {
            if (member.email) {
              emailsIncluded.push(member.email);
            } else {
              emailsIncluded.push(member);
            }
          });
        }
      } else {
        emailsIncluded.push(t.label);
      }
    });
    return emailsIncluded;
  }

  function isInvalidTag(tag, tags) {
    const tooLong = isTooLong(tag.label);
    if (tooLong) {
      return tooLong;
    }
    const emailsIncluded = getEmails(tags);
    if (
      tag.label &&
      tag.label.length > 0 &&
      (tags.filter((option) => option.label === tag.label).length > 1 ||
        emailsIncluded.filter(
          (email) =>
            email === tag.label ||
            (tag.contact && tag.contact.email && email === tag.contact.email)
        ).length > 1)
    ) {
      return "Already added";
    }
    if (validate && !optionIncluded(toOptionArray(options), tag.label)) {
      return validate(tag.label);
    }
    return "";
  }

  function fewerThanMax(tags) {
    return (
      maxMembers === 0 ||
      (tags.length <= maxMembers && getEmails(tags).length <= maxMembers)
    );
  }

  function isInvalidSelection(tags) {
    if (!fewerThanMax(tags)) {
      return `Can add up to ${maxMembers} members.`;
    }
    let tagInvalid = "";
    tags.forEach((tag) => {
      tagInvalid = isInvalidTag(tag, tags);
    });
    return tagInvalid;
  }

  function onChange(newOptions) {
    console.log(newOptions);
    const newSelected = newOptions.map((option) => {
      if (option.contact) {
        return option.contact;
      }
      return option.label;
    });
    console.log(newSelected);
    handleChange(newSelected);
  }

  return (
    <Form.Group>
      <Form.Label>{formLabel}</Form.Label>
      <Typeahead
        id="tag-input"
        isInvalid={error.length > 0}
        shouldSelectHint
        className="is-invalid"
        onChange={(newOptions) => {
          const newError = isInvalidSelection(newOptions);
          setError(newError);
          if (newError.length === 0) {
            onChange(newOptions);
          }
        }}
        onInputChange={() => {
          setError("");
        }}
        options={toOptionArray(options)}
        placeholder={placeholder}
        allowNew
        newSelectionPrefix={newSelectionPrefix}
        flip
        selected={toOptionArray(selected)}
        minLength={1}
        multiple
        onBlur={() => {
          const newError = isInvalidSelection(toOptionArray(selected));
          setError(newError);
        }}
        renderToken={(option, props, index) => {
          if (optionIncluded(toOptionArray(selected), option.label)) {
            if ("contact" in option) {
              return (
                <ContactToken
                  option={option}
                  tabIndex={props.tabIndex}
                  index={index}
                  onRemove={props.onRemove}
                  setShowContactModal={setShowContactModal}
                  setExpandedContact={setExpandedContact}
                  handleExpandGroup={handleExpandGroup}
                  field={field}
                />
              );
            } else {
              return (
                <Token
                  option={option}
                  tabIndex={props.tabIndex}
                  key={index}
                  onRemove={(e) => {
                    props.onRemove(e);
                  }}
                >
                  {option.label}
                </Token>
              );
            }
          }
        }}
      />
      {error.length > 0 && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

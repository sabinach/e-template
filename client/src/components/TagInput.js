/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Form } from "react-bootstrap";
import { Token, Typeahead } from "react-bootstrap-typeahead";

export function toOptionArray(stringArray) {
  return stringArray.map((s) => ({ label: s }));
}

export default function TagInput({
  options, // initial options available
  selected, // selected tags
  handleChange, // update external state with selectedTags
  validate, // returns error message string or empty string
  maxTagLength = 0, // max length of each token (inclusive) - 0 if no max
  maxTags = 0, // max number of tokens (inclusive) - 0 if no max
  formLabel = "",
  placeholder = "",
  newSelectionPrefix = "Add: ",
}) {
  React.useEffect(() => {
    console.log(selected);
  }, []);
  const [error, setError] = React.useState("");

  function optionIncluded(optionsArray, tag) {
    return optionsArray.filter((v) => v.label === tag).length > 0;
  }

  function isTooLong(tag) {
    if (maxTagLength > 0 && tag.length >= maxTagLength) {
      return `Tags must be shorter than ${maxTagLength} characters.`;
    }
    return "";
  }
  function isInvalidTag(tag, tags) {
    const tooLong = isTooLong(tag);
    if (tooLong) {
      return tooLong;
    }
    if (
      tag.length > 0 &&
      tags.filter((option) => option.label === tag).length > 1
    ) {
      return "Already added";
    }
    if (validate && !optionIncluded(toOptionArray(options), tag)) {
      return validate(tag);
    }
    return "";
  }

  function fewerThanMax(tags) {
    return maxTags === 0 || tags.length <= maxTags;
  }

  function isInvalidSelection(tags) {
    if (!fewerThanMax(tags)) {
      return `Can use up to ${maxTags} tags.`;
    }
    let tagInvalid = "";
    tags.forEach((tag) => {
      tagInvalid = isInvalidTag(tag.label, tags);
    });
    return tagInvalid;
  }

  function onChange(newOptions) {
    handleChange(newOptions.map((option) => option.label));
  }

  return (
    <Form.Group>
      <Form.Label>{formLabel == "Tags" ? "Tags*" : formLabel}</Form.Label>
      <Typeahead
        id="tag-input"
        isInvalid={error.length > 0}
        shouldSelectHint
        className="is-invalid"
        onChange={(newOptions) => {
          console.log(newOptions);
          const newError = isInvalidSelection(newOptions);
          setError(newError);
          if (newError.length === 0) {
            onChange(newOptions);
          }
        }}
        onInputChange={(input) => {
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
          // console.log(
          //   optionselected.includes(option) || selectedTags.includes(option)
          // );
          if (selected.includes(option.label)) {
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
        }}
      />
      {error.length > 0 && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

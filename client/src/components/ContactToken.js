/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Token } from "react-bootstrap-typeahead";

export default function ContactToken({
  option,
  index,
  onRemove,
  tabIndex,
  setShowContactModal,
  setExpandedContact,
  handleExpandGroup,
  field,
}) {
  return (
    <Token
      option={option}
      tabIndex={tabIndex}
      key={index}
      onRemove={(e) => {
        onRemove(e);
      }}
      onClick={() => {
        console.log("click contact token");
        if ("email" in option.contact) {
          setShowContactModal(true);
          setExpandedContact(option.contact);
        } else if ("members" in option.contact) {
          console.log("group");
          handleExpandGroup(option.contact, field);
        }
      }}
    >
      {option.label}
    </Token>
  );
}

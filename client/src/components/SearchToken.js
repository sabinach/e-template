import React from "react";
import { Token } from "react-bootstrap-typeahead";
import "../styles/Search.css";

export default function SearchToken({
  label,
  locationId,
  filterType,
  isActivated,
  index,
  handleToggleButton,
  handleDeleteButton,
}) {
  console.log(isActivated);
  return (
    <Token
      option={label}
      className={!isActivated && "search-token-deactivated"}
      tabIndex={index}
      key={index}
      onRemove={() => {
        if (filterType === "location")
          handleDeleteButton({id: locationId, name: label}, filterType)
        else
          handleDeleteButton(label, filterType);
      }}
      onClick={() => {
        if (filterType === "location")
          handleToggleButton({id: locationId, name: label}, filterType, isActivated);
        else
          handleToggleButton(label, filterType, isActivated);
      }}
    >
      {label}
    </Token>
  );
}

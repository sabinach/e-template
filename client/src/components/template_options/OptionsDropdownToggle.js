import React from "react";
import { Dropdown } from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";
import "../../styles/OptionsDropdownToggle.css";

export default function OptionsDropdownToggle({
  THREEDOT_ICON_SIZE,
  dropdownMenu,
}) {
  function handleOptionsClick(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log("three dots");
  }
  const OptionsDropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <ThreeDots
      className="optionsdropdowntoggle-threedots"
      size={THREEDOT_ICON_SIZE}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        handleOptionsClick(e);
        onClick(e);
      }}
    />
  ));
  return (
    <Dropdown className="d-inline">
      <Dropdown.Toggle as={OptionsDropdownToggle}></Dropdown.Toggle>
      {dropdownMenu}
    </Dropdown>
  );
}

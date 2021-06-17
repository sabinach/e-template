import React from "react";
import { useHistory } from "react-router-dom";
import { ChevronLeft } from "react-bootstrap-icons";
import "../styles/BackButton.css";

export default function BackButton({ to = "/" }) {
  const history = useHistory();
  function goBack(e) {
    e.stopPropagation();
    history.goBack();
  }

  return (
    <ChevronLeft className="d-inline backbutton" onClick={goBack} size={25} />
  );
}

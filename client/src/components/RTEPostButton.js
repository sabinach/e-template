/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Button from "react-bootstrap/Button";
import { RTEConstants } from "../constants/RTE";
import "../styles/RTE.css";

class HtmlStrip {
  constructor() {
    this._target = document.createElement("div");
  }
  strip(html) {
    this._target.innerHTML = html;
    return this._target.textContent || this._target.innerText || "";
  }
}

function RTEPostButton({
  disableEdits,
  enableEdits,
  clearContent,
  content,
  handlePost,
}) {
  const htmlStrip = new HtmlStrip();
  const [stripped, setStripped] = React.useState("");

  React.useEffect(() => {
    setStripped(htmlStrip.strip(content));
  }, [content]);

  function onClick() {
    disableEdits();
    // post the content
    handlePost();
    // then reset
    clearContent();
    enableEdits();
  }
  return (
    <Button
      variant="link"
      className={`${RTEConstants.ICON_CLASS} m-0 ml-3 mr-1 p-0`}
      onClick={onClick}
      disabled={!stripped}
    >
      Post
    </Button>
  );
}

export default RTEPostButton;

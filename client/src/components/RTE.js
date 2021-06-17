/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Form from "react-bootstrap/Form";
import { RTEConstants, RTEInputTypes } from "../constants/RTE";
import RTEIframe from "./RTEIframe";
import RTELinkButton from "./RTELinkButton";
import RTEInsertButton from "./RTEInsertButton";
import RTEPostButton from "./RTEPostButton";
import "../styles/RTE.css";

function RTE({
  iframeRef,
  inputType,
  initialContent = "",
  handleChange,
  error = "",
  content = "",
  handlePost = () => {},
}) {
  const buttonsRef = React.useRef(null);
  const [buttonsHeight, setButtonsHeight] = React.useState(0);
  const [editable, setEditable] = React.useState(true);

  const linkButtonRef = React.useRef();

  const insertButtonRef = React.useRef();

  function disableEdits() {
    setEditable(false);
  }

  function enableEdits() {
    setEditable(true);
  }

  React.useEffect(() => {
    setButtonsHeight(buttonsRef.current.clientHeight);
  }, []);

  function adjustHeight() {
    iframeRef.current.setAttribute("style", "height:" + 0 + "px;");
    const newHeight =
      iframeRef.current.contentWindow.document.body.offsetHeight +
      buttonsHeight +
      RTEConstants.BUTTON_MARGIN;
    iframeRef.current.setAttribute("style", "height:" + newHeight + "px;");
  }

  const addContent = (content) => {
    iframeRef.current.contentWindow.document.body.appendChild(content);
    onChange();
  };
  const onChange = () => {
    handleChange(getContent());
    adjustHeight();
  };
  const getContent = () => {
    const iframeContent =
      iframeRef.current.contentWindow.document.body.innerHTML;
    return iframeContent;
  };
  const clearContent = () => {
    iframeRef.current.contentWindow.document.body.innerHTML = "";
    adjustHeight();
  };

  let label;
  let buttons;
  switch (inputType) {
    case RTEInputTypes.BLURB:
      label = RTEConstants.BLURB_LABEL + "*";
      buttons = (
        <>
          <RTELinkButton
            addContent={addContent}
            onChange={onChange}
            ref={linkButtonRef}
          />
        </>
      );
      break;
    case RTEInputTypes.COMMENT:
      label = RTEConstants.COMMENT_LABEL;
      buttons = (
        <>
          <RTELinkButton
            addContent={addContent}
            onChange={onChange}
            ref={linkButtonRef}
          />
          <RTEPostButton
            disableEdits={disableEdits}
            enableEdits={enableEdits}
            clearContent={clearContent}
            content={content}
            handlePost={handlePost}
          />
        </>
      );
      break;
    case RTEInputTypes.BODY:
      label = RTEConstants.BODY_LABEL;
      buttons = (
        <>
          <RTEInsertButton
            addContent={addContent}
            onChange={onChange}
            ref={insertButtonRef}
          />
        </>
      );
      break;
    default:
      buttons = <></>;
      break;
  }

  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <div className={RTEConstants.CONTAINER_CLASS}>
        <RTEIframe
          inputType={inputType}
          iframeRef={iframeRef}
          content={initialContent}
          designMode={editable}
          handleChange={handleChange}
          adjustHeight={adjustHeight}
          error={error}
          newLinkOnClick={(t, linkUrl, linkDisplay) => {
            linkButtonRef.current.newLinkOnClick(t, linkUrl, linkDisplay);
          }}
          newOptionalOnClick={(t, label) => {
            insertButtonRef.current.newOptionalOnClick(t, label);
          }}
          newBlankOnClick={(t, placeholder) => {
            insertButtonRef.current.newBlankOnClick(t, placeholder);
          }}
          newDropdownOnClick={(t, options) => {
            insertButtonRef.current.newDropdownOnClick(t, options);
          }}
        />
        <div
          ref={buttonsRef}
          className={`${RTEConstants.BUTTONS_CLASS} m-0 p-0`}
        >
          {buttons}
        </div>
      </div>
      {error.length > 0 && <small className="text-danger p-0">{error}</small>}
    </Form.Group>
  );
}

export default RTE;

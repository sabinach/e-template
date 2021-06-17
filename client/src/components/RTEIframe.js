/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { RTEConstants } from "../constants/RTE";
import "../styles/RTE.css";

function RTEIframe({
  inputType,
  iframeRef,
  adjustHeight,
  designMode,
  content,
  handleChange,
  error,
  isRequired,
  newLinkOnClick,
  newBlankOnClick,
  newOptionalOnClick,
  newDropdownOnClick,
}) {
  React.useEffect(() => {
    adjustHeight();
  }, [content]);

  React.useEffect(() => {
    iframeRef.current.contentWindow.document.designMode = designMode
      ? "on"
      : "off";
  }, [designMode]);

  React.useEffect(() => {
    const bootstrapCdn = document.createElement("link");
    bootstrapCdn.rel = "stylesheet";
    bootstrapCdn.crossOrigin = "anonymous";
    bootstrapCdn.href = RTEConstants.BOOTSTRAP_CDN_HREF;
    bootstrapCdn.integrity = RTEConstants.BOOTSTRAP_CDN_INTEGRITY;
    iframeRef.current.contentWindow.document.head.appendChild(bootstrapCdn);
    iframeRef.current.contentWindow.document.body.innerHTML = content;
    iframeRef.current.contentWindow.document.body.childNodes.forEach((node) => {
      console.log("child nodeName");
      console.log(node.nodeName);
      if (node.nodeName === "A") {
        // link
        node.onclick = (e) => {
          newLinkOnClick(e.target, node.href, node.innerHTML);
        };
      } else if (node.nodeName === "BUTTON") {
        // optional
        node.onclick = (e) => {
          newOptionalOnClick(e.target, node.innerHTML);
        };
      } else if (node.nodeName === "INPUT") {
        // blank
        node.onclick = (e) => {
          newBlankOnClick(e.target, node.placeholder);
        };
      } else if (node.nodeName === "SELECT") {
        // dropdown
        const dropdownOptions = [];
        node.childNodes.forEach((child) =>
          dropdownOptions.push(child.innerHTML)
        );
        node.onclick = (e) => {
          newDropdownOnClick(e.target, dropdownOptions);
        };
      }
    });
    console.log("iframe content");
    console.log(content);
    iframeRef.current.contentWindow.document.addEventListener(
      "keyup",
      onChange,
      true
    );
    iframeRef.current.contentWindow.document.addEventListener(
      "paste",
      onPaste,
      true
    );
    adjustHeight();
  }, [content]);

  const getContent = () => {
    const iframeContent =
      iframeRef.current.contentWindow.document.body.innerHTML;
    return iframeContent;
  };

  const onChange = () => {
    handleChange(getContent());
    adjustHeight();
  };

  const onPaste = (e) => {
    e.preventDefault();

    // get text representation of clipboard
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");

    // insert text manually
    iframeRef.current.contentWindow.document.execCommand(
      "insertHTML",
      false,
      text
    );
    onChange();
  };

  return (
    <iframe
      src="about:blank"
      width="100%"
      title={inputType}
      ref={iframeRef}
      className={
        error && isRequired
          ? `${RTEConstants.IFRAME_CLASS} border-danger`
          : RTEConstants.IFRAME_CLASS
      }
    />
  );
}

export default RTEIframe;

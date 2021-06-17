const RTEConstants = {
  BUTTON_MARGIN: 55,
  ICON_SIZE: 25,
  BUTTONS_CLASS: "rte-buttons",
  ICON_CLASS: "rte-icon",
  IFRAME_CLASS: "rte-iframe",
  CONTAINER_CLASS: "rte-container",
  BOOTSTRAP_CDN_HREF:
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
  BOOTSTRAP_CDN_INTEGRITY:
    "sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk",
  BLURB_LABEL: "Blurb",
  COMMENT_LABEL: "Write a comment",
  BODY_LABEL: "Body",
  INPUT_STYLE:
    "border-color:lightgray;border-radius:5px;border-width:thin;border-style:solid;margin-top:5px;margin-bottom:5px;color:gray",
  READONLY_STYLE:
    "-webkit-user-modify: read-only; -moz-user-modify: read-only;",
  SPACE: "&nbsp;",
};

const RTEInputTypes = {
  BLURB: "blurb",
  COMMENT: "comment",
  BODY: "body",
};

Object.freeze(RTEConstants);
Object.freeze(RTEInputTypes);

export { RTEInputTypes, RTEConstants };

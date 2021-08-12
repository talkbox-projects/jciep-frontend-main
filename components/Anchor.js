import React from "react";
const Anchor = ({ id, top = "-80px", left, bottom, right, style = {} }) => (
  <a
    data-tag={id}
    style={{
      display: "block",
      position: "relative",
      visibility: "hidden",
      top,
      left,
      bottom,
      right,
      ...style,
    }}
  />
);

export default Anchor;

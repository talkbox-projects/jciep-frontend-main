import React from "react";
const Anchor = ({ name, top = "-80px", left, bottom, right, style = {} }) => (
  <a
    name={name}
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

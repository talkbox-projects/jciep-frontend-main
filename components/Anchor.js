import React from "react";
const Anchor = ({ id, top = "-80px", left, bottom, right, style = {} }) => (
  <a
    id={id}
    name={id}
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

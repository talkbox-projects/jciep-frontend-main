import { Heading } from "@chakra-ui/react";
import React from "react";
const HighlightHeadline = ({
  bgColor = "#F6D644",
  fontSize = ["3xl", "4xl"],
  children,
}) => {
  return (
    <Heading
      px={2}
      textAlign="center"
      fontWeight="bold"
      pos="relative"
      lineHeight="1.5"
      backgroundImage={`linear-gradient(${bgColor}, ${bgColor})`}
      backgroundRepeat="no-repeat"
      backgroundPosition="0 0.8em"
      fontSize={fontSize}
    >
      {children}
    </Heading>
  );
};

export default HighlightHeadline;

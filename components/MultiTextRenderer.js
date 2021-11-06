import { Text } from "@chakra-ui/layout";
import React from "react";
const MultiTextRenderer = ({ data, textAlign, fontSize, parentStyles, bgColor }) => {
  return (
    <Text as="span" {...(textAlign && { textAlign: `${textAlign}` })} fontSize={fontSize} {...parentStyles}>
      {(data ?? []).map(({ _template, content, textcolor, bold }, index) => {
        switch (_template) {
          case "textBlock":
            return (
              <Text as="span"
                d="inline"
                p="0"
                bgColor={bgColor}
                key={index}
                textColor={textcolor}
                {...(bold && { fontWeight: "bold" })}
              >
                {content}
              </Text>
            );
          case "lineBreakBlock":
            return <br key={index} />;
          default:
        }
      })}
    </Text>
  );
};

export default MultiTextRenderer;

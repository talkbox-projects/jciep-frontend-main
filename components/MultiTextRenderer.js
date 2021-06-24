import { Text } from "@chakra-ui/layout";

const MultiTextRenderer = ({ data, textAlign, fontSize, parentStyles, bgColor }) => {
  return (
    <Text {...(textAlign && { textAlign: `${textAlign}` })} fontSize={fontSize} {...parentStyles}>
      {(data ?? []).map(({ _template, content, textcolor, bold }, index) => {
        switch (_template) {
          case "textBlock":
            return (
              <Text
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

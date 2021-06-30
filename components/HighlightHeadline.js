import { Box, HStack, Text } from "@chakra-ui/react";

const HighlightHeadline = ({ bgColor = "#F6D644", children }) => {
  return (
    <Text
      px={2}
      textAlign="center"
      fontWeight="bold"
      pos="relative"
      lineHeight="1.5"
      backgroundImage={`linear-gradient(${bgColor}, ${bgColor})`}
      backgroundRepeat="no-repeat"
      backgroundPosition="0 0.8em"
    >
      {children}
    </Text>
  );
};

export default HighlightHeadline;

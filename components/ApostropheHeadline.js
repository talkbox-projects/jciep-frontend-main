import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
const ApostropheHeadline = ({
  color = "#ffffff",
  fontSize = ["3xl", "4xl"],
  children,
}) => {
  return (
    <Flex justify="center" align="flex-end">
      <Box>
        <Box
          width="6.15px"
          height="27.69px"
          borderRadius="5px"
          background={color}
          transform="rotate(-30deg)"
        />
      </Box>
      <Heading
        mx={8}
        mb="-10px"
        fontSize={fontSize}
        fontWeight="bold"
        textAlign="center"
      >
        {children}
      </Heading>
      <Box>
        <Box
          width="6.15px"
          height="27.69px"
          borderRadius="5px"
          background={color}
          transform="rotate(30deg)"
        />
      </Box>
    </Flex>
  );
};

export default ApostropheHeadline;

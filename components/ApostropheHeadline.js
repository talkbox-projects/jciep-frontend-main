import { Box, Flex, HStack, Text } from "@chakra-ui/react";

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
      <Text
        mx={8}
        mb="-10px"
        fontSize={fontSize}
        fontWeight="bold"
        textAlign="center"
      >
        {children}
      </Text>
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

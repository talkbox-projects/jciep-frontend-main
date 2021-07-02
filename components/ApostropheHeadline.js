import { Box, HStack, Text } from "@chakra-ui/react";

const ApostropheHeadline = ({
  color = "#ffffff",
  fontSize = ["2xl", "4xl"],
  children,
}) => {
  return (
    <HStack justifyContent="center" align="flex-end" spacing={8}>
      <Box>
        <Box
          width="6.15px"
          height="27.69px"
          borderRadius="5px"
          background={color}
          transform="rotate(-30deg)"
        />
      </Box>
      <Text pb={2} fontSize={fontSize} fontWeight="bold" textAlign="center">
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
    </HStack>
  );
};

export default ApostropheHeadline;

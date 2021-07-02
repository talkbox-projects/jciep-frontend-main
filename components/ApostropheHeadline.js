import { Box, HStack, Text } from "@chakra-ui/react";

const ApostropheHeadline = ({ color = "#ffffff", children }) => {
  return (
    <HStack align="flex-end" spacing={8}>
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
        pb={4}
        fontSize={["3xl", "4xl"]}
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
    </HStack>
  );
};

export default ApostropheHeadline;

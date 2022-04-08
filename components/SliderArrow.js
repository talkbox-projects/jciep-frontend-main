import { Box, HStack, Icon, IconButton } from "@chakra-ui/react";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function PrevArrow(props) {
  const { onClick } = props;
  return (
    <HStack
      pos="absolute"
      zIndex={1}
      left={0}
      top="35%"
      // h="100%"
      align="center"
      m={12}
    >
      <Box
        _hover={{
          color: "white",
          bg: "black",
        }}
        boxShadow="lg"
        bg="white"
        p={4}
        borderRadius="50%"
        cursor="pointer"
        onClick={onClick}
      >
        <IconButton
          variant="unstyled"
          icon={<Icon as={FaArrowLeft} fontSize="4xl" />}
          size="md"
        />
      </Box>
    </HStack>
  );
}

export function NextArrow(props) {
  const { onClick } = props;
  return (
    <HStack
      pos="absolute"
      zIndex={1}
      right={0}
      top="35%"
      // h="100%"
      align="center"
      m={12}
    >
      <Box
        _hover={{
          color: "white",
          bg: "black",
        }}
        boxShadow="lg"
        bg="white"
        p={4}
        borderRadius="50%"
        cursor="pointer"
        onClick={onClick}
      >
        <IconButton
          variant="unstyled"
          icon={<Icon as={FaArrowRight} fontSize="4xl" />}
          size="md"
        />
      </Box>
    </HStack>
  );
}

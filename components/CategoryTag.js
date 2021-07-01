import { HStack, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";

const CategoryTag = ({ category, size = "lg", withIcon = true }) => {
  const {
    label = "Unknown Category",
    image: icon,
    bgColor = "#00BAB4",
    textColor = "white",
  } = category ?? {};

  switch (size) {
    case "lg":
      return (
        <HStack
          py={2}
          px={4}
          bgColor={bgColor}
          borderRadius={24}
          textColor={textColor}
        >
          {withIcon && <Image src={icon} />}
          <Text fontWeight="bold" fontSize={size}>
            {label}
          </Text>
        </HStack>
      );
    case "sm":
      return (
        <HStack
          py={0.5}
          px={2}
          bgColor={bgColor}
          borderRadius={20}
          textColor={textColor}
        >
          {withIcon && <Image src={icon} />}
          <Text fontSize={size}>{label}</Text>
        </HStack>
      );
  }
};

export default CategoryTag;

import { Box } from "@chakra-ui/react";

const sectionBorderStyles = {
  borderRadius: 8,
  borderColor: "gray.300",
  borderWidth: 1,
  bg: "white",
};

const SectionCard = ({ children }) => {
  return <Box {...sectionBorderStyles}>{children}</Box>;
};

export default SectionCard;

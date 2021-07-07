import { Box, VStack } from "@chakra-ui/react";
import SectionCard from "../fragments/SectionCard";

const NgoSection = ({ identity, page, enums, editable }) => {
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <Box>NgoSection</Box>
      </VStack>
    </SectionCard>
  );
};

export default NgoSection;

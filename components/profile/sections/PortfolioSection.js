import { Box, VStack } from "@chakra-ui/react";
import SectionCard from "../fragments/SectionCard";

const PortfolioSection = ({ identity, page, enums, editable }) => {
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <Box>PortfolioSection</Box>
      </VStack>
    </SectionCard>
  );
};

export default PortfolioSection;

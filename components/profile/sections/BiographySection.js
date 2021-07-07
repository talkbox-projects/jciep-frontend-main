import { useForm } from "react-hook-form";
import { Box, VStack } from "@chakra-ui/react";
import SectionCard from "../fragments/SectionCard";

const BiographySection = ({ identity, page, enums, editable }) => {
  const form = useForm();
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <Box>BiographySection</Box>
      </VStack>
    </SectionCard>
  );
};

export default BiographySection;

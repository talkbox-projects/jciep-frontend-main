import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import BannerFragment from "../fragments/BannerFragment";

const sectionBorderStyles = {
  borderRadius: 8,
  borderColor: "gray.300",
  borderWidth: 2,
};

const PublicSection = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  const {
    formState: { isSubmitting },
  } = useForm();
  return (
    <VStack spacing={1} align="stretch" {...sectionBorderStyles}>
      <BannerFragment {...props} />
      <Box>{JSON.stringify(identity)}</Box>
      <HStack p={2} px={4} justifyContent="flex-end">
        <Button
          colorScheme="yellow"
          color="black"
          px={4}
          py={2}
          borderRadius="2em"
          type="submit"
          isLoading={isSubmitting}
        >
          {wordExtractor(page?.content?.wordings, "save_button_label")}
        </Button>
      </HStack>
    </VStack>
  );
};

export default PublicSection;

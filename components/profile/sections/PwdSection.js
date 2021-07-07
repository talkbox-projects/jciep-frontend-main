import { Button, HStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";

const PwdSection = ({ identity, page, enums, editable }) => {
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment {...props} />
        <VStack align="stretch">
          <HStack py={2} px={4} spacing={4} justifyContent="flex-end">
            <Button variant="link">
              {wordExtractor(page?.content?.wordings, "cancel_button_label")}
            </Button>
            <Button
              colorScheme="yellow"
              color="black"
              px={8}
              py={2}
              borderRadius="2em"
              type="submit"
              isLoading={isSubmitting}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </SectionCard>
  );
};

export default PwdSection;

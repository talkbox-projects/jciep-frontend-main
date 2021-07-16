import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import OrganizationRemove from "../../../utils/api/OrganizationRemove";
import wordExtractor from "../../../utils/wordExtractor";
import OrganizationRemoveModal from "../fragments/OrganizationRemoveModal";
import SectionCard from "../fragments/SectionCard";

const OrganizationOperationSection = () => {
  const { organization, page } = OrganizationProfileStore.useContext();

  const router = useRouter();
  const removeDisclosure = useDisclosureWithParams();

  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "organization_setting_label")}
        </Text>
      </HStack>
      <VStack px={4} pb={4} align="stretch" direction={"column"} spacing={4}>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            removeDisclosure.onOpen({
              page,
              onSubmit: async (e) => {
                try {
                  await OrganizationRemove({
                    id: organization?.id,
                  });
                  router.push("/");
                  removeDisclosure.onClose();
                  router.push("/");
                } catch (error) {
                  console.error(error);
                }
              },
            });
          }}
        >
          {wordExtractor(
            page?.content?.wordings,
            "remove_organization_button_label"
          )}
        </Button>
      </VStack>
      <OrganizationRemoveModal {...removeDisclosure} />
    </SectionCard>
  );
};

export default OrganizationOperationSection;

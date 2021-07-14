import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDisclosureWithParams } from "../../../store/AppStore";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import IdentityRemove from "../../../utils/api/IdentityRemove";
import wordExtractor from "../../../utils/wordExtractor";
import IdentityRemoveModal from "../fragments/IdentityRemoveModal";
import SectionCard from "../fragments/SectionCard";

const IdentityOperationSection = () => {
  const { identity, page } = IdentityProfileStore.useContext();

  const removeDisclosure = useDisclosureWithParams();
  const router = useRouter();

  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "identity_setting_label")}
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
                  await IdentityRemove({
                    id: identity?.id,
                  });
                  router.push("/");
                  removeDisclosure.onClose();
                } catch (error) {
                  console.error(error);
                }
              },
            });
          }}
        >
          {wordExtractor(
            page?.content?.wordings,
            "remove_identity_button_label"
          )}
        </Button>
      </VStack>
      <IdentityRemoveModal {...removeDisclosure} />
    </SectionCard>
  );
};

export default IdentityOperationSection;

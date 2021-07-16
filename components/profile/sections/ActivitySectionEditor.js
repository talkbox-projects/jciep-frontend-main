import { useForm } from "react-hook-form";
import { Text, Button, HStack, VStack, Stack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import { RiEdit2Line } from "react-icons/ri";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import ActivitySubSectionEditor from "../fragments/ActvitySubSectionEditor";

const ActivitySectionEditor = () => {
  const { page, identity, saveIdentity, removeEditSection } =
    IdentityProfileStore.useContext();
  const form = useForm({
    defaultValues: {
      id: identity.id,
      activity: identity?.activity ?? [],
    },
  });

  return (
    <VStack
      as="form"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          await saveIdentity(values);
          removeEditSection();
        } catch (error) {
          console.error(error);
        }
      })}
      align="stretch"
      pb={8}
    >
      <HStack px={8} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "activity_header_label")}
        </Text>
        <VStack align="stretch">
          <HStack py={2} spacing={4} justifyContent="flex-end">
            <Button variant="link" onClick={removeEditSection}>
              {wordExtractor(page?.content?.wordings, "cancel_button_label")}
            </Button>
            <Button
              colorScheme="yellow"
              color="black"
              px={8}
              py={2}
              borderRadius="2em"
              type="submit"
              isLoading={form.formState.isSubmitting}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          </HStack>
        </VStack>
      </HStack>
      <Stack px={1} direction={"column"} px={8} spacing={4}>
        <ActivitySubSectionEditor form={form} />
      </Stack>
    </VStack>
  );
};

export default ActivitySectionEditor;

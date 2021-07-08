import { useForm } from "react-hook-form";
import { Text, Button, HStack, VStack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiEdit2Line } from "react-icons/ri";
import { useDisclosureWithParams } from "../../../store/AppStore";

const ExperienceSection = ({ identity, page, enums, editable }) => {
  const form = useForm();

  const editModeDisclosure = useDisclosureWithParams();

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "experience_header_label")}
          </Text>
          {editModeDisclosure.isOpen ? (
            <Button
              onClick={editModeDisclosure.onClose}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          ) : (
            <Button
              onClick={editModeDisclosure.onOpen}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "section_edit_label")}
            </Button>
          )}
        </HStack>
      </VStack>
    </SectionCard>
  );
};

export default ExperienceSection;

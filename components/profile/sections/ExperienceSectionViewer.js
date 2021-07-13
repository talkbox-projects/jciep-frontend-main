import {
  Text,
  Button,
  HStack,
  VStack,
  AspectRatio,
  Image,
  Stack,
} from "@chakra-ui/react";
import { RiEdit2Line } from "react-icons/ri";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import EducationSubSectionViewer from "../fragments/EducationSubSectionViewer";
import EmploymentSubSectionViewer from "../fragments/EmploymentSubSectionViewer";

export const ExperienceSectionViewer = () => {
  const { page, setEditSection, editable, editSection } =
    IdentityProfileStore.useContext();

  return (
    <VStack px={8} pb={8} align="stretch">
      <HStack py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "experience_header_label")}
        </Text>

        {editable && !editSection && (
          <Button
            onClick={() => setEditSection("experience")}
            variant="link"
            leftIcon={<RiEdit2Line />}
          >
            {wordExtractor(page?.content?.wordings, "section_edit_label")}
          </Button>
        )}
      </HStack>
      <Stack
        px={1}
        direction={["column", "column", "column", "row"]}
        spacing={4}
      >
        <EducationSubSectionViewer />
        <EmploymentSubSectionViewer />
      </Stack>
    </VStack>
  );
};

export default ExperienceSectionViewer;

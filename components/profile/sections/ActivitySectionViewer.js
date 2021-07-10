import { Text, Button, HStack, VStack, Stack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiEdit2Line } from "react-icons/ri";
import ActvitySubSectionViewer from "../fragments/ActvitySubSectionViewer";
import ProfileStore from "../../../store/ProfileStore";
import ActivitySubSectionEditor from "../fragments/ActvitySubSectionEditor";

const ActivitySectionViewer = () => {
  const { page, editSection, setEditSection } = ProfileStore.useContext();

  return (
    <VStack spacing={1} align="stretch">
      <HStack px={8} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "Activity_header_label")}
        </Text>
        {!editSection && (
          <Button
            onClick={() => setEditSection("activity")}
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
        px={8}
        spacing={4}
      >
        <ActvitySubSectionViewer />
      </Stack>
    </VStack>
  );
};

export default ActivitySectionViewer;

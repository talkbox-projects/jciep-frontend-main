import React, { useEffect, useMemo, useState } from "react";
import { Text, Button, HStack, VStack, Stack } from "@chakra-ui/react";
import { RiEdit2Line } from "react-icons/ri";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import EducationSubSectionViewer from "../fragments/EducationSubSectionViewer";
import EmploymentSubSectionViewer from "../fragments/EmploymentSubSectionViewer";
import { useAppContext } from "../../../store/AppStore";

export const ExperienceSectionViewer = () => {
  const { page, setEditSection, editable, editSection, isAdmin } =
    IdentityProfileStore.useContext();
  const { identity: { type, organizationRole } = {} } = useAppContext();

  const staffAccess = useMemo(() => {
    if (type === "staff" && organizationRole?.length > 0) {
      return (organizationRole ?? []).find(
        (role) =>
          role.organization.id === organizationRole[0].organization.id &&
          organizationRole[0].role === "staff" &&
          organizationRole[0].status === "joined"
      );
    }
    return false;
  }, [organizationRole, type]);

  return (
    <VStack px={8} pb={8} align="stretch">
      <HStack py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "experience_header_label")}
        </Text>

        {(isAdmin || editable || staffAccess) && !editSection && (
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

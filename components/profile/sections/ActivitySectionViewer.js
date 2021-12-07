/* eslint-disable react-hooks/exhaustive-deps */
import { Text, Button, HStack, VStack, Stack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import { RiEdit2Line } from "react-icons/ri";
import ActvitySubSectionViewer from "../fragments/ActvitySubSectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useAppContext } from "../../../store/AppStore";
import React, { useEffect, useState } from "react";

const ActivitySectionViewer = () => {
  const { page, editSection, setEditSection, isAdmin, editable, identity } =
    IdentityProfileStore.useContext();


  const { identity: { type, organizationRole = [] } = {} } = useAppContext();
  const [staffAccess, setStaffAccess] = useState(false)

  useEffect(async () => {
    if (type === "staff" && organizationRole?.length > 0) {
      let IdentityRole = (identity?.organizationRole ?? [])

      let hasStaffAccess = IdentityRole.filter(role =>
        role.organization.id === organizationRole[0].organization.id
        && organizationRole[0].role === "staff"
        && organizationRole[0].status === "joined"
      )[0]

      if (hasStaffAccess) {
        setStaffAccess(true)
      } else {
        setStaffAccess(false)
      }
    }

  }, [type, identity])



  return (
    <VStack spacing={1} paddingBottom="20px" align="stretch">
      <HStack px={8} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "activity_header_label")}
        </Text>
        {(isAdmin || editable || staffAccess) && !editSection && (
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

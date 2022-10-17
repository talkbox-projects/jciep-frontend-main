import React from "react";
import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import PublicSection from "./sections/PublicSection";
import IdentityOperationSection from "./sections/IdentityOperationSection";
import IdentityOrganizationListSection from "./sections/IdentityOrganizationListSection";
import IdentityProfileStore from "../../store/IdentityProfileStore";

const IdentityPublicProfile = () => {
  const { isAdmin, editable, identity } = IdentityProfileStore.useContext();

  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <PublicSection />
          </VStack>
          <VStack align="stretch" w={["100%", "100%", "33%"]}>
            {(isAdmin || editable) && <IdentityOperationSection />}
            {identity?.organizationRole?.length && (<IdentityOrganizationListSection/>)}
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityPublicProfile;

import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import StaffSection from "./sections/StaffSection";
import IdentityOrganizationListSection from "./sections/IdentityOrganizationListSection";
import IdentityOperationSection from "./sections/IdentityOperationSection";
import IdentityProfileStore from "../../store/IdentityProfileStore";

const IdentityStaffProfile = () => {
  const { isAdmin, editable } = IdentityProfileStore.useContext();
  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <StaffSection />
          </VStack>
          <VStack align="stretch" w={["100%", "100%", "33%"]}>
            {(isAdmin || editable) && <IdentityOperationSection />}
            <IdentityOrganizationListSection />
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityStaffProfile;

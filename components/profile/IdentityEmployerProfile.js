import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import EmployerSection from "./sections/EmployerSection";
import IdentityOrganizationListSection from "./sections/IdentityOrganizationListSection";

const IdentityEmployerProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <EmployerSection {...props} />
          </VStack>{" "}
          <VStack align="stretch" w={["100%", "100%", "33%"]}>
            <IdentityOrganizationListSection />
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityEmployerProfile;

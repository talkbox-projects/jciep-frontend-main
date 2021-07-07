import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import StaffSection from "./sections/StaffSection";

const IdentityStaffProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <Box pt={48} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <StaffSection {...props} />
          </VStack>{" "}
          {/* <VStack w={["100%", "100%", "33%"]}>
            <Box></Box>
          </VStack> */}
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityStaffProfile;

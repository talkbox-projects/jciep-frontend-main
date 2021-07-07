import { Box } from "@chakra-ui/react";
import Container from "../Container";
import StaffSection from "./sections/StaffSection";

const IdentityStaffProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <Box pt={64} pb={36}>
      <Container>
        <VStack align="stretch">
          <StaffSection {...props} />
        </VStack>
      </Container>
    </Box>
  );
};

export default IdentityStaffProfile;

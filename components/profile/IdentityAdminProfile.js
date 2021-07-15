import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import AdminSection from "./sections/AdminSection";
import IdentityProfileStore from "../../store/IdentityProfileStore";

const IdentityAdminProfile = () => {
  const { isAdmin, editable } = IdentityProfileStore.useContext();
  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <AdminSection />
          </VStack>
          <VStack align="stretch" w={["100%", "100%", "33%"]}></VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityAdminProfile;

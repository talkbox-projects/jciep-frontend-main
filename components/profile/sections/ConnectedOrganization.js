import React from "react";
import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useMemo } from "react";

const ConnectedOrganization = () => {
  const { identity } = IdentityProfileStore.useContext();

  const approvedOrgRole = useMemo(
    () =>
      (identity?.organizationRole ?? [])?.filter(
        (orgRole) => orgRole?.status === "joined"
      ),
    [identity?.organizationRole]
  );

  if (approvedOrgRole?.length === 0) return null;

  return (
    <VStack align="stretch" mb={4}>
      <Text>這名人材已連繫</Text>
      {approvedOrgRole?.map((orgRole, i) => (
        <HStack key={i} p={1}>
          <Avatar bg="white" src={orgRole?.organization?.logo?.url} />
          <Heading fontWeight="normal" size="lg">
            {orgRole?.organization?.chineseCompanyName}
          </Heading>
        </HStack>
      ))}
    </VStack>
  );
};

export default ConnectedOrganization;

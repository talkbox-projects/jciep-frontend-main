import React from "react";
import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useMemo } from "react";

const ConnectedOrganization = () => {
  const { identity } = IdentityProfileStore.useContext();

  const approvedOrgRole = useMemo(
    () =>
      (identity?.organizationRole ?? [])?.filter(
        (orgRole) => orgRole?.status === "approved"
      ),
    [identity?.organizationRole]
  );

  if (approvedOrgRole?.length === 0) return null;

  return (
    <VStack spacing={1} align="stretch">
      <Text>這名人材已連繫</Text>
      {approvedOrgRole?.map((orgRole, i) => (
        <HStack key={i} p={1}>
          <Avatar src={orgRole?.organization?.logo?.url} />
          <Heading size="lg">
            {orgRole?.organization?.chineseCompanyName}
          </Heading>
        </HStack>
      ))}
    </VStack>
  );
};

export default ConnectedOrganization;

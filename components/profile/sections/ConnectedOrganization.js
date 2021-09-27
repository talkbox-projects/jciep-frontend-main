import React from "react";
import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useMemo } from "react";
import { useRouter } from "next/router";

const ConnectedOrganization = () => {
  const { identity } = IdentityProfileStore.useContext();
  const router = useRouter();

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
        <HStack  onClick={() => {
          router.push(`/talants/organizations?organizationId=${orgRole?.organization?.id}`);
        }} cursor="pointer" key={i} p={1}>
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

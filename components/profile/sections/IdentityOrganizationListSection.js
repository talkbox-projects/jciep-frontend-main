import { Box, VStack, Tag, Text, HStack, Avatar } from "@chakra-ui/react";
import { useRouter } from "next/router";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";

const IdentityOrganizationListSection = () => {
  const { identity, page, enums } = IdentityProfileStore.useContext();

  const router = useRouter();
  const hasOrganization = identity?.organizationRole?.length > 0;

  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(
            page?.content?.wordings,
            "related_organization_header_label"
          )}
        </Text>
      </HStack>
      <VStack pb={4} align="stretch" px={1} direction={"column"} spacing={4}>
        {!hasOrganization ? (
          <Text align="center" color="#999" fontSize="sm">
            {wordExtractor(page?.content?.wordings, "no_organization_created")}
          </Text>
        ) : (
          (identity?.organizationRole ?? []).map(
            ({ organization, role, status }) => {
              return (
                <HStack
                  onClick={() => {
                    router.push(`/user/organization/${organization.id}`);
                  }}
                  px={4}
                  py={2}
                  _hover={{ bg: "#fafafa" }}
                  cursor="pointer"
                >
                  <Avatar
                    {...(organization?.logo?.url && { bgColor: "white" })}
                    size="md"
                    src={organization?.logo?.url}
                  ></Avatar>
                  <VStack align="start" spacing={0} flex={1} minW={0} w="100%">
                    <Text>{organization?.chineseCompanyName}</Text>
                    <Text color="#999" fontSize="sm">
                      {
                        enums?.EnumJoinRoleList?.find((x) => x.key === role)
                          ?.value?.[router?.locale]
                      }
                    </Text>
                  </VStack>
                  <Tag>
                    {
                      enums?.EnumJoinStatusList?.find((x) => x.key === status)
                        ?.value?.[router?.locale]
                    }
                  </Tag>
                </HStack>
              );
            }
          )
        )}
      </VStack>
      <Box></Box>
    </SectionCard>
  );
};

export default IdentityOrganizationListSection;

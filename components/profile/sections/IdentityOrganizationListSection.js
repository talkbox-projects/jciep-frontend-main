import { VStack, Tag, Text, HStack, Avatar, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useDisclosureWithParams } from "../../../store/AppStore";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import OrganizationMemberJoin from "../../../utils/api/OrganizationMemberJoin";
import wordExtractor from "../../../utils/wordExtractor";
import OrganizationMemberJoinModal from "../fragments/OrganzationMemberJoinModal";
import SectionCard from "../fragments/SectionCard";
import NextLink from "next/link";
import React from "react";

const IdentityOrganizationListSection = () => {
  const { identity, page, enums, refreshIdentity } =
    IdentityProfileStore.useContext();

  const router = useRouter();
  const hasOrganization = identity?.organizationRole?.length > 0;

  const joinDisclosure = useDisclosureWithParams();

  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(
            page?.content?.wordings,
            "related_organization_header_label"
          )}
        </Text>

        <Button
          variant="link"
          leftIcon={<AiOutlineUserAdd />}
          onClick={(e) => {
            e.stopPropagation();
            joinDisclosure.onOpen({
              page,
              organizationType: ["public","pwd", "staff"].includes(identity?.type)
                ? "ngo"
                : "employment",
              onSubmit: async (params) => {
                try {
                  await OrganizationMemberJoin({
                    invitationCode: params?.invitationCode,
                    identityId: identity?.id,
                  });
                  window.location.reload();
                  joinDisclosure.onClose();
                } catch (error) {
                  console.error(error);
                }
              },
            });
          }}
        >
          {wordExtractor(
            page?.content?.wordings,
            "join_via_invitation_code_button_label"
          )}
        </Button>
      </HStack>
      <VStack pb={4} align="stretch" px={1} direction={"column"} spacing={4}>
        {!hasOrganization && ["ngo", "employer"].includes(identity?.type) ? (
          <Text align="center" color="#757575" fontSize="sm">
            <NextLink
              href={`/user/organization/${
                identity?.type === "staff" ? "ngo" : "company"
              }/${identity?.id}/add`}
            >
              <Button variant="link">
                {wordExtractor(
                  page?.content?.wordings,
                  "no_organization_created"
                )}
              </Button>
            </NextLink>
          </Text>
        ) : (
          (identity?.organizationRole ?? []).map(
            ({ organization, role, status }) => {
              return (
                <HStack
                  key={organization.id}
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
                    <Text color="#757575" fontSize="sm">
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
      <OrganizationMemberJoinModal {...joinDisclosure} />
    </SectionCard>
  );
};

export default IdentityOrganizationListSection;

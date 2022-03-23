import { VStack, Tag, Text, HStack, Button, Box } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import OrganizationSubmissionDetailModal from "../fragments/OrganizationSubmissionDetailModal";
import OrganizationSubmissionFormModal from "../fragments/OrganizationSubmissionFormModal";
import SectionCard from "../fragments/SectionCard";
import React from "react";

const OrganizationSubmissionSection = () => {
  const { organization, page, enums, refreshOrganization } =
    OrganizationProfileStore.useContext();

  const submissionFormDisclosure = useDisclosureWithParams();
  const submissionDetailDisclosure = useDisclosureWithParams();
  const router = useRouter();
  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "submission_header_label")}
        </Text>
        <Box flex={1} minW={0} w="100%" />
        {["rejected", "resubmit"].includes(organization?.status) && (
          <Button
            size="sm"
            colorScheme="gray"
            variant="ghost"
            leftIcon={<AiOutlinePlus />}
            onClick={() => {
              submissionFormDisclosure.onOpen({
                organization,
                onRefresh: refreshOrganization,
              });
            }}
          >
            {wordExtractor(page?.content?.wordings, "提交申請")}
          </Button>
        )}
      </HStack>
      <VStack pb={4} align="stretch" direction={"column"} spacing={4}>
        <Text px={4} fontSize="sm" color="#aaa">
          {wordExtractor(
            page?.content?.wordings,
            "submission_header_tooltip_label"
          )}
        </Text>
        <VStack align="stretch" direction={"column"} spacing={0}>
          {(organization?.submission ?? [])
            .sort((a, b) => (a?.createdAt > b?.createdAt ? -1 : 1))
            .map((submission, index) => {
              const { id, createdAt, status } = submission;
              return (
                <HStack
                  key={id}
                  onClick={() => {
                    submissionDetailDisclosure.onOpen({
                      organization,
                      submission,
                      isLatest: index === 0,
                      onRefresh: refreshOrganization,
                    });
                  }}
                  _hover={{
                    bg: "#fafafa",
                  }}
                  cursor="pointer"
                  px={4}
                  py={2}
                >
                  <VStack align="start" spacing={0} flex={1} minW={0} w="100%">
                    <Text
                      textOverflow="ellipsis"
                      {...(index > 0 && {
                        fontSize: "xs",
                        color: "#757575",
                      })}
                    >
                      {moment(createdAt).format("YYYY-MM-DD hh:mm a")}
                    </Text>
                    <Text color="#757575" fontSize="sm"></Text>
                  </VStack>
                  <Tag
                    size="md"
                    {...(index > 0 && {
                      fontSize: "xs",
                      color: "#757575",
                    })}
                  >
                    {
                      enums?.EnumOrganizationStatusList?.find(
                        (x) => x.key === status
                      )?.value?.[router?.locale]
                    }
                  </Tag>
                </HStack>
              );
            })}
        </VStack>
      </VStack>
      <OrganizationSubmissionDetailModal
        params={submissionDetailDisclosure.params}
        isOpen={submissionDetailDisclosure.isOpen}
        onClose={submissionDetailDisclosure.onClose}
      />
      <OrganizationSubmissionFormModal
        params={submissionFormDisclosure.params}
        isOpen={submissionFormDisclosure.isOpen}
        onClose={submissionFormDisclosure.onClose}
      />
    </SectionCard>
  );
};

export default OrganizationSubmissionSection;

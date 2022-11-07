import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Button,
  ModalCloseButton,
  SimpleGrid,
  Select,
  GridItem,
  Text,
  VStack,
  Wrap,
  Tag,
  Box,
  AspectRatio,
  Image,
  Textarea,
  Divider,
  FormControl,
  FormLabel,
  Alert,
  Center,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import { getEnumText } from "../../../utils/enums/getEnums";
import wordExtractor from "../../../utils/wordExtractor";
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect } from "react";
import OrganizationSubmissionUpdate from "../../../utils/api/OrganizationSubmissionUpdate";
import { AiOutlineFilePdf } from "react-icons/ai";

const OrganizationSubmissionDetailModal = ({
  isOpen,
  onClose,
  params: { submission, organization, isLatest } = {},
}) => {
  const { page, enums, refreshOrganization, isAdmin } =
    OrganizationProfileStore.useContext();
  const router = useRouter();

  const { reset, handleSubmit, register } = useForm({
    defaultValues: {
      status: submission?.status,
      remark: submission?.remark,
    },
  });

  useEffect(() => {
    reset({
      status: submission?.status,
      remark: submission?.remark,
    });
  }, [submission, reset]);

  const onSubmissionUpdate = useCallback(
    async (values) => {
      try {
        await OrganizationSubmissionUpdate({
          input: { id: submission.id, ...values },
        });
        refreshOrganization();
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [submission, refreshOrganization, onClose]
  );

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent as="form" onSubmit={handleSubmit(onSubmissionUpdate)}>
        <ModalHeader>
          {wordExtractor(
            page?.content?.wordings,
            "field_label_submission_modal_header"
          )}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pb={6} as={VStack} align="stretch">
          <SimpleGrid gap={4} columns={[1, 2, 2, 2]}>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_chineseCompanyName"
                )}
              </Text>
              <Text>
                {submission?.chineseCompanyName ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_englishCompanyName"
                )}
              </Text>
              <Text>
                {submission?.englishCompanyName ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_website"
                )}
              </Text>
              <Text>
                {submission?.website ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575" mb={0}>
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_industry"
                )}
              </Text>
              <Wrap>
                {submission?.industry.map((key) => (
                  <Tag key={key}>
                    {getEnumText(enums?.EnumIndustryList, key, router.locale) ??
                      wordExtractor(
                        page?.content?.wordings,
                        "empty_text_label"
                      )}
                  </Tag>
                ))}
              </Wrap>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_industryOther"
                )}
              </Text>
              <Text>
                {submission?.industryOther ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_mission_and_vision"
                )}
              </Text>
              <Text>
                {submission?.missionNVision ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_description"
                )}
              </Text>
              <Text>
                {submission?.description ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            {organization?.organizationType !== "ngo" ? (
              <GridItem w="100%">
                <Text color="#757575">
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_submission_businessRegistration"
                  )}
                </Text>
                <SimpleGrid gap={2} w="100%" columns={[2, 2, 2]}>
                  {(submission?.businessRegistration ?? []).map(
                    ({ url }, index) => {
                      const isPDF = url && /[^.]*$/.exec(url)[0] === "pdf";
                      if (isPDF) {
                        return (
                          <Box
                            bgColor="#F2F2F2"
                            h={"120px"}
                            w={"100%"}
                            bgSize={{ base: "cover" }}
                            bgPosition={"center center"}
                            position={"relative"}
                          >
                            <a href={url} target="_blank" rel="noreferrer">
                              <Center h={"100%"}>
                                <AiOutlineFilePdf
                                  style={{ width: "30px", height: "30px" }}
                                />
                              </Center>
                            </a>
                          </Box>
                        );
                      }
                      return (
                        <AspectRatio key={index} ratio={1}>
                          <Image
                            alt={wordExtractor(
                              page?.content?.wordings,
                              "business_registration_alt_text"
                            )}
                            borderRadius={8}
                            boxShadow="md"
                            src={url}
                          />
                        </AspectRatio>
                      );
                    }
                  )}
                </SimpleGrid>
              </GridItem>
            ) : null}

            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_contactName"
                )}
              </Text>
              <Text>
                {submission?.contactName ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_contactEmail"
                )}
              </Text>
              <Text>
                {submission?.contactEmail ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>

            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_target_group"
                )}
              </Text>
              {Array.isArray(submission?.targetGroup) ? (
                submission?.targetGroup?.map((d) => <Text key={d}>{d}</Text>)
              ) : (
                <Text>
                  {submission?.targetGroup ||
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              )}
            </GridItem>

            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_target_group_disabilities"
                )}
              </Text>
              <Text>
                {submission?.targetGroupDisabilities ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>

            {submission?.targetGroupDisabilities==="other" && (<GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_target_group_disabilities_other"
                )}
              </Text>
              <Text>
                {submission?.targetGroupDisabilities ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>)}

            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_contactPhone"
                )}
              </Text>
              <Text>
                {submission?.contactPhone ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_createdAt"
                )}
              </Text>
              <Text>
                {moment(submission?.createdAt).format("YYYY-MM-DD hh:mm a")}
              </Text>
            </GridItem>
            <GridItem>
              <Text color="#757575">
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_submission_vettedAt"
                )}
              </Text>
              <Text>
                {submission?.vettedAt
                  ? moment(submission?.vettedAt).format("YYYY-MM-DD hh:mm a")
                  : wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </GridItem>
          </SimpleGrid>

          <Divider py={4} />

          <Box py={4}>
            {!isAdmin || submission?.vettedAt || !isLatest ? (
              <VStack>
                {!isLatest && (
                  <Alert status="info" variant="left-accent">
                    {wordExtractor(
                      page?.content?.wordings,
                      "is_not_latest_submission_label"
                    )}
                  </Alert>
                )}
                <SimpleGrid alignSelf="stretch" gap={6}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_submission_status"
                        )}
                      </FormLabel>
                      <Tag>
                        {
                          enums?.EnumOrganizationStatusList?.find(
                            (x) => x.key === submission?.status
                          )?.value?.[router.locale]
                        }
                      </Tag>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_submission_remark"
                        )}
                      </FormLabel>
                      <Text whiteSpace="no-wrap">{submission?.remark}</Text>
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
              </VStack>
            ) : (
              <VStack align="center">
                <SimpleGrid alignSelf="stretch" gap={6}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_submission_status"
                        )}
                      </FormLabel>
                      <Select
                        defaultValue="approved"
                        {...register("status", {})}
                      >
                        {enums?.EnumOrganizationStatusList?.map(
                          ({
                            key: value,
                            value: { [router.locale]: label },
                          }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_submission_remark"
                        )}
                      </FormLabel>
                      <Textarea
                        rows={5}
                        resize="none"
                        {...register("remark", {})}
                      />
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
                <Button
                  alignSelf="center"
                  minW={24}
                  mt={6}
                  colorScheme="yellow"
                  color="black"
                  px={4}
                  py={2}
                  borderRadius="2em"
                  type="submit"
                >
                  {wordExtractor(page?.content?.wordings, "save_button_label")}
                </Button>
              </VStack>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrganizationSubmissionDetailModal;

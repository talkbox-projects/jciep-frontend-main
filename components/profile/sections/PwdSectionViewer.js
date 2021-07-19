import {
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  HStack,
  Divider,
  VStack,
  Wrap,
  Tag,
  useToast,
} from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useRouter } from "next/router";
import { AiOutlineEdit } from "react-icons/ai";
import moment from "moment";
import { getEnumText } from "../../../utils/enums/getEnums";
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from "react-icons/md";

const PwdSectionViewer = () => {
  const router = useRouter();
  const {
    isAdmin,
    page,
    enums,
    identity,
    editSection,
    setEditSection,
    saveIdentity,
    editable,
    userFieldVisible,
  } = IdentityProfileStore.useContext();

  const toast = useToast();

  return (
    <VStack spacing={1} align="stretch">
      <HStack py={2} px={4} minH={16} spacing={4} justifyContent="flex-end">
        {(isAdmin || editable) && (
          <Button
            variant="outline"
            isActive={!!identity?.published}
            onClick={async () => {
              try {
                await saveIdentity({
                  id: identity?.id,
                  published: !identity?.published,
                });
                toast({
                  title: !identity?.published ? "已發佈檔案" : "已取消發佈",
                  status: !identity?.published ? "info" : "warning",
                  position: "bottom",
                });
              } catch (error) {
                console.error(error);
              }
            }}
            leftIcon={
              !identity?.published ? (
                <MdRadioButtonUnchecked />
              ) : (
                <MdRadioButtonChecked />
              )
            }
          >
            {wordExtractor(
              page?.content?.wordings,
              identity?.published
                ? "published_my_profile_label"
                : "publish_my_profile_label"
            )}
          </Button>
        )}
        {(isAdmin || editable) && !editSection && (
          <Button
            onClick={() => setEditSection("profile")}
            leftIcon={<AiOutlineEdit />}
            variant="link"
          >
            {wordExtractor(page?.content?.wordings, "edit_my_profile_label")}
          </Button>
        )}
      </HStack>
      <VStack spacing={1} px={8} align="start">
        <Wrap>
          <Text fontSize="xl" fontWeight="bold">
            {router.locale === "zh"
              ? identity?.chineseName
              : identity?.englishName}
          </Text>
          <Tag>
            {
              enums?.EnumIdentityTypeList?.find((x) => x.key === identity?.type)
                ?.value?.[router.locale]
            }
          </Tag>
        </Wrap>
        <Text color="#999">
          {identity?.caption ??
            wordExtractor(page?.content?.wordings, "empty_text_label")}
        </Text>
      </VStack>
      <VStack px={8} py={4} align="stretch" spacing={4}>
        {userFieldVisible && (
          <>
            <Stack direction={["column", "column", "row"]}>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_chineseName"
                  )}
                </FormLabel>
                <Text>
                  {identity?.chineseName ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_englishName"
                  )}
                </FormLabel>
                <Text>
                  {identity?.englishName ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              </FormControl>
            </Stack>
            <Stack direction={["column", "column", "row"]}>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(page?.content?.wordings, "field_label_email")}
                </FormLabel>
                <Text>
                  {identity?.email ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(page?.content?.wordings, "field_label_phone")}
                </FormLabel>
                <Text>
                  {identity?.phone ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              </FormControl>
            </Stack>

            <Stack direction={["column", "column", "row"]}>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(page?.content?.wordings, "field_label_dob")}
                </FormLabel>
                <Text>
                  {identity?.dob
                    ? moment(identity?.dob).format("YYYY-MM-DD")
                    : wordExtractor(
                        page?.content?.wordings,
                        "empty_text_label"
                      )}
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_district"
                  )}
                </FormLabel>
                <Text>
                  {getEnumText(
                    enums?.EnumGenderList,
                    identity?.gender,
                    router.locale
                  ) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              </FormControl>
            </Stack>
            <Stack direction={["column", "column", "row"]}>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_district"
                  )}
                </FormLabel>
                <Text>
                  {getEnumText(
                    enums?.EnumDistrictList,
                    identity?.district,
                    router.locale
                  ) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_industry"
                  )}
                </FormLabel>
                <Wrap>
                  {identity?.industry.map((key) => (
                    <Tag key={key}>
                      {getEnumText(
                        enums?.EnumIndustryList,
                        key,
                        router.locale
                      ) ??
                        wordExtractor(
                          page?.content?.wordings,
                          "empty_text_label"
                        )}
                    </Tag>
                  ))}
                </Wrap>
              </FormControl>
            </Stack>
          </>
        )}
        <Divider />
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_interestedEmploymentMode"
              )}
            </FormLabel>
            <Wrap>
              {identity?.interestedEmploymentMode?.length > 0
                ? (identity?.interestedEmploymentMode ?? []).map((key) => (
                    <Tag key={key}>
                      {getEnumText(
                        enums?.EnumEmploymentModeList,
                        key,
                        router.locale
                      )}
                    </Tag>
                  ))
                : wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Wrap>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_pwdType")}
            </FormLabel>
            <Wrap>
              {identity?.pwdType?.length > 0
                ? (identity?.pwdType ?? []).map((key) => (
                    <Tag key={key}>
                      {getEnumText(enums?.EnumPwdTypeList, key, router.locale)}
                    </Tag>
                  ))
                : wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Wrap>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_interestedIndustry"
              )}
            </FormLabel>
            <Wrap>
              {(identity?.interestedIndustry ?? []).map((key) => (
                <Tag key={key}>
                  {getEnumText(enums?.EnumIndustryList, key, router.locale) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Tag>
              ))}
            </Wrap>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_interestedIndustryOther"
              )}
            </FormLabel>
            <Text>
              {identity?.interestedIndustryOther ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_educationLevel"
              )}
            </FormLabel>
            <Text>
              {getEnumText(
                enums?.EnumDegreeList,
                identity?.educationLevel,
                router.locale
              ) ?? wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_yearOfExperience"
              )}
            </FormLabel>
            <Text>
              {getEnumText(
                enums?.EnumYearOfExperienceList,
                identity?.yearOfExperience,
                router.locale
              ) ?? wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>

        <Divider />
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_writtenLanguage"
              )}
            </FormLabel>
            <Wrap>
              {(identity?.writtenLanguage ?? []).map((key) => (
                <Tag key={key}>
                  {getEnumText(
                    enums?.EnumWrittenLanguageList,
                    key,
                    router.locale
                  ) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Tag>
              ))}
            </Wrap>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_writtenLanguageOther"
              )}
            </FormLabel>
            <Text>
              {identity?.writtenLanguageOther ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_oralLanguage"
              )}
            </FormLabel>
            <Wrap>
              {(identity?.oralLanguage ?? []).map((key) => (
                <Tag key={key}>
                  {getEnumText(
                    enums?.EnumOralLanguageList,
                    key,
                    router.locale
                  ) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Tag>
              ))}
            </Wrap>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_oralLanguageOther"
              )}
            </FormLabel>
            <Text>
              {identity?.oralLanguageOther ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_skill")}
            </FormLabel>
            <Wrap>
              {(identity?.skill ?? []).map((key) => (
                <Tag key={key}>
                  {getEnumText(enums?.EnumSkillList, key, router.locale) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Tag>
              ))}
            </Wrap>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_skillOther")}
            </FormLabel>
            <Text>
              {identity?.skillOther ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_hobby")}
            </FormLabel>
            <Text whiteSpace="pre">
              {identity?.hobby ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
      </VStack>{" "}
    </VStack>
  );
};

export default PwdSectionViewer;

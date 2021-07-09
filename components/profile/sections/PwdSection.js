import {
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  useDisclosure,
  Wrap,
  Tag,
  Input,
  FormHelperText,
  Select,
  Box,
  Divider,
} from "@chakra-ui/react";
import MultiSelect from "react-select";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineEdit } from "react-icons/ai";
import { useAppContext } from "../../../store/AppStore";
import { getEnumText } from "../../../utils/enums/getEnums";
import wordExtractor from "../../../utils/wordExtractor";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";

const PwdSection = ({ identity, page, enums, editable }) => {
  const router = useRouter();
  const props = { identity, page, enums, editable };
  const editModelDisclosure = useDisclosure();
  const { updateIdentity } = useAppContext();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  useEffect(() => {
    if (!editModelDisclosure.isOpen) {
      reset(identity);
    }
  }, [identity, editModelDisclosure.isOpen]);

  const onSubmit = useCallback((values) => {
    alert("updated");
    updateIdentity(identity?.id, values);
    editModelDisclosure.onClose();
    console.log(values);
  }, []);

  const editor = (
    <>
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
        <FormControl isInvalid={errors?.caption?.message}>
          <Input
            variant="flushed"
            placeholder={wordExtractor(
              page?.content?.wordings,
              "field_label_caption"
            )}
            defaultValue={identity?.caption}
            {...register("caption", {})}
          ></Input>
          <FormHelperText color="red">
            {errors?.caption?.message}
          </FormHelperText>
        </FormControl>
      </VStack>

      <VStack px={8} py={4} align="stretch" spacing={4}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl
            isRequired={true}
            isInvalid={errors?.chineseName?.message}
          >
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.chineseName}
              {...register("chineseName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.chineseName?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={errors?.englishName?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.englishName}
              {...register("englishName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.englishName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isRequired isInvalid={errors?.email?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_email")}
            </FormLabel>
            <Input
              type="email"
              variant="flushed"
              defaultValue={identity?.email}
              {...register("email", {
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_email"
                  ),
                },
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.email?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={errors?.phone?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_phone")}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.phone}
              {...register("phone", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.phone?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.dob?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_dob")}
            </FormLabel>
            <Input
              type="date"
              variant="flushed"
              defaultValue={identity?.dob}
              {...register("dob", {})}
            ></Input>
            <FormHelperText color="red">{errors?.dob?.message}</FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.gender?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_gender")}
            </FormLabel>
            <Select
              variant="flushed"
              {...register("gender", {})}
              defaultValue={identity?.gender}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumGenderList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">
              {errors?.gender?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.district?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_district")}
            </FormLabel>
            <Select
              variant="flushed"
              {...register("district", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
              defaultValue={identity?.district}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumDistrictList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">
              {errors?.district?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.industry?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_industry")}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"industry"}
              defaultValue={identity?.industry ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumIndustryList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.industry?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <Divider />
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.interestedEmploymentMode?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_interestedEmploymentMode"
              )}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"interestedEmploymentMode"}
              defaultValue={identity?.interestedEmploymentMode ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumEmploymentModeList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.interestedEmploymentMode?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.pwdType?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_pwdType")}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"pwdType"}
              defaultValue={identity?.pwdType ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumPwdTypeList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.pwdType?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.skill?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_interestedIndustry"
              )}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"interestedIndustry"}
              defaultValue={identity?.interestedIndustry ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumIndustryList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.interestedIndustry?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.interestedIndustryOther?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_interestedIndustryOther"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.skillOther}
              {...register("interestedIndustryOther", {})}
            ></Input>
            <FormHelperText color="red">
              {errors?.interestedIndustryOther?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.educationLevel?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_educationLevel"
              )}
            </FormLabel>
            <Select
              variant="flushed"
              {...register("educationLevel", {})}
              defaultValue={identity?.educationLevel}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumDegreeList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">
              {errors?.educationLevel?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.yearOfExperience?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_yearOfExperience"
              )}
            </FormLabel>
            <Select
              variant="flushed"
              {...register("yearOfExperience", {})}
              defaultValue={identity?.yearOfExperience}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumYearOfExperienceList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">
              {errors?.yearOfExperience?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <Divider />
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.writtenLanguage?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_writtenLanguage"
              )}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"writtenLanguage"}
              defaultValue={identity?.writtenLanguage ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumWrittenLanguageList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.writtenLanguage?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.writtenLanguageOther?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_writtenLanguageOther"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.writtenLanguageOther}
              {...register("writtenLanguageOther", {})}
            ></Input>
            <FormHelperText color="red">
              {errors?.writtenLanguageOther?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.oralLanguage?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_oralLanguage"
              )}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"oralLanguage"}
              defaultValue={identity?.oralLanguage ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumOralLanguageList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.oralLanguage?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.oralLanguageOther?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_oralLanguageOther"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.oralLanguageOther}
              {...register("oralLanguageOther", {})}
            ></Input>
            <FormHelperText color="red">
              {errors?.oralLanguageOther?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.skill?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_skill")}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"skill"}
              defaultValue={identity?.skill ?? []}
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumSkillList.map(
                  ({ key: value, value: { [router.locale]: label } }) => ({
                    value,
                    label,
                  })
                );
                return (
                  <MultiSelect
                    styles={{
                      control: (_) => ({
                        ..._,
                        borderRadius: 0,
                        borderColor: "#ddd",
                        borderTop: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottomWidth: 1,
                      }),
                    }}
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "empty_text_label"
                    )}
                    isMulti={true}
                    name={name}
                    onChange={(s) => onChange(s.map((s) => s.value))}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.skill?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.skillOther?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_skillOther")}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.skillOther}
              {...register("skillOther", {})}
            ></Input>
            <FormHelperText color="red">
              {errors?.skillOther?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.hobby?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_hobby")}
            </FormLabel>
            <Input
              type="textarea"
              variant="flushed"
              defaultValue={identity?.hobby}
              {...register("hobby", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.chineseName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
      </VStack>
    </>
  );

  const view = (
    <>
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
              {moment(identity?.dob).format("YYYY-MM-DD") ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_district")}
            </FormLabel>
            <Text>
              {getEnumText(
                enums?.EnumGenderList,
                identity?.gender,
                router.locale
              ) ?? wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_district")}
            </FormLabel>
            <Text>
              {getEnumText(
                enums?.EnumDistrictList,
                identity?.district,
                router.locale
              ) ?? wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_industry")}
            </FormLabel>
            <Wrap>
              {identity?.industry.map((key) => (
                <Tag key={key}>
                  {getEnumText(enums?.EnumIndustryList, key, router.locale) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Tag>
              ))}
            </Wrap>
          </FormControl>
        </Stack>
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
              {identity?.writtenLanguageOther ??
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
              {identity?.oralLanguageOther ??
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
              {identity?.skillOther ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_hobby")}
            </FormLabel>
            <Text>
              {identity?.hobby ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
      </VStack>
    </>
  );

  return (
    <SectionCard>
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={1}
        align="stretch"
      >
        <BannerFragment {...props} />
        <VStack align="stretch">
          <HStack py={2} px={4} spacing={4} justifyContent="flex-end">
            {editModelDisclosure.isOpen ? (
              <>
                <Button variant="link" onClick={editModelDisclosure.onClose}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "cancel_button_label"
                  )}
                </Button>
                <Button
                  colorScheme="yellow"
                  color="black"
                  px={8}
                  py={2}
                  borderRadius="2em"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {wordExtractor(page?.content?.wordings, "save_button_label")}
                </Button>
              </>
            ) : (
              <Button
                onClick={editModelDisclosure.onOpen}
                leftIcon={<AiOutlineEdit />}
                variant="link"
              >
                {wordExtractor(
                  page?.content?.wordings,
                  "edit_my_profile_label"
                )}
              </Button>
            )}
          </HStack>
        </VStack>
        {editModelDisclosure.isOpen ? editor : view}
      </VStack>
    </SectionCard>
  );
};

export default PwdSection;

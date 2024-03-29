import {
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Wrap,
  Tag,
  Input,
  FormHelperText,
  Textarea
} from "@chakra-ui/react";
import React from "react";
import MultiSelect from "react-select";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import { useRouter } from "next/router";
import { emailRegex, urlRegex } from "../../../utils/general";

const NgoSectionEditor = () => {
  const router = useRouter();
  const { page, enums, saveOrganization, organization, removeEditSection } =
    OrganizationProfileStore.useContext();

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      id: organization.id,
      chineseCompanyName: organization.chineseCompanyName,
      englishCompanyName: organization.englishCompanyName,
      targetGroupDisabilities: organization?.targetGroupDisabilities??organization?.submission[0]?.targetGroupDisabilities
    },
  });
  const { submission } = organization;
  const targetGroupData =
    organization?.targetGroup ?? submission[0]?.targetGroup;
  const getTargetGroupDisabilities = watch("targetGroupDisabilities");

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (values) => {
        try {
          await saveOrganization({
            ...values,
            targetGroupDisabilitiesOther: values?.targetGroupDisabilities === 'other' ? values?.targetGroupDisabilitiesOther : null
          });
          removeEditSection();
        } catch (error) {
          console.error(error);
        }
      })}
      spacing={1}
      align="stretch"
    >
      <VStack align="stretch">
        <HStack py={2} px={4} spacing={4} justifyContent="flex-end">
          <Button variant="link" onClick={removeEditSection}>
            {wordExtractor(page?.content?.wordings, "cancel_button_label")}
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
        </HStack>
      </VStack>
      <VStack spacing={1} px={8} align="start">
        <Wrap>
          <Text fontSize="xl" fontWeight="bold">
            {router.locale === "zh"
              ? organization?.chineseCompanyName
              : organization?.englishCompanyName}
          </Text>
          <Tag>
            {
              enums?.EumOrganizationTypeList?.find(
                (x) => x.key === organization?.type
              )?.value?.[router.locale]
            }
          </Tag>
          <Tag>
            {
              enums?.EumOrganizationStatusList?.find(
                (x) => x.key === organization?.status
              )?.value?.[router.locale]
            }
          </Tag>
        </Wrap>
      </VStack>
      <VStack px={8} py={4} align="stretch" spacing={6}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl
            isRequired={true}
            isInvalid={errors?.chineseCompanyName?.message}
          >
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseCompanyName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.chineseCompanyName}
              {...register("chineseCompanyName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.chineseCompanyName?.message}
            </FormHelperText>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors?.englishCompanyName?.message}
          >
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishCompanyName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.englishCompanyName}
              {...register("englishCompanyName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.englishCompanyName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.contactName?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.contactName}
              {...register("contactName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.contactName?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.contactEmail?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactEmail"
              )}
            </FormLabel>
            <Input
              type="contactEmail"
              variant="flushed"
              defaultValue={organization?.contactEmail}
              {...register("contactEmail", {
                pattern: {
                  value: emailRegex,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_contactEmail"
                  ),
                },
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.contactEmail?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.targetGroup?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_target_group"
              )}
            </FormLabel>
            <Controller
              control={control}
              name={"targetGroup"}
              defaultValue={
                Array.isArray(targetGroupData)
                  ? targetGroupData
                  : [targetGroupData]
              }
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumTargetGroupList.map(
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
              {errors?.targetGroup?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.industry?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_target_group_disabilities"
              )}
            </FormLabel>
            <Controller
              control={control}
              name={"targetGroupDisabilities"}
              defaultValue={
                organization?.targetGroupDisabilities ??
                submission[0]?.targetGroupDisabilities
              }
              render={({ field: { name, value, onChange } }) => {
                const options = enums?.EnumTargetGroupDisabilityList.map(
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
                    name={name}
                    onChange={(s) => onChange(s.value)}
                    value={options.filter((o) =>
                      (value ?? [])?.includes(o.value)
                    )}
                    options={options}
                  />
                );
              }}
            ></Controller>
            <FormHelperText color="red">
              {errors?.targetGroup?.message}
            </FormHelperText>
          </FormControl>
        </Stack>


        <Stack direction={["column", "column", "row"]}>
        {getTargetGroupDisabilities === "other" && (
            <FormControl>
              <FormLabel color="#757575" mb={0}>
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_target_group_disabilities"
                )}
              </FormLabel>
              <Input
                variant="flushed"
                defaultValue={
                  organization?.targetGroupDisabilitiesOther ??
                  submission[0]?.targetGroupDisabilitiesOther
                }
                {...register("targetGroupDisabilitiesOther", {})}
              ></Input>
            </FormControl>
          )}
        </Stack>

        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.contactPhone?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactPhone"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.contactPhone}
              {...register("contactPhone", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.contactPhone?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.website?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_website")}
            </FormLabel>
            <Input
              type="text"
              variant="flushed"
              defaultValue={organization?.website}
              {...register("website", {
                pattern: {
                  value: urlRegex,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_url"
                  ),
                },
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.website?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.description?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_organization_description"
              )}
            </FormLabel>
            <Textarea
              rows={5}
              resize="none"
              variant="flushed"
              defaultValue={organization?.description}
              {...register("description", {})}
            ></Textarea>
            <FormHelperText color="red">
              {errors?.chineseName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.description?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_mission_and_vision"
              )}
            </FormLabel>
            <Textarea
              rows={5}
              resize="none"
              variant="flushed"
              defaultValue={
                organization?.description ??
                organization?.submission[0]?.missionNVision
              }
              {...register("missionNVision", {})}
            ></Textarea>
          </FormControl>
        </Stack>


      </VStack>
    </VStack>
  );
};

export default NgoSectionEditor;

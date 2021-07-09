import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Stack,
  Select,
  Tag,
  Input,
  HStack,
  Image,
  Text,
  useDisclosure,
  VStack,
  FormControl,
  FormHelperText,
  FormLabel,
  AspectRatio,
  Wrap,
  WrapItem,
  SimpleGrid,
} from "@chakra-ui/react";
import MultiSelect from "react-select";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppContext } from "../../../store/AppStore";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import wordExtractor from "../../../utils/wordExtractor";
import Container from "../../../components/Container";
import { AiOutlineEdit } from "react-icons/ai";
import { useRouter } from "next/router";
import { getEnums } from "../../../utils/enums/getEnums";
import moment from "moment";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const enums =
    (await getEnums({
      keys: [
        "EnumGenderList",
        "EnumDistrictList",
        "EnumIndustryList",
        "EnumEmploymentModeList",
        "EnumIdentityTypeList",
        "EnumWrittenLanguageList",
        "EnumOralLanguageList",
        "EnumYearOfExperienceList",
        "EnumDegreeList",
        "EnumSkillList",
        "EnumPwdTypeList",
      ],
      lang: context.locale,
    })) ?? {};

  return {
    props: {
      page,
      enums,
      isLangAvailable: context.locale === page.lang,
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
      lang: context.locale,
    },
  };
};

const sectionBorderStyles = {
  borderRadius: 8,
  borderColor: "gray.300",
  borderWidth: 2,
};

const ProfileInfoSection = ({ enums, value: identity, page }) => {
  const router = useRouter();
  const editModelDisclosure = useDisclosure();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: identity,
  });

  const { updateIdentity, identityId } = useAppContext();
  const onSubmit = useCallback(
    async (values) => {
      try {
        const mutation = gql`
          mutation IdentityUpdate($input: IdentityUpdateInput!) {
            IdentityUpdate(input: $input) {
              id
            }
          }
        `;

        let data = await getGraphQLClient().request(mutation, {
          input: {
            id: identityId,
            ...values,
          },
        });
        updateIdentity(identityId, data?.IdentityUpdate);
        editModelDisclosure.onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [router, identityId, editModelDisclosure]
  );

  const fields = useMemo(() => {
    const public_or_profile_fields = {
      fields: [
        {
          type: "text",
          name: "chineseName",
          fullWidth: false,
          validation: {
            required: wordExtractor(
              page?.content?.wordings,
              `field_error_message_required`
            ),
          },
        },
        {
          type: "text",
          name: "englishName",
          fullWidth: false,
          validation: {
            required: wordExtractor(
              page?.content?.wordings,
              `field_error_message_required`
            ),
          },
        },
        {
          type: "date",
          name: "dob",
          fullWidth: false,
        },
        {
          type: "select",
          name: "gender",
          supportUnselectedOption: true,
          options: (enums?.EnumGenderList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "district",
          type: "select",
          supportUnselectedOption: true,
          options: (enums?.EnumDistrictList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "industry",
          type: "multiselect",
          options: (enums?.EnumIndustryList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
      ],
    };

    const staff_employer_profile_fields = {
      fields: [
        {
          type: "text",
          name: "chineseName",
          fullWidth: false,
          validation: {
            required: wordExtractor(
              page?.content?.wordings,
              `field_error_message_required`
            ),
          },
        },
        {
          type: "text",
          name: "englishName",
          fullWidth: false,
          validation: {
            required: wordExtractor(
              page?.content?.wordings,
              `field_error_message_required`
            ),
          },
        },
        {
          type: "text",
          name: "email",
          fullWidth: false,
          validation: {
            required: wordExtractor(
              page?.content?.wordings,
              `field_error_message_required`
            ),
          },
        },
        {
          type: "text",
          name: "phone",
          fullWidth: false,
          validation: {
            required: wordExtractor(
              page?.content?.wordings,
              `field_error_message_required`
            ),
          },
        },
      ],
    };

    const skills_fields = {
      fields: [
        {
          name: "pwdType",
          type: "multiselect",
          validation: {
            validate: {
              required: (value) =>
                value?.length === 0
                  ? wordExtractor(page?.content?.wordings, "empty_text_label")
                  : true,
            },
          },
          options: (enums?.EnumPwdTypeList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: true,
        },
        {
          name: "interestedEmploymentMode",
          type: "multiselect",
          validation: {
            validate: {
              required: (value) =>
                value?.length === 0
                  ? wordExtractor(page?.content?.wordings, "empty_text_label")
                  : true,
            },
          },
          options: (enums?.EnumEmploymentModeList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: true,
        },
        {
          name: "interestedIndustry",
          type: "multiselect",
          validation: {
            validate: {
              required: (value) =>
                value?.length === 0
                  ? wordExtractor(page?.content?.wordings, "empty_text_label")
                  : true,
            },
          },
          options: (enums?.EnumIndustryList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "interestedIndustryOther",
          type: "text",
          fullWidth: false,
        },
        {
          name: "writtenLanguage",
          type: "multiselect",
          validation: {
            validate: {
              required: (value) =>
                value?.length === 0
                  ? wordExtractor(page?.content?.wordings, "empty_text_label")
                  : true,
            },
          },
          options: (enums?.EnumWrittenLanguageList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "writtenLangaugeOther",
          type: "text",
          fullWidth: false,
        },
        {
          name: "oralLanguage",
          type: "multiselect",
          validation: {
            validate: {
              required: (value) =>
                value?.length === 0
                  ? wordExtractor(page?.content?.wordings, "empty_text_label")
                  : true,
            },
          },
          options: (enums?.EnumOralLanguageList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "oralLangaugeOther",
          type: "text",
          fullWidth: false,
        },
        {
          name: "yearOfExperience",
          type: "select",
          supportUnselectedOption: true,
          options: (enums?.EnumYearOfExperienceList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "educationLevel",
          type: "select",
          supportUnselectedOption: true,
          options: (enums?.EnumDegreeList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "hobby",
          type: "text",
          fullWidth: true,
        },
        {
          name: "skills",
          type: "multiselect",
          validation: {
            validate: {
              required: (value) =>
                value?.length === 0
                  ? wordExtractor(page?.content?.wordings, "empty_text_label")
                  : true,
            },
          },
          options: (enums?.EnumSkillList ?? []).map(
            ({ key: value, value: { [router.locale]: label } }) => ({
              value,
              label,
            })
          ),
          fullWidth: false,
        },
        {
          name: "skillOther",
          type: "text",
          fullWidth: false,
        },
      ],
    };

    switch (identity?.type) {
      case "pwd":
        return [skills_fields, public_or_profile_fields];
      case "public":
        return [skills_fields, public_or_profile_fields];
      case "staff":
        return [staff_employer_profile_fields];
      case "employer":
        return [staff_employer_profile_fields];
      default:
        return [];
    }
  }, [identity]);

  if (editModelDisclosure.isOpen) {
    return (
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={1}
        align="stretch"
        {...sectionBorderStyles}
      >
        <VStack align="stretch" spacing={0} position="relative">
          <Controller
            control={control}
            name="bannerMedia"
            render={({ field: { onChange, value } }) => {
              return (
                <AspectRatio ratio={2.5}>
                  <Image
                    w="100%"
                    src={
                      identity?.bannerMedia?.url ??
                      page?.content?.headerSection?.bannerPlaceholder
                    }
                  ></Image>
                </AspectRatio>
              );
            }}
          />
          <Avatar
            size="xl"
            position="absolute"
            left={8}
            bottom={0}
            borderWidth={2}
            borderColor="white"
          ></Avatar>
          <HStack p={2} px={4} justifyContent="flex-end">
            <Button
              colorScheme="yellow"
              color="black"
              px={4}
              py={2}
              borderRadius="2em"
              type="submit"
              isLoading={isSubmitting}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          </HStack>
        </VStack>
        <VStack spacing={0} py={2} px={8} align="start">
          <Wrap>
            <Text fontSize="2xl" fontWeight="bold">
              {router.locale === "en"
                ? identity?.englishName
                : identity?.chineseName}
            </Text>
          </Wrap>

          <VStack
            as={FormControl}
            w="100%"
            align="stretch"
            isInvalid={errors?.caption?.message}
          >
            <Stack
              align={["flex-start", "flex-start", "center"]}
              direction={["column", "column", "row"]}
            >
              <Text w={36} m={0}>
                {wordExtractor(page?.content?.wordings, "field_label_caption")}
              </Text>
              <Input
                w="100%"
                placeholder={wordExtractor(
                  page?.content?.wordings,
                  "empty_text_label"
                )}
                variant="flushed"
                {...register("caption", {
                  required: wordExtractor(
                    page?.content?.wordings,
                    `field_error_message_required`
                  ),
                })}
                defaultValue={identity?.caption}
              />
            </Stack>
            {errors?.caption?.message && (
              <FormHelperText color="red">
                {errors?.caption?.message}
              </FormHelperText>
            )}
          </VStack>
        </VStack>
        <Box px={8}>
          <Divider />
        </Box>
        {fields.map(({ fields: _fields }, index) => {
          return (
            <VStack key={index} spacing={4} py={4} px={8} align="stretch">
              <Wrap>
                {_fields.map(
                  ({
                    name,
                    type,
                    options,
                    validation,
                    supportUnselectedOption,
                    fullWidth,
                  }) => {
                    let valueComponent = null;
                    switch (type) {
                      case "text":
                        valueComponent = (
                          <Input
                            variant="flushed"
                            {...register(name, validation)}
                            defaultValue={identity?.[name]}
                          />
                        );
                        break;

                      case "select":
                        valueComponent = (
                          <Select
                            variant="flushed"
                            {...register(name, validation)}
                            defaultValue={identity?.[name]}
                          >
                            {supportUnselectedOption && (
                              <option key={"unselected"} value={""}>
                                {wordExtractor(
                                  page?.content?.wordings,
                                  "empty_text_label"
                                )}
                              </option>
                            )}
                            {options.map(({ value, label }) => {
                              return (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              );
                            })}
                          </Select>
                        );
                        break;

                      case "multiselect":
                        valueComponent = (
                          <Box>
                            <Controller
                              control={control}
                              rules={validation}
                              name={name}
                              defaultValue={identity?.[name] ?? []}
                              render={({
                                field: { name, value, onChange },
                              }) => {
                                return (
                                  <MultiSelect
                                    placeholder={wordExtractor(
                                      page?.content?.wordings,
                                      "empty_text_label"
                                    )}
                                    isMulti={true}
                                    name={name}
                                    onChange={(s) =>
                                      onChange(s.map((s) => s.value))
                                    }
                                    value={options.filter((o) =>
                                      (value ?? [])?.includes(o.value)
                                    )}
                                    options={options}
                                  />
                                );
                              }}
                            ></Controller>
                          </Box>
                        );
                        break;

                      case "date":
                        valueComponent = (
                          <Input
                            type="date"
                            variant="flushed"
                            {...register(name, validation)}
                            defaultValue={identity?.[name]}
                          />
                        );
                        break;
                      default:
                        valueComponent = (
                          <Text color="gray.500">Unknown Type</Text>
                        );
                        break;
                    }

                    return (
                      <WrapItem
                        {...{ w: fullWidth ? "100%" : "50%" }}
                        key={name}
                      >
                        <FormControl isInvalid={errors?.[name]?.message}>
                          <Text color="gray.500">
                            {wordExtractor(
                              page?.content?.wordings,
                              `field_label_${name}`
                            )}
                            {(!!validation?.required ||
                              !!validation?.validate?.required) && (
                              <Text d="inline" color="red">
                                {" "}
                                *
                              </Text>
                            )}
                          </Text>
                          {valueComponent}
                          {errors?.[name]?.message && (
                            <FormHelperText color="red">
                              {errors?.[name]?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </WrapItem>
                    );
                  }
                )}
              </Wrap>
              <Divider w="100%" />
            </VStack>
          );
        })}
      </VStack>
    );
  } else {
    return (
      <VStack spacing={1} align="stretch" {...sectionBorderStyles}>
        <VStack align="stretch" spacing={0} position="relative">
          <Image
            w="100%"
            src={page?.content?.headerSection?.bannerPlaceholder}
          ></Image>
          <Avatar
            size="xl"
            position="absolute"
            left={8}
            bottom={0}
            borderWidth={2}
            borderColor="white"
          ></Avatar>
          <HStack p={4} justifyContent="flex-end">
            <Button
              onClick={editModelDisclosure.onOpen}
              leftIcon={<AiOutlineEdit />}
              variant="link"
            >
              {wordExtractor(page?.content?.wordings, "edit_my_profile_label")}
            </Button>
          </HStack>
        </VStack>
        <VStack spacing={0} py={2} px={8} align="start">
          <Wrap alignContent="center">
            <Text fontSize="2xl" fontWeight="bold">
              {router.locale === "en"
                ? identity?.englishName
                : identity?.chineseName}
            </Text>
            <HStack align="center">
              <Tag>
                {
                  (enums?.EnumIdentityTypeList ?? []).find(
                    ({ key, value }) => key === identity?.type
                  )?.value?.[router.locale]
                }
              </Tag>
            </HStack>
          </Wrap>
          <Text color="gray.500" fontSize="xl">
            {identity?.caption ??
              wordExtractor(page?.content?.wordings, "empty_text_label")}
          </Text>
        </VStack>
        <Box px={8}>
          <Divider />
        </Box>
        {fields.map(({ fields }, index) => {
          return (
            <VStack key={index} spacing={4} py={4} px={8} align="stretch">
              <SimpleGrid gap={6} columns={[1, null, 2]}>
                {fields.map(({ name, type, options, fullWidth }) => {
                  let valueComponent = null;
                  switch (type) {
                    case "text":
                      valueComponent = (
                        <Text color="gray.500">
                          {identity?.[name] ??
                            wordExtractor(
                              page?.content?.wordings,
                              "empty_text_label"
                            )}
                        </Text>
                      );
                      break;

                    case "select":
                      valueComponent = (
                        <Text color="gray.500">
                          {options?.find((x) => x.value === identity?.[name])
                            ?.label ??
                            wordExtractor(
                              page?.content?.wordings,
                              "empty_text_label"
                            )}
                        </Text>
                      );
                      break;

                    case "multiselect":
                      valueComponent =
                        identity?.[name]?.length > 0 ? (
                          <Wrap mt={1}>
                            {(identity?.[name] ?? [])?.map((value) => {
                              return (
                                <Tag
                                  as={WrapItem}
                                  key={value}
                                  roundedStart
                                  roundedEnd
                                >
                                  {options?.find((x) => x.value === value)
                                    ?.label ?? value}
                                </Tag>
                              );
                            })}
                          </Wrap>
                        ) : (
                          <Text color="gray.500">
                            {wordExtractor(
                              page?.content?.wordings,
                              "empty_text_label"
                            )}
                          </Text>
                        );
                      break;

                    case "date":
                      valueComponent = (
                        <Text color="gray.500">
                          {moment(identity?.[name]).format("YYYY-MM-DD") ??
                            wordExtractor(
                              page?.content?.wordings,
                              "empty_text_label"
                            )}
                        </Text>
                      );
                      break;
                    default:
                      valueComponent = (
                        <Text color="gray.500">Unknown Type</Text>
                      );
                      break;
                  }

                  return (
                    <VStack
                      spacing={0}
                      align="stretch"
                      w={fullWidth ? "100%" : "50%"}
                      key={name}
                    >
                      <Text>
                        {wordExtractor(
                          page?.content?.wordings,
                          `field_label_${name}`
                        )}
                      </Text>
                      <Box>{valueComponent}</Box>
                    </VStack>
                  );
                })}
              </SimpleGrid>
              <Divider w="100%" />
            </VStack>
          );
        })}
      </VStack>
    );
  }
};

const IdentityProfile = ({ enums, page }) => {
  const { identity } = useAppContext();

  const setIdentity = useCallback((identity) => {}, []);

  return (
    <Box pt={64} pb={36}>
      <Container>
        <Stack direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <ProfileInfoSection
              enums={enums}
              value={identity}
              onChange={setIdentity}
              page={page}
            />
            <Box boxShadow="lg"></Box>
          </VStack>
          <VStack align="stretch" w="33%">
            <Box boxShadow="lg"></Box>
            <Box boxShadow="lg"></Box>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default withPageCMS(IdentityProfile, {
  key: PAGE_KEY,
  fields: [
    {
      label: "首區段 Header Section",
      name: "headerSection",
      component: "group",
      fields: [
        {
          label: "預設 Banner Banner Placeholder",
          name: "bannerPlaceholder",
          component: "image",
          uploadDir: () => "/user/profile/head-section",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
  ],
});

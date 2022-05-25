import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  FormHelperText,
  FormLabel,
  Textarea,
  Grid,
  Checkbox,
  Link
} from "@chakra-ui/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import ReactSelect from "react-select";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../../utils/apollo";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../../utils/wordExtractor";
import { emailRegex } from "../../../../../utils/general";

const PAGE_KEY = "organization_ngo_add";

const customStyles = {
  multiValue: (provided) => {
    const borderRadius = "15px";
    return { ...provided, borderRadius };
  },
  multiValueRemove: (provided) => {
    const color = "grey";
    return { ...provided, color };
  },
};

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const OrganizationNgoAdd = ({ page }) => {
  const router = useRouter();
  const { id } = router.query;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const watchFields = watch(["targetGroupDisabilities"]);

  const onFormSubmit = async ({
    chineseOrganizationName,
    englishOrganizationName,
    ngoWebsite,
    ngoDescription,
  }) => {
    try {
      const mutation = gql`
        mutation OrganizationSubmissionCreate(
          $input: OrganizationSubmissionCreateInput!
        ) {
          OrganizationSubmissionCreate(input: $input) {
            id
          }
        }
      `;

      let data = await getGraphQLClient().request(mutation, {
        input: {
          organizationType: "ngo",
          chineseCompanyName: chineseOrganizationName,
          englishCompanyName: englishOrganizationName,
          website: ngoWebsite,
          description: ngoDescription,
          identityId: id,
        },
      });

      if (data && data.OrganizationSubmissionCreate) {
        router.push(
          `/user/organization/ngo/${data.OrganizationSubmissionCreate.id}/pending`
        );
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <VStack py={{ base: 36, md: 48 }}>
      <Text mt={10} fontSize="36px" letterSpacing="1.5px" fontWeight={600}>
        {page?.content?.step?.title}
      </Text>
      <Text fontSize="16px">{page?.content?.step?.subTitle}</Text>

      <Box justifyContent="center" width="100%" marginTop="30px !important">
        <Box
          maxWidth={800}
          width="100%"
          textAlign="left"
          margin="auto"
          padding="0px 25px"
        >
          <VStack as="form" onSubmit={handleSubmit(onFormSubmit)}>
            <Grid
              templateColumns={"repeat(2, 1fr)"}
              width="100%"
              py={10}
              gap={6}
            >
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>
                    {page?.content?.form?.chineseOrganizationName}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "chinese_organization_name_placeholder"
                    )}
                    {...register("chineseOrganizationName", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.chineseCompanyName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "chinese_organization_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>
                    {page?.content?.form?.englishOrganizationName}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "english_organization_name_placeholder"
                    )}
                    {...register("englishOrganizationName", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.englishCompanyName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "english_organization_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <FormLabel>{page?.content?.form?.centre}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "centre_placeholder"
                    )}
                    {...register("centre")}
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2 }}>
                <FormControl isRequired>
                  <FormLabel>{page?.content?.form?.description}</FormLabel>
                  <Textarea
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "description_placeholder"
                    )}
                    {...register("description")}
                  ></Textarea>
                  <FormHelperText>
                    {errors?.description?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "description_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2 }}>
                <FormControl isRequired>
                  <FormLabel>{page?.content?.form?.missionNVision}</FormLabel>
                  <Textarea
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "mission_and_vision_placeholder"
                    )}
                    {...register("missionNVision")}
                  ></Textarea>
                  <FormHelperText>
                    {errors?.missionNVision?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "mission_and_vision_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>
                    {page?.content?.form?.organizationType?.label}
                  </FormLabel>

                  <Controller
                    name="organizationType"
                    isClearable
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactSelect
                        styles={customStyles}
                        {...field}
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "organization_type_placeholder"
                        )}
                        options={page?.content?.form?.organizationType?.options.map(
                          ({ label, value }) => ({ label, value })
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.organizationType?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "organization_type_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>
                    {page?.content?.form?.targetGroup?.label}
                  </FormLabel>

                  <Controller
                    name="targetGroup"
                    isClearable
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactSelect
                        styles={customStyles}
                        {...field}
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "target_group_placeholder"
                        )}
                        options={page?.content?.form?.targetGroup?.options.map(
                          ({ label, value }) => ({ label, value })
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.targetGroup?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "target_group_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>
                    {page?.content?.form?.targetGroupDisabilities?.label}
                  </FormLabel>

                  <Controller
                    name="targetGroupDisabilities"
                    isClearable
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactSelect
                        styles={customStyles}
                        {...field}
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "target_group_disabilities_placeholder"
                        )}
                        options={page?.content?.form?.targetGroupDisabilities?.options.map(
                          ({ label, value }) => ({ label, value })
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.targetGroupDisabilities?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "target_group_disabilities_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>

                {watchFields[0]?.value === "other" && (
                  <Box pt={2}>
                    <FormControl isRequired>
                      <FormLabel>
                        {page?.content?.form?.targetGroupDisabilitiesOther}
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "target_group_disabilities_other_placeholder"
                        )}
                        {...register("targetGroupDisabilitiesOther", {
                          required: true,
                        })}
                      />
                      <FormHelperText>
                        {errors?.targetGroupDisabilitiesOther?.type ===
                          "required" && (
                          <Text color="red">
                            {wordExtractor(
                              page?.content?.wordings,
                              "target_group_disabilities_other_required"
                            )}
                          </Text>
                        )}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                )}
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>{page?.content?.form?.contactName}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_name_placeholder"
                    )}
                    {...register("contactName", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.contactName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "contact_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>{page?.content?.form?.contactPhone}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_phone_placeholder"
                    )}
                    {...register("contactPhone", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.contactName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "contact_phone_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>{page?.content?.form?.contactEmail}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_email_placeholder"
                    )}
                    {...register("contactEmail", {
                      required: true,
                      pattern: {
                        value: emailRegex,
                        message: wordExtractor(
                          page?.content?.wordings,
                          "email_invalid_format"
                        ),
                      },
                    })}
                  />
                  <FormHelperText>
                    {errors?.contactName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "contact_phone_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl isRequired>
                  <FormLabel>{page?.content?.form?.postalAddress}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "postal_address_placeholder"
                    )}
                    {...register("postalAddress", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.postalAddress?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "postal_address_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>


            </Grid>

            <FormControl marginTop="20px !important">
              <Checkbox
                aria-describedby={wordExtractor(
                  page?.content?.wordings,
                  "tnc_accept_required"
                )}
                colorScheme="green"
                {...register("tncAccept", { required: true })}
              >
                {page?.content?.form?.tncAccept?.text}{" "}
                <Link target="_blank" href={page?.content?.form?.tncAccept?.url}>
                  {" "}
                  {page?.content?.form?.tncAccept?.link}{" "}
                </Link>
              </Checkbox>
              <FormHelperText>
                {errors?.tncAccept?.type === "required" && (
                  <Text color="red">
                    {wordExtractor(page?.content?.wordings, "tnc_accept_required")}
                  </Text>
                )}
              </FormHelperText>
            </FormControl>

            {/* <SimpleGrid columns={[1, 2, 2, 2]} spacing={4} width="100%">
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.chineseOrganizationName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "chinese_organization_name_placeholder"
                    )}
                    {...register("chineseOrganizationName", {
                      required: true,
                    })}
                  />
                  <FormHelperText>
                    {errors?.chineseOrganizationName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "chinese_organization_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.englishOrganizationName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "english_organization_name_placeholder"
                    )}
                    {...register("englishOrganizationName", {
                      required: true,
                    })}
                  />
                  <FormHelperText>
                    {errors?.englishOrganizationName?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "english_organization_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.ngoWebsite}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "ngo_website_placeholder"
                    )}
                    {...register("ngoWebsite")}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
              </GridItem>
            </SimpleGrid> */}

            {/* <FormControl marginTop="20px !important">
              <FormLabel>{page?.content?.form?.ngoDescription}</FormLabel>
              <Textarea
                placeholder={wordExtractor(
                  page?.content?.wordings,
                  "ngo_description_placeholder"
                )}
                {...register("ngoDescription")}
              ></Textarea>
              <FormHelperText></FormHelperText>
            </FormControl> */}

            {/* <FormControl marginTop="20px !important">
              <Checkbox
                colorScheme="green"
                {...register("terms", {
                  required: true,
                })}
              >
                {page?.content?.form?.terms?.text}
                <a target="_blank" href={page?.content?.form?.terms?.url}>
                  {page?.content?.form?.terms?.link}
                </a>
              </Checkbox>
              <FormHelperText>
                {errors?.terms?.type === "required" && (
                  <Text color="red">
                    {wordExtractor(
                      page?.content?.wordings,
                      "tnc_required"
                    )}
                  </Text>
                )}
              </FormHelperText>
            </FormControl> */}

            <FormControl textAlign="center">
              <Button
                backgroundColor="#F6D644"
                borderRadius="22px"
                height="44px"
                width="117.93px"
                type="submit"
                isLoading={isSubmitting}
              >
                {page?.content?.form?.continue}
              </Button>
            </FormControl>
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(OrganizationNgoAdd, {
  key: PAGE_KEY,
  fields: [
    {
      name: "step",
      label: "標題 step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "主標題 Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "副標題 Sub title",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "chineseOrganizationName",
          label: "中文機構名稱標籤 Chinese Organization Name Label",
          component: "text",
        },
        {
          name: "englishOrganizationName",
          label: "英文組織名稱標籤 English Organization Name Label",
          component: "text",
        },
        {
          name: "centre",
          label: "所屬中心（如有） Chinese Company Label",
          component: "text",
        },
        {
          name: "description",
          label: "公司描述標籤 NGO/ Organization/ School Description Label",
          component: "text",
        },
        {
          name: "missionNVision",
          label: "公司描述標籤 NGO/ Organization/ School Description Label",
          component: "text",
        },
        {
          name: "organizationType",
          label: "機構種類 Organization Type ",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
              component: "group-list",
              itemProps: ({ id: key, caption: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "targetGroup",
          label: "目標群組 Target Group",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
              component: "group-list",
              itemProps: ({ id: key, caption: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "targetGroupDisabilities",
          label: "目標殘疾群組 Target Group Disabilities",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
              component: "group-list",
              itemProps: ({ id: key, caption: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "targetGroupDisabilitiesOther",
          label: "其他，請說明 Disabilities Other Label",
          component: "text",
        },
        {
          name: "contactName",
          label: "聯絡人 Contact Name Label",
          component: "text",
        },
        {
          name: "contactPhone",
          label: "聯絡電話 Contact Phone Label",
          component: "text",
        },
        {
          name: "contactEmail",
          label: "聯絡電郵 Contact Email Label",
          component: "text",
        },
        {
          name: "postalAddress",
          label: "地址 Postal Address Label",
          component: "text",
        },
        {
          name: "website",
          label: "組織網站/ 項目網頁 website Label",
          component: "text",
        },
        {
          name: "tncAccept",
          label: "我同意條款及細則 T&C Label",
          component: "group",
          fields: [
            {
              name: "text",
              label: "文本 text",
              component: "text",
            },
            {
              name: "link",
              label: "關聯 Link",
              component: "text",
            },
            {
              name: "url",
              label: "關聯 Url",
              component: "text",
              placeholder: "https://",
            },
          ],
        },
        // {
        //   name: "ngoWebsite",
        //   label: "公司網站 NGO/ Organisation/ School  Website Label",
        //   component: "text",
        // },
        // {
        //   name: "ngoDescription",
        //   label: "公司描述標籤 NGO/ Organization/ School Description Label",
        //   component: "text",
        // },

        {
          name: "continue",
          label: "繼續標籤 Button text",
          component: "text",
        },
      ],
    },
  ],
});

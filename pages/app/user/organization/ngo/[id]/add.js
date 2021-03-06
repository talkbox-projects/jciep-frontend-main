import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  GridItem,
  FormHelperText,
  FormLabel,
  Textarea,
  Grid,
  Checkbox,
  IconButton,
  Image,
  Link,
} from "@chakra-ui/react";
import { RiAddFill, RiCloseCircleFill } from "react-icons/ri";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import ReactSelect from "react-select";
import { getPage } from "../../../../../../utils/page/getPage";
import withPageCMS from "../../../../../../utils/page/withPageCMS";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../../../utils/apollo";
import getSharedServerSideProps from "../../../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../../../utils/wordExtractor";
import { emailRegex } from "../../../../../../utils/general";

const PAGE_KEY = "organization_ngo_add";

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0px",
    border: "none",
    borderBottom: "1px solid #EFEFEF",
  }),
};

const labelStyles = {
  marginBottom: "0px",
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
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const { id } = router.query;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const getDescriptionCount = watch("description", 0);
  const getMissionNVision = watch("missionNVision", 0);
  const watchFields = watch(["targetGroupDisabilities"]);

  const validate = () => {
    if (files.length < 1) {
      setFileError(true);
      return true;
    } else {
      setFileError(false);
      return false;
    }
  };

  const onFileUpload = async (e) => {
    let uploadedFiles = await e.target.files[0];
    let previousFiles = files;
    let newFiles = previousFiles.concat(uploadedFiles);
    setFileError("");
    setFiles(newFiles);
  };

  const onRemoveImage = async (index) => {
    let previousFiles = files;

    let newFiles = previousFiles.filter((file, i) => i !== index);
    setFiles(newFiles);
  };

  const onFormSubmit = async ({
    chineseOrganizationName,
    englishOrganizationName,
    website,
    description,
    centre,
    missionNVision,
    organizationType,
    targetGroup,
    targetGroupDisabilities,
    targetGroupDisabilitiesOther,
    contactName,
    contactPhone,
    contactEmail,
    postalAddress,
    tncAccept,
  }) => {
    try {
      if (validate()) {
        return;
      }

      const FileUploadmutation = gql`
        mutation FileUpload($file: FileUpload!) {
          FileUpload(files: $file) {
            id
            url
            contentType
            fileSize
          }
        }
      `;

      let filesUploadData = await getGraphQLClient().request(
        FileUploadmutation,
        {
          file: files,
        }
      );

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
          organizationType: organizationType.value,
          chineseCompanyName: chineseOrganizationName,
          englishCompanyName: englishOrganizationName,
          centre: centre,
          website: website,
          description: description,
          missionNVision: missionNVision,
          targetGroup: targetGroup?.value,
          targetGroupDisabilities: targetGroupDisabilities?.value,
          targetGroupDisabilitiesOther:
            targetGroupDisabilities?.value === "other"
              ? targetGroupDisabilitiesOther
              : "",
          contactName: contactName,
          contactPhone: contactPhone,
          contactEmail: contactEmail,
          postalAddress: postalAddress,
          tncAccept: tncAccept,
          identityId: id,
          businessRegistration: filesUploadData?.FileUpload,
        },
      });

      if (data && data.OrganizationSubmissionCreate) {
        router.push(
          `/app/user/organization/ngo/${data.OrganizationSubmissionCreate.id}/pending`
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box pt={{ base: "64px" }}>
      <NAV
        title={page?.content?.step?.title}
        subTitle={page?.content?.step?.subTitle}
        handleClickLeftIcon={() => router.push("/app/user/identity/public/add")}
      />
      <Box justifyContent="center" width="100%">
        <Box maxWidth={"md"} width="100%" textAlign="left" margin="auto">
          <Text
            fontSize="20px"
            letterSpacing="1.5px"
            fontWeight={600}
            px={"15px"}
            mt={0}
            mb={2}
          >
            {page?.content?.step?.title}
          </Text>
          <VStack
            pb={{ base: 12 }}
            as="form"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <Grid
              templateColumns={"repeat(2, 1fr)"}
              width="100%"
              gap={6}
              px="15px"
            >
              <GridItem colSpan={{ base: 2 }}>
                <LABEL
                  name={page?.content?.form?.businessRegistration?.label}
                  required={true}
                />
                <FormControl>
                  <Box width="100%">
                    <Box
                      mt={2}
                      w={["100%"]}
                      h={["120px", "210px", "180px"]}
                      display="inline-block"
                      border={"#EFEFEF 1px solid"}
                      marginRight="10px"
                      marginBottom="10px"
                      borderRadius="15px"
                    >
                      <FormLabel height="100%" width="100%" cursor="pointer">
                        <Input
                          type="file"
                          multiple={true}
                          display="none"
                          onChange={onFileUpload}
                          onClick={(event) =>
                            (event.currentTarget.value = null)
                          }
                        />
                        <Text
                          height="100%"
                          display="flex"
                          justifyContent="center"
                          flexDirection="column"
                        >
                          <Text
                            as="span"
                            textAlign="center"
                            fontSize="30px"
                            display="block"
                          >
                            <IconButton
                              zIndex="-1"
                              fontSize="2xl"
                              icon={<RiAddFill />}
                              variant="link"
                            />
                          </Text>
                          <Text
                            as="span"
                            textAlign="center"
                            display="block"
                            fontWeight={400}
                            fontSize={"12px"}
                            color="gray.500"
                          >
                            {wordExtractor(
                              page?.content?.wordings,
                              "business_registration_content"
                            )}
                          </Text>
                        </Text>
                      </FormLabel>
                    </Box>

                    {files?.map((file, index) => {
                      let url = URL.createObjectURL(file);
                      return (
                        <Box
                          key={url + index}
                          w={["100%"]}
                          h={["250px", "210px", "180px"]}
                          display="inline-block"
                          verticalAlign="top"
                          marginRight="10px"
                          marginBottom="10px"
                        >
                          <Text as="span" key={index} position="relative">
                            <Image
                              alt=""
                              height="100%"
                              display="inline-block"
                              border="1px solid lightgrey"
                              objectFit="cover"
                              src={url}
                            ></Image>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveImage(index);
                              }}
                              marginLeft="-40px"
                              marginTop="10px"
                              fontSize="25px"
                              position="absolute"
                              color="gray.300"
                              icon={<RiCloseCircleFill />}
                              variant="link"
                            />
                          </Text>
                        </Box>
                      );
                    })}
                  </Box>
                  {fileError ? (
                    <FormHelperText color="red">
                      {wordExtractor(
                        page?.content?.wordings,
                        "business_registration_required"
                      )}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.chineseOrganizationName}
                    required={true}
                  />
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "chinese_organization_name_placeholder"
                    )}
                    {...register("chineseOrganizationName", { required: true })}
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

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.englishOrganizationName}
                    required={true}
                  />
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "english_organization_name_placeholder"
                    )}
                    {...register("englishOrganizationName", { required: true })}
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

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL name={page?.content?.form?.centre} />
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "centre_placeholder"
                    )}
                    {...register("centre")}
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.description}
                    required={true}
                  />
                  <Textarea
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "description_placeholder"
                    )}
                    {...register("description", { required: true })}
                    maxLength={200}
                  />
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
                <Text fontSize="12px" color="#666666">
                  {wordExtractor(
                    page?.content?.wordings,
                    "word_suggestions"
                  ).replace("$", getDescriptionCount.length || 0)}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 2 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.missionNVision}
                    required={true}
                  />
                  <Textarea
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "mission_and_vision_placeholder"
                    )}
                    variant="flushed"
                    {...register("missionNVision", { required: true })}
                    maxLength={200}
                  />
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
                <Text fontSize="12px" color="#666666">
                  {wordExtractor(
                    page?.content?.wordings,
                    "word_suggestions"
                  ).replace("$", getMissionNVision.length || 0)}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.organizationType?.label}
                    required={true}
                  />

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
                        components={{
                          IndicatorSeparator: () => null,
                        }}
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
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.targetGroup?.label}
                    required={true}
                  />

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
                        components={{
                          IndicatorSeparator: () => null,
                        }}
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
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.targetGroupDisabilities?.label}
                  />

                  <Controller
                    name="targetGroupDisabilities"
                    isClearable
                    control={control}
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
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    )}
                  />
                </FormControl>

                {watchFields[0]?.value === "other" && (
                  <Box pt={2}>
                    <FormControl>
                      <LABEL
                        name={page?.content?.form?.targetGroupDisabilitiesOther}
                      />
                      <Input
                        type="text"
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "target_group_disabilities_other_placeholder"
                        )}
                        {...register("targetGroupDisabilitiesOther")}
                      />
                    </FormControl>
                  </Box>
                )}
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.contactName}
                    required={true}
                  />
                  <Input
                    type="text"
                    variant="flushed"
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
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.contactPhone}
                    required={true}
                  />
                  <Input
                    type="text"
                    variant="flushed"
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
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.contactEmail}
                    required={true}
                  />
                  <Input
                    type="text"
                    variant="flushed"
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
                    {errors?.contactEmail?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "contact_email_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL
                    name={page?.content?.form?.postalAddress}
                    required={true}
                  />
                  <Input
                    type="text"
                    variant="flushed"
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

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL name={page?.content?.form?.website} required={true} />
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "website_placeholder"
                    )}
                    {...register("website", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.website?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "website_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>

            <FormControl marginTop="20px !important" px="15px">
              <Checkbox
                aria-describedby={wordExtractor(
                  page?.content?.wordings,
                  "tnc_accept_required"
                )}
                colorScheme="green"
                {...register("tncAccept", { required: true })}
              >
                {page?.content?.form?.tncAccept?.text}{" "}
                <Link
                  target="_blank"
                  href={page?.content?.form?.tncAccept?.url}
                >
                  {" "}
                  {page?.content?.form?.tncAccept?.link}{" "}
                </Link>
              </Checkbox>
              <FormHelperText>
                {errors?.tncAccept?.type === "required" && (
                  <Text color="red">
                    {wordExtractor(
                      page?.content?.wordings,
                      "tnc_accept_required"
                    )}
                  </Text>
                )}
              </FormHelperText>
            </FormControl>

            <Box
              style={{
                background:
                  "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
                marginTop: "60px",
              }}
              h={"16px"}
              w={"100%"}
              opacity={0.2}
            />
            <Box px={"15px"} py={"12px"} w="100%">
              <FormControl textAlign="center">
                <Button
                  backgroundColor="#F6D644"
                  borderRadius="22px"
                  height="44px"
                  width="100%"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {page?.content?.form?.continue}
                </Button>
              </FormControl>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

const NAV = ({ title, subTitle, handleClickLeftIcon }) => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      width="100%"
      px={"20px"}
      alignItems="center"
      h={"48px"}
      borderBottom="1px solid #EFEFEF"
      mb={"40px"}
    >
      <GridItem>
        <Image
          src={"/images/app/back.svg"}
          alt={""}
          onClick={() => handleClickLeftIcon()}
        />
      </GridItem>
      <GridItem textAlign="center">
        {title && <Text fontWeight={700}>{title}</Text>}
        {subTitle && (
          <Text color="gray.500" fontSize={"12px"}>
            {subTitle}
          </Text>
        )}
      </GridItem>
    </Grid>
  );
};

const LABEL = ({ name, required }) => {
  if (!name) {
    return "";
  }

  return (
    <FormLabel {...labelStyles}>
      {name}
      {required && (
        <Text as="span" color="red">
          {" "}
          *
        </Text>
      )}
    </FormLabel>
  );
};

export default withPageCMS(OrganizationNgoAdd, {
  key: PAGE_KEY,
  fields: [
    {
      name: "step",
      label: "?????? step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "????????? Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "????????? Sub title",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "?????? Form",
      component: "group",
      fields: [
        {
          name: "chineseOrganizationName",
          label: "???????????????????????? Chinese Organization Name Label",
          component: "text",
        },
        {
          name: "englishOrganizationName",
          label: "???????????????????????? English Organization Name Label",
          component: "text",
        },
        {
          name: "centre",
          label: "???????????????????????? Chinese Company Label",
          component: "text",
        },
        {
          name: "description",
          label: "?????????????????? NGO/ Organization/ School Description Label",
          component: "text",
        },
        {
          name: "missionNVision",
          label: "?????????????????? NGO/ Organization/ School Description Label",
          component: "text",
        },
        {
          name: "organizationType",
          label: "???????????? Organization Type ",
          component: "group",
          fields: [
            {
              name: "label",
              label: "?????? Label",
              component: "text",
            },
            {
              name: "options",
              label: "??????  Options",
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
                  label: "?????? Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "?????? Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "targetGroup",
          label: "???????????? Target Group",
          component: "group",
          fields: [
            {
              name: "label",
              label: "?????? Label",
              component: "text",
            },
            {
              name: "options",
              label: "??????  Options",
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
                  label: "?????? Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "?????? Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "targetGroupDisabilities",
          label: "?????????????????? Target Group Disabilities",
          component: "group",
          fields: [
            {
              name: "label",
              label: "?????? Label",
              component: "text",
            },
            {
              name: "options",
              label: "??????  Options",
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
                  label: "?????? Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "?????? Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "targetGroupDisabilitiesOther",
          label: "?????????????????? Disabilities Other Label",
          component: "text",
        },
        {
          name: "contactName",
          label: "????????? Contact Name Label",
          component: "text",
        },
        {
          name: "contactPhone",
          label: "???????????? Contact Phone Label",
          component: "text",
        },
        {
          name: "contactEmail",
          label: "???????????? Contact Email Label",
          component: "text",
        },
        {
          name: "postalAddress",
          label: "?????? Postal Address Label",
          component: "text",
        },
        {
          name: "website",
          label: "????????????/ ???????????? website Label",
          component: "text",
        },
        {
          name: "tncAccept",
          label: "???????????????????????? T&C Label",
          component: "group",
          fields: [
            {
              name: "text",
              label: "?????? text",
              component: "text",
            },
            {
              name: "link",
              label: "?????? Link",
              component: "text",
            },
            {
              name: "url",
              label: "?????? Url",
              component: "text",
              placeholder: "https://",
            },
          ],
        },
        {
          name: "businessRegistration",
          label: "???????????? Business Registration ",
          component: "group",
          fields: [
            {
              name: "label",
              label: "?????? Label",
              component: "text",
            },
            {
              name: "Text",
              label: "?????? Text",
              component: "text",
            },
          ],
        },
        {
          name: "continue",
          label: "???????????? Button text",
          component: "text",
        },
      ],
    },
  ],
});

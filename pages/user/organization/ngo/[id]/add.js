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
import React, { useState, useEffect } from "react";
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
import nookies from "nookies";

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
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const { id } = router.query;

  useEffect(()=>{
    if(router.isReady){
      nookies.set(null, "jciep-identityId", id, { path: "/" });
    }
  },[router, id])

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

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
              <GridItem colSpan={{ base: 2 }}>
                <FormLabel>
                {page?.content?.form?.businessRegistration?.label}
                </FormLabel>
                <FormControl marginTop="20px !important">
                  <Box width="100%">
                    <Box
                      w={["100%"]}
                      h={["250px", "210px", "180px"]}
                      display="inline-block"
                      border={'#EFEFEF 1px solid'}
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
                              fontSize="4xl"
                              icon={<RiAddFill />}
                              variant="link"
                            />
                          </Text>
                          <Text as="span" textAlign="center" display="block" fontWeight={400} fontSize={'12px'} color="gray.500">
                            {wordExtractor(
                              page?.content?.wordings,
                              "business_registration_content"
                            )}
                          </Text>
                        </Text>
                      </FormLabel>
                    </Box>

                    {files.map((file, index) => {
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
                              width="100%"
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
                  <LABEL name={page?.content?.form?.chineseOrganizationName} required={true}/>
                  <Input
                    type="text"
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
                  <LABEL name={page?.content?.form?.englishOrganizationName} required={true}/>
                  <Input
                    type="text"
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
                <FormControl>
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
                <FormControl>
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
                <FormControl>
                  <LABEL name={page?.content?.form?.organizationType?.label} required={true}/>

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
                <FormControl>
                  <LABEL name={page?.content?.form?.targetGroup?.label} required={true}/>

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
                <FormControl>
                  <LABEL name={page?.content?.form?.targetGroupDisabilities?.label} required={true}/>

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
                    <FormControl>
                      <FormLabel>
                        {page?.content?.form?.targetGroupDisabilitiesOther}
                      </FormLabel>

                      <LABEL name={page?.content?.form?.targetGroupDisabilitiesOther} required={true}/>
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
                <FormControl>
                  <LABEL name={page?.content?.form?.contactName} required={true}/>
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
                <FormControl>
                  <LABEL name={page?.content?.form?.contactPhone} required={true}/>
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
                <FormControl>
                  <LABEL name={page?.content?.form?.contactEmail} required={true}/>
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
                <FormControl>
                  <LABEL name={page?.content?.form?.postalAddress} required={true}/>
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

              <GridItem colSpan={{ base: 2, md: 1 }}>
                <FormControl>
                  <LABEL name={page?.content?.form?.website} required={true}/>
                  <Input
                    type="text"
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

const LABEL = ({ name, required }) => {
  if (!name) {
    return "";
  }

  return (
    <FormLabel>
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
        // {
        //   name: "ngoWebsite",
        //   label: "???????????? NGO/ Organisation/ School  Website Label",
        //   component: "text",
        // },
        // {
        //   name: "ngoDescription",
        //   label: "?????????????????? NGO/ Organization/ School Description Label",
        //   component: "text",
        // },

        {
          name: "continue",
          label: "???????????? Button text",
          component: "text",
        },
      ],
    },
  ],
});

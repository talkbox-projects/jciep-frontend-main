import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  Checkbox,
  FormHelperText,
  FormLabel,
  Textarea,
  IconButton,
  Image,
} from "@chakra-ui/react";
import {
  RiAddFill,
  RiCloseCircleFill,
  
} from "react-icons/ri";
import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import ReactSelect from "react-select";

import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import Link from "next/link";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../../utils/apollo";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../../utils/wordExtractor";

const PAGE_KEY = "organization_company_add";

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


const customStyles = {
  multiValue: (provided, state) => {
    const borderRadius = "15px"  
    return { ...provided, borderRadius };
  },
  multiValueRemove: (provided, state) => {
    const color = "grey"
    return {...provided, color}
  }
}

const OrganizationCompanyAdd = ({ page }) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const { id } = router.query;

  const {
    handleSubmit,
    setError,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const validate = () => {
    if (files.length < 1) {
      setFileError(true)
      return true;
    } else {
      setFileError(false)
      return false;
    }
  };

  const onFormSubmit = useCallback(
    async ({
      chineseCompanyName,
      englishCompanyName,
      industry,
      companyWebsite,
      companyDescription,
    }) => {
      try {

        if(validate()) {
          return 
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

        console.log(filesUploadData);

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
            organizationType: "employment",
            chineseCompanyName: chineseCompanyName,
            englishCompanyName: englishCompanyName,
            website: companyWebsite,
            industry: industry?.map(({ value }) => ({ value }.value)),
            identityId: id,
            description: companyDescription,
            businessRegistration: filesUploadData.FileUpload,
          },
        });

        if (data.OrganizationSubmissionCreate) {
          router.push(
            `/user/organization/company/${data.OrganizationSubmissionCreate.id}/pending`
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

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

  return (
    <VStack py={36}>
      <Text mt={10}>{page?.content?.step?.title}</Text>
      <Text fontSize="36px" letterSpacing="1.5px" fontWeight={600}>
        {page?.content?.step?.subTitle}
      </Text>
      <Box justifyContent="center" width="100%" marginTop="30px !important">
        <Box
          maxWidth={800}
          width="100%"
          textAlign="left"
          margin="auto"
          padding="25px"
        >
          <VStack as="form" onSubmit={handleSubmit(onFormSubmit)}>
            <SimpleGrid columns={[1, 2, 2, 2]} spacing={4} width="100%">
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.chineseCompanyName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "chinese_company_name_placeholder"
                    )}
                    {...register("chineseCompanyName", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.chineseCompanyName?.type === "required" && (
                      <Text color="red">
                        {/* 輸入有效的中國公司名稱 Enter valid chinese company name! */}
                        {wordExtractor(
                          page?.content?.wordings,
                          "chinese_company_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.englishCompanyName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "english_company_name_placeholder"
                    )}
                    {...register("englishCompanyName", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.englishCompanyName?.type === "required" && (
                      <Text color="red">
                        {/* 輸入有效的英文公司名稱 Enter valid english company name! */}
                        {wordExtractor(
                          page?.content?.wordings,
                          "english_company_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.industry?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>

                  <Controller
                    name="industry"
                    isClearable
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactSelect
                        styles={customStyles}
                        {...field}
                        isMulti
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "industry_placeholder"
                        )}
                        options={page?.content?.form?.industry?.options.map(
                          ({ label, value }) => ({ label, value })
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.industry?.type === "required" && (
                      <Text color="red">
                        {/* 請選擇行業 Please select industry! */}
                        {wordExtractor(
                          page?.content?.wordings,
                          "industry_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.companyWebsite}</FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "company_website_placeholder"
                    )}
                    {...register("companyWebsite")}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
              </GridItem>
            </SimpleGrid>

            <FormControl marginTop="20px !important">
              <Box width="100%">
                <Box
                  w={["100%", "47.5%", "23.5%"]}
                  h={["250px", "210px", "180px"]}
                  display="inline-block"
                  boxShadow="0px 1px 0px 0.5px #d3d3d3fc"
                 
                  marginRight="10px"
                  marginBottom="10px"
                >
                  <FormLabel
                    height="100%"
                    width="100%"
                    cursor="pointer"
                  >
                    <Input
                      type="file"
                      multiple={true}
                      display="none"
                      onChange={onFileUpload}
                    />
                    <Text height="100%" display="flex" justifyContent="center" flexDirection="column">
                      <Text as="span"
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
                      <Text as="span" 
                        textAlign="center" 
                        display="block" >
                        {page?.content?.form?.businessRegistration?.label}
                      </Text>
                    </Text>
                    
                  </FormLabel>
                </Box>
                
                  {files.map((file, index) => {
                    let url = URL.createObjectURL(file);
                    return (
                      <Box
                          w={["100%", "47.5%", "23.5%"]}
                          h={["250px", "210px", "180px"]}
                          display="inline-block"
                          verticalAlign="top"
                          marginRight="10px"
                          marginBottom="10px"
                        >
                      <Text as="span" key={index} position="relative">
                        <Image
                          height="100%"
                          display="inline-block"
                          border="1px solid lightgrey"
                          objectFit="cover"
                          src={url}
                        ></Image>
                       <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(index)
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
              {
                fileError ? 
                <FormHelperText color="red">
                  {wordExtractor(
                      page?.content?.wordings,
                      "business_registration_required"
                  )}
                </FormHelperText>
                : null
              }
            </FormControl>

            <FormControl marginTop="20px !important">
              <FormLabel>{page?.content?.form?.companyDescription}</FormLabel>
              <Textarea
                placeholder={wordExtractor(
                  page?.content?.wordings,
                  "company_description_placeholder"
                )}
                {...register("companyDescription")}
              ></Textarea>
              <FormHelperText>
                {errors?.companyDescription?.message}
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

export default withPageCMS(OrganizationCompanyAdd, {
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
          name: "chineseCompanyName",
          label: "中國公司標籤 Chinese Company Label",
          component: "text",
        },
        {
          name: "englishCompanyName",
          label: "英文公司標籤 English Company Label",
          component: "text",
        },

        {
          name: "industry",
          label: "行業 Industry ",
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
          name: "companyWebsite",
          label: "公司網站 Company Website Label",
          component: "text",
        },
        {
          name: "businessRegistration",
          label: "商業登記 Business Registration ",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "Text",
              label: "文本 Text",
              component: "text",
            },
          ],
        },
        {
          name: "companyDescription",
          label: "公司描述標籤 Company Description Label",
          component: "text",
        },

        {
          name: "continue",
          label: "繼續標籤 Continue Label",
          component: "text",
        },
      ],
    },
  ],
});

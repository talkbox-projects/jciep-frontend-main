import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  Select,
  Checkbox,
  FormHelperText,
  FormLabel,
  Textarea,
  Image
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import Link from "next/link";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../../utils/apollo";


const PAGE_KEY = "organization_company_add";



export const getServerSideProps = async (context) => {
  return {
    props: {
      page: (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {},
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
const OrganizationCompanyAdd = ({ page }) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const {id} = router.query;
  
  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm();


  const validate = (chineseCompanyName, englishCompanyName, industry, companyWebsite, companyDescription ) => {
    if(chineseCompanyName.trim() === '') {
      setError("chineseCompanyName", {
        type: "manual",
        message: "輸入有效的中國公司名稱 Enter valid chinese company name! ",
      });
      return true
    } else if (englishCompanyName.trim() === '') {
      setError("englishCompanyName", {
        type: "manual",
        message: "輸入有效的英文公司名稱 Enter valid english company name! ",
      });
      return true
    } else if (files.length < 1) {
      setError("businessRegistration", {
        type: "manual",
        message: "上傳一個文件 upload a file! ",
      });
      return true
    } 
    else if (industry.trim() === 'none') {
      setError("industry", {
        type: "manual",
        message: "選擇行業 Select a industry! ",
      });
      return true
    } 
    else {
      return false
    }
  }

  const onFormSubmit = useCallback(
    async ({ chineseCompanyName, englishCompanyName, industry, companyWebsite, companyDescription }) => {
      try {
        
        if(validate(chineseCompanyName, englishCompanyName, industry,  companyWebsite, companyDescription)) {
          return true
        }


        const mutation = gql`
        mutation OrganizationSubmissionCreate($input: OrganizationSubmissionCreateInput!) {
          OrganizationSubmissionCreate(input: $input) {
            id
          }
        }
      `;
  
      let data =await getGraphQLClient().request(mutation, {
        input: {
          organizationType: 'ngo',
          chineseCompanyName: chineseCompanyName,
          englishCompanyName: englishCompanyName,
          website: companyWebsite,
          industry: industry,
          identityId: id,
          description: companyDescription,
          businessRegistration: files
        },
      });    
  
      if (data.OrganizationSubmissionCreate) {
        router.push(`/user/organization/company/${data.OrganizationSubmissionCreate.id}/pending`);
      }

      } catch (e) {
        console.log(e);
      }
    }
  );

  const onFileUpload = async (e) => {
    let uploadedFiles = await  e.target.files[0];
    let previousFiles = files;
    let newFiles = previousFiles.concat(uploadedFiles)
    setFiles(newFiles)
  }

  const onRemoveImage = async (index) => {
    let previousFiles = files;
    let newFiles = previousFiles.filter((file, i) => i !== index)
    setFiles(newFiles)
  }

  return (
    <VStack py={36}>
      <Text mt={10}>{page?.content?.step?.title}</Text>
      <Text fontSize="30px" marginTop="5px">
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
                    {page?.content?.form?.chineseCompanyName}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("chineseCompanyName")}
                  />
                  <FormHelperText>
                    {errors?.chineseCompanyName?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.englishCompanyName}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("englishCompanyName")}
                  />
                  <FormHelperText>
                    {errors?.englishCompanyName?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.industry?.label}</FormLabel>
                  <Select {...register("industry")}>
                    {page?.content?.form?.industry?.options?.map((option) => {
                      return (
                        <option key={option.id} value={option.value}>{option.label}</option>
                      );
                    })}
                  </Select>
                  <FormHelperText>{errors?.industry?.message}</FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.companyWebsite}</FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("companyWebsite")}
                  />
                  <FormHelperText>
                    {errors?.companyWebsite?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </SimpleGrid>

            <FormControl marginTop="20px !important">
                <Box width="100%">
                  <Box 
                    w={["150px", "150px", "20%"]} 
                    display="inline-block"
                    border= "1px solid lightgrey"
                    borderRadius="5px"
                    height="140px"
                    width="140px"
                    >
                    <FormLabel 
                      height="100%"
                      padding="18% 28%"
                      width="100%"
                      >
                      <Input type="file" multiple={true} display="none" onChange={onFileUpload}/>
                      <span style={{textAlign: "center", fontSize: "30px", display: "block"}}>+</span>
                      <span style={{textAlign: "center", display: "block"}}>{page?.content?.form?.businessRegistration?.label}</span>
                    </FormLabel>
                  </Box>
                  <Box 
                    w={["100%", "100%", "80%"]} 
                    display="inline-block"
                    verticalAlign="top">
                      {

                        files.map((file, index) => {
                          let url = URL.createObjectURL(file)
                          return (
                              <span key={index}>
                                <Image
                                height="140px"
                                width="140px" 
                                display="inline-block"
                                border= "1px solid lightgrey"
                                src={url}></Image>
                                <span 
                                  style={{
                                    position: "absolute",
                                    marginLeft: "-27px",
                                    background: "lightgrey",
                                    width: "24px",
                                    borderRadius: "50%",
                                    marginTop: "4px",
                                    textAlign: "center",
                                    height: "27px"
                                
                                  }}
                                  onClick={() => onRemoveImage(index)}
                                  >x</span>
                              </span>
                                
                            )    
                        })
                      }
                  </Box>
                </Box>
                <FormHelperText>{errors?.businessRegistration?.message}</FormHelperText>
            </FormControl>

            <FormControl marginTop="20px !important">
              <FormLabel>{page?.content?.form?.companyDescription}</FormLabel>
              <Textarea
                placeholder=""
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
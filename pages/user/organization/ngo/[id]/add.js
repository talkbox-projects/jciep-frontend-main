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
  Checkbox,
  Link
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../../utils/apollo";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../../utils/wordExtractor";

const PAGE_KEY = "organization_ngo_add";

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
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onFormSubmit = useCallback(
    async ({
      chineseOrganizationName,
      englishOrganizationName,
      ngoWebsite,
      ngoDescription,
      terms,
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
            tncAccept: terms,
            identityId: id,
          },
        });

        if (data && data.OrganizationSubmissionCreate) {
          router.push(
            `/user/organization/ngo/${data.OrganizationSubmissionCreate.id}/pending`
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

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
                        {/* 輸入有效的中文組織名稱 Enter valid chinese organization
                        name! */}
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
                        {/* 輸入有效的英文組織名稱 Enter valid english organization
                        name! */}

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
            </SimpleGrid>

            <FormControl marginTop="20px !important">
              <FormLabel>{page?.content?.form?.ngoDescription}</FormLabel>
              <Textarea
                placeholder={wordExtractor(
                  page?.content?.wordings,
                  "ngo_description_placeholder"
                )}
                {...register("ngoDescription")}
              ></Textarea>
              <FormHelperText></FormHelperText>
            </FormControl>

            <FormControl marginTop="20px !important">
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
                    {/* 請接受條款和條件 Please accept T&C! */}
                    {wordExtractor(
                      page?.content?.wordings,
                      "tnc_required"
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
          name: "ngoWebsite",
          label: "公司網站 NGO/ Organisation/ School  Website Label",
          component: "text",
        },
        {
          name: "ngoDescription",
          label: "公司描述標籤 NGO/ Organization/ School Description Label",
          component: "text",
        },
        {
          name: "terms",
          label: "條款和條件 T&C Label",
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
              placeholder:"https://"
            },
          ],
        },
        {
          name: "continue",
          label: "繼續標籤 Button text",
          component: "text",
        },
      ],
    },
  ],
});

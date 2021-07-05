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
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Link from "next/link";
import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../../utils/apollo";

const PAGE_KEY = "organization_ngo_add";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
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

const OrganizationNgoAdd = ({ page }) => {
  const router = useRouter();
  const { id } = router.query;

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const validate = (
    chineseOrganizationName,
    englishOrganizationName,
    contactNumberngoWebsite,
    ngoDescription,
    terms
  ) => {
    if (chineseOrganizationName.trim() === "") {
      setError("chineseOrganizationName", {
        type: "manual",
        message:
          "輸入有效的中文組織名稱 Enter valid chinese organization name! ",
      });
      return true;
    } else if (englishOrganizationName.trim() === "") {
      setError("englishOrganizationName", {
        type: "manual",
        message:
          "輸入有效的英文組織名稱 Enter valid english organization name! ",
      });
      return true;
    } else if (terms === false) {
      setError("terms", {
        type: "manual",
        message: "請接受條款和條件 Please accept T&C! ",
      });
      return true;
    } else {
      return false;
    }
  };

  const onFormSubmit = useCallback(
    async ({
      chineseOrganizationName,
      englishOrganizationName,
      ngoWebsite,
      ngoDescription,
      terms,
    }) => {
      try {
        if (
          validate(
            chineseOrganizationName,
            englishOrganizationName,
            ngoWebsite,
            ngoDescription,
            terms
          )
        ) {
          return true;
        }

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
                    {page?.content?.form?.chineseOrganizationName}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("chineseOrganizationName")}
                  />
                  <FormHelperText>
                    {errors?.chineseOrganizationName?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.englishOrganizationName}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("englishOrganizationName")}
                  />
                  <FormHelperText>
                    {errors?.englishOrganizationName?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.ngoWebsite}</FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("ngoWebsite")}
                  />
                  <FormHelperText>{errors?.ngoWebsite?.message}</FormHelperText>
                </FormControl>
              </GridItem>
            </SimpleGrid>

            <FormControl marginTop="20px !important">
              <FormLabel>{page?.content?.form?.ngoDescription}</FormLabel>
              <Textarea
                placeholder=""
                {...register("ngoDescription")}
              ></Textarea>
              <FormHelperText>{errors?.ngoDescription?.message}</FormHelperText>
            </FormControl>

            <FormControl marginTop="20px !important">
              <Checkbox colorScheme="green" {...register("terms")}>
                {page?.content?.form?.terms}
              </Checkbox>
              <FormHelperText>{errors?.terms?.message}</FormHelperText>
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
          component: "text",
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

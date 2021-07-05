import { Button, Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";

const PAGE_KEY = "identity_public_add_success";

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
const IdentityPublicAddSuccess = ({ page }) => {
  return (
    <VStack py={36}>
      <Text>{page?.content?.step?.title}</Text>
      <Box justifyContent="center" width="100%" marginTop="10px !important">
        <Box
          maxWidth={600}
          width="100%"
          textAlign="left"
          margin="auto"
          padding="25px"
        >
          <Heading as="h4" textAlign="center">
            {page?.content?.heading?.title}
          </Heading>

          <Image
            height="150px"
            width="150px"
            marginTop="30px !important"
            margin="auto"
            src={page?.content?.publicSuccess?.image}
          />

          <Text marginTop="30px">
            {page?.content?.publicSuccess?.description}
          </Text>

          <Box width="100%" textAlign="center">
            <Link href="/">
              <Button
                color="#1E1E1E"
                boxSizing="border-box"
                height="46px"
                width="114px"
                border="2px solid #C6C6C6"
                borderRadius="22px"
                marginTop="30px !important"
                borderRadius="50px"
                bgColor="primary.400"
              >
                {page?.content?.publicSuccess?.button}
              </Button>
            </Link>
          </Box>

          <Text
            marginTop="35px"
            fontWeight={600}
            textAlign="center"
            fontSize="16px"
          >
            {page?.content?.footer?.email}
          </Text>
          <Text marginTop="30px" textAlign="center">
            {page?.content?.footer?.drop}
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(IdentityPublicAddSuccess, {
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
      ],
    },
    {
      name: "heading",
      label: "標題 Heading",
      component: "group",
      fields: [
        {
          name: "title",
          label: "主標題 Title",
          component: "text",
        },
      ],
    },
    {
      name: "publicSuccess",
      label: "上市 成功 Public Success",
      component: "group",
      fields: [
        {
          label: "身份 Image",
          name: "image",
          component: "image",
          uploadDir: () => "/identity",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "description",
          label: "描述 description",
          component: "text",
        },
        {
          name: "button",
          label: "文本 button text",
          component: "text",
        },
      ],
    },
    {
      name: "footer",
      label: "頁腳 Footer",
      component: "group",
      fields: [
        {
          name: "email",
          label: "電子郵件 Email",
          component: "text",
        },
        {
          name: "drop",
          label: "降低 Drop",
          component: "text",
        },
      ],
    },
  ],
});

import { Button, Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "identity_pwd_add_success";

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
const IdentityPwdAddSuccess = ({ page }) => {
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
            src={page?.content?.pwdSuccess?.image}
          />

          <Text marginTop="30px">{page?.content?.pwdSuccess?.description}</Text>

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
                {page?.content?.pwdSuccess?.button}
              </Button>
            </Link>
          </Box>

          {/* <Text
            marginTop="35px"
            fontWeight={600}
            textAlign="center"
            fontSize="16px"
          >
            {page?.content?.footer?.email}
          </Text> */}
          <Text marginTop="30px" textAlign="center">
            {page?.content?.footer?.drop}
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(IdentityPwdAddSuccess, {
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
      name: "pwdSuccess",
      label: "殘疾人士 成功 PWD Success",
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

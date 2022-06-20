import { Button, Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";
import { useCredential } from "../../../../../utils/user";
import { useRouter } from "next/router";
import React from "react";

const PAGE_KEY = "identity_public_add_success";

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
const IdentityPublicAddSuccess = ({ page }) => {
  const router = useRouter();
  const [, removeCredential] = useCredential();

  const logout = () => {
    removeCredential();
    router.push("/");
  };

  return (
    <VStack py={{ base: 36, md: 48 }}>
      <Box justifyContent="center" width="100%">
        <Box
          maxWidth={470}
          width="100%"
          textAlign="center"
          margin="auto"
          padding="0px 25px"
          mt={10}
        >
          <Heading
            textAlign="center"
            fontSize="36px"
            letterSpacing="1.5px"
            fontWeight={600}
          >
            {page?.content?.heading?.title}
          </Heading>

          <Image
            alt=""
            height="150px"
            width="150px"
            marginTop="50px !important"
            margin="auto"
            src={page?.content?.publicSuccess?.image}
          />

          <Text marginTop="30px" fontWeight={700} dangerouslySetInnerHTML={{__html: page?.content?.publicSuccess?.content}}/>

          <Box width="100%" textAlign="center" marginBottom="120px">
            <Link href="/">
              <Button
                color="#1E1E1E"
                boxSizing="border-box"
                height="46px"
                width="114px"
                border="2px solid #C6C6C6"
                marginTop="30px !important"
                borderRadius="50px"
                bgColor="primary.400"
              >
                {page?.content?.publicSuccess?.button}
              </Button>
            </Link>
          </Box>
          <br />
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
      label: "成功 Public Success",
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
          name: "content",
          label: "內容 content",
          component: "textarea",
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
          name: "drop",
          label: "降低 Drop",
          component: "group",
          fields: [
            {
              name: "text",
              label: "文本 Text",
              component: "text",
            },
            {
              name: "button",
              label: "按鈕文字 Button text",
              component: "text",
            },
          ],
        },
      ],
    },
  ],
});

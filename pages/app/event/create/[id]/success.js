import {
  Button,
  Box,
  Image,
  Heading,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import Link from "next/link";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import wordExtractor from "../../../../../utils/wordExtractor";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";
import React from "react";
import { useRouter } from "next/router";

const PAGE_KEY = "event_add_success";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isApp: true,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};
const EventAddSuccess = ({ page }) => {

  const handleCloseWebView = () => {
    window.WebContext = {};
    window.WebContext.closeWebViewHandler = () => {
      console.log("close web view");
    };

    let json = {
      name: "closeWebView",
      options: {
        callback: "closeWebViewHandler",
        params: {},
      },
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

  const router = useRouter();
  return (
    <VStack py={36}>
      <Box justifyContent="center" width="100%">
        <Box
          maxWidth={470}
          width="100%"
          textAlign="center"
          margin="auto"
          padding="0 25px"
        >
          <Heading textAlign="center">{page?.content?.heading?.title}</Heading>
          <Image
            alt=""
            height="150px"
            width="150px"
            marginTop="50px !important"
            margin="auto"
            src={page?.content?.eventSuccess?.image}
          />
          <Text fontWeight={700} fontSize="20px" pt={4}>
            {page?.content?.step?.title}
          </Text>
          {wordExtractor(page?.content?.wordings, "reference_label")}:{" "}
          {router?.query?.id}
          <Divider my={2} />
          <Text>{page?.content?.eventSuccess?.description}</Text>
          <Box width="100%" textAlign="center" marginBottom="120px">
            <Button
              color="#1E1E1E"
              boxSizing="border-box"
              height="46px"
              width="114px"
              border="2px solid #C6C6C6"
              marginTop="30px !important"
              borderRadius="50px"
              bgColor="primary.400"
              onClick={() => handleCloseWebView()}
            >
              {page?.content?.eventSuccess?.button}
            </Button>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(EventAddSuccess, {
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
      name: "eventSuccess",
      label: "新增活動 Add event Success",
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

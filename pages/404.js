import React, { useRef } from "react";
import {
  Stack,
  Box,
  Text,
  VStack,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/layout";
import withPageCMS from "../utils/page/withPageCMS";
import { getPage } from "../utils/page/getPage";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import {
  Icon,
  SimpleGrid,
  Grid,
  chakra,
  GridItem,
  Heading,
  Image,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Link,
  TabPanel,
  AspectRatio,
  IconButton,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import metaTextTemplates from "../utils/tina/metaTextTemplates";

const PAGE_KEY = "custom404";



const Home = ({ setting, page }) => {
  

  return (
    <VStack py={36}>
      <Text>{page?.content?.step?.title}</Text>
      <Box justifyContent="center" width="100%">
        <Box
          maxWidth={470}
          width="100%"
          textAlign="center"
          margin="auto"
          padding="0 25px"
        >
          <Heading as="h4" textAlign="center">
            {page?.content?.heading?.title}
          </Heading>

          <Image
            height="150px"
            width="150px"
            marginTop="50px !important"
            margin="auto"
            src={page?.content?.pwdSuccess?.image}
          />

          <Text marginTop="60px">{page?.content?.pwdSuccess?.description}</Text>

          <Box width="100%" textAlign="center" marginBottom="120px">
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

          <Text marginTop="10px" textAlign="center">
            <Text as="span">
              {page?.content?.footer?.drop?.text}
              <Text as="span" cursor="pointer">
                {page?.content?.footer?.drop?.button}
              </Text>
            </Text>
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(Home, {
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

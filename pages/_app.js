import { ChakraProvider, VStack } from "@chakra-ui/react";
import { withTina } from "tinacms";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import MongooseMediaStore from "../media/store";
import { MarkdownFieldPlugin } from "react-tinacms-editor";
import withConfigurationCMS from "../utils/configuration/withConfigurationCMS";

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS={true}>
      <NextSeo title="賽馬會共融． 知行計劃" />
      <VStack w="100vw" align="stretch" spacing={0}>
        <Header {...pageProps}></Header>
        <Navigation {...pageProps}></Navigation>
        <Component {...pageProps} />
        <Footer {...pageProps}></Footer>
      </VStack>
    </ChakraProvider>
  );
};

export default withTina(
  withConfigurationCMS(App, {
    key: "setting",
    label: "設定 Setting",
    fields: [
      {
        name: "categories",
        component: "group-list",
        label: "分類 Categories",
        itemProps: ({ id: key, label }) => ({
          key,
          label: label?.zh || label?.en ? `${label?.zh} ${label?.en}` : "",
        }),
        defaultItem: () => ({
          id: Math.random().toString(36).substr(2, 9),
        }),
        fields: [
          {
            name: "key",
            component: "text",
            label: "關鍵碼 Post Category Key",
          },
          {
            name: "label",
            component: "group",
            label: "分類名稱 Category Label",
            fields: [
              {
                name: "en",
                component: "text",
                label: "英文 English",
              },
              {
                name: "zh",
                component: "text",
                label: "繁體中文 Traditional Chinese",
              },
            ],
          },
          {
            name: "color",
            component: "color",
            label: "顏色 Color",
          },
          {
            label: "圖示 Icon",
            name: "image",
            component: "image",
            uploadDir: () => "/sharing/categories",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
        ],
      },
    ],
  }),
  {
    media: new MongooseMediaStore(),
    plugins: [MarkdownFieldPlugin],
    enabled: true,
    sidebar: true,
  }
);

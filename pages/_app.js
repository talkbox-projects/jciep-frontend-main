import { ChakraProvider, VStack } from "@chakra-ui/react";
import { withTina } from "tinacms";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import MongooseMediaStore from "../media/store";
import { MarkdownFieldPlugin } from "react-tinacms-editor";

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

export default withTina(App, {
  media: new MongooseMediaStore(),
  plugins: [MarkdownFieldPlugin],
  enabled: true,
  sidebar: true,
});

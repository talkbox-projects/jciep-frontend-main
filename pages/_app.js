import { ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import { withTina } from "tinacms";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import MongooseMediaStore from "../media/store";
import { MarkdownFieldPlugin } from "react-tinacms-editor";
import { AppProvider } from "../store/AppStore";

// import "../global.css";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#fffadd",
      100: "#fcefb2",
      200: "#f9e484",
      300: "#f7da55",
      400: "#f4cf27",
      500: "#dbb511",
      600: "#aa8d08",
      700: "#7a6503",
      800: "#493c00",
      900: "#1a1400",
    },
    facebook: {
      50: "#e7f0ff",
      100: "#c4d3ef",
      200: "#a0b5e0",
      300: "#7c98d0",
      400: "#587ac1",
      500: "#3e61a7",
      600: "#2f4b83",
      700: "#20365f",
      800: "#11203c",
      900: "#020b1b",
    },
    google: {
      50: "#ffe8e4",
      100: "#f8c0bc",
      200: "#ee9992",
      300: "#e57167",
      400: "#dc493d",
      500: "#c23023",
      600: "#98241a",
      700: "#6d1812",
      800: "#440d09",
      900: "#1e0100",
    },
  },
});

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider {...pageProps}>
      <ChakraProvider theme={theme} resetCSS={true}>
        <NextSeo title="賽馬會共融． 知行計劃" />
        <VStack w="100vw" align="stretch" spacing={0}>
          <Header {...pageProps}></Header>
          <Component {...pageProps} />
          <Footer {...pageProps}></Footer>
        </VStack>
      </ChakraProvider>
    </AppProvider>
  );
};

export default withTina(App, {
  media: new MongooseMediaStore(),
  plugins: [MarkdownFieldPlugin],
  enabled: true,
  sidebar: true,
});

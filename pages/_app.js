import { Box, ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import { withTina } from "tinacms";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import MongooseMediaStore from "../utils/tina/media/store";
import { HtmlFieldPlugin } from "react-tinacms-editor";
import { AppProvider } from "../store/AppStore";
import Head from "next/head";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const theme = extendTheme({
  colors: {
    secondary: {
      50: "#E5FFFE",
      100: "#B8FFFD",
      200: "#8AFFFB",
      300: "#5CFFFA",
      400: "#2EFFF8",
      500: "#00FFF7",
      600: "#00CCC5",
      700: "#009994",
      800: "#006663",
      900: "#003331",
    },
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
  styles: {
    global: {
      img: {
        "user-select": "none",
      },
    },
  },
});

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider {...pageProps}>
      <Head>
        <script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
      </Head>
      <ChakraProvider theme={theme} resetCSS={true}>
        <NextSeo title="賽馬會共融．知行計劃" />
        <VStack w="100vw" align="stretch" spacing={0}>
          <Header {...pageProps}></Header>
          <Box mt={[-16, -16, -12, -12]}>
            <Component {...pageProps} />
          </Box>
          <Footer {...pageProps}></Footer>
        </VStack>
      </ChakraProvider>
    </AppProvider>
  );
};

export default withTina(App, {
  media: new MongooseMediaStore(),
  plugins: [HtmlFieldPlugin],
  enabled: process.env.NODE_ENV === "development",
  sidebar: true,
});

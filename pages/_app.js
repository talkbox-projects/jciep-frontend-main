import React, { useEffect, useState } from "react";
import { Box, ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import { withTina } from "tinacms";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";
import MongooseMediaStore from "../utils/tina/media/store";
import { HtmlFieldPlugin } from "react-tinacms-editor";
import { AppProvider } from "../store/AppStore";
import Head from "next/head";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SimpleReactLightbox from "simple-react-lightbox";
import { init } from "../utils/ga";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Avatar = {
  parts: ["container"],
  baseStyle: {
    container: {
      bg: "#6d7682",
    },
  },
};

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors: {
    red: {
      500: "#D73A3A", // contrast level AA
    },
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
  components: {
    Avatar,
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
  const router = useRouter()
  const [showHeader, setShowHeader] = useState(true)
    useEffect(() => {
      const gaCode = "G-PXJQB5QF90";
      init(publicRuntimeConfig.GA4_CODE || gaCode);
    }, []);

    useEffect(() => {
      if(router.isReady){
        const regex = /app/gi;
        if(router?.route.match(regex)){
          setShowHeader(false)
        }
      }
    }, [router]);


  return (
    <SimpleReactLightbox>
      <AppProvider {...pageProps}>
        <Head>
          <script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/favicon/apple-icon-57x57.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/favicon/apple-icon-60x60.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/favicon/apple-icon-72x72.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/favicon/apple-icon-76x76.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/favicon/apple-icon-114x114.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/favicon/apple-icon-120x120.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/favicon/apple-icon-144x144.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/favicon/apple-icon-152x152.png"
          ></link>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-icon-180x180.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/favicon/android-icon-192x192.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicon/favicon-96x96.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          ></link>
          <link rel="manifest" href="/favicon/manifest.json"></link>
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta
            name="msapplication-TileImage"
            content="/favicon/ms-icon-144x144.png"
          />
          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        <ChakraProvider theme={theme} resetCSS={true}>
          {pageProps?.page?.content?.seo?.title ? (
            <NextSeo
              title={pageProps?.page?.content?.seo?.title}
              description={pageProps?.page?.content?.seo?.description}
            ></NextSeo>
          ) : (
            <NextSeo title="賽馬會共融．知行計劃" />
          )}
          <VStack align="stretch" spacing={0}>
            {showHeader && pageProps?.header ? (<Header {...pageProps}></Header>) : <Box d={'none'} className="appHeader"><Header {...pageProps}></Header></Box>}
            <Box mt={[-16, -16, -12, -12]}>
              <Component {...pageProps} />
            </Box>
            {showHeader && pageProps?.footer ? <Footer {...pageProps}></Footer> : <Box d={'none'} className="appHeader"><Footer {...pageProps}></Footer></Box>}
          </VStack>
        </ChakraProvider>
      </AppProvider>
    </SimpleReactLightbox>
  );
};

export default withTina(App, {
  media: new MongooseMediaStore(),
  plugins: [HtmlFieldPlugin],
  enabled: publicRuntimeConfig.NODE_ENV === "development",
  sidebar: true,
});

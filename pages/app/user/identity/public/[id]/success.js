import {
  Button,
  Box,
  Image,
  Text,
  Grid,
  GridItem,
  Code,
  Center,
  Flex,
} from "@chakra-ui/react";
import { getPage } from "../../../../../../utils/page/getPage";
import withPageCMS from "../../../../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../../../../utils/server/getSharedServerSideProps";
import { useCredential } from "../../../../../../utils/user";
import { useRouter } from "next/router";
import React from "react";
import nookies from "nookies";

const PAGE_KEY = "identity_public_add_success";

export const getServerSideProps = async (context) => {
  const cookies = nookies.get(context);
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  return {
    props: {
      page,
      isApp: true,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
      token: cookies["jciep-token"],
    },
  };
};

const IdentityPublicAddSuccess = ({ page, token }) => {
  const [, removeCredential] = useCredential();
  const router = useRouter();

  const {id} = router.query;

  const handleSendLoginSuccessResponse = () => {
    window.WebContext = {};
    window.WebContext.sendLoginSuccessResponseHandler = (response) => {
      console.log('response-',response)
    };

    const json = {
      name: "sendLoginSuccessResponse",
      options: {
        callback: "sendLoginSuccessResponseHandler",
        params: {
          token: token,
          identityId: id,
        },
      },
    };

    if (!window.AppContext) {
      alert("window.AppContext undefined");
    }

    if (!window.AppContext?.postMessage) {
      alert("window.AppContext.postMessage undefined");
    }

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

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

  return (
    <Box pt={{ base: "64px" }}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        width="100%"
        px={"20px"}
        alignItems="center"
        h={"48px"}
        backgroundColor="#F6D644"
      >
        <GridItem>
          {/* <Image src={'/images/app/close.svg'} alt={''}/> */}{" "}
        </GridItem>
        <GridItem textAlign="center">
          <Text fontWeight={700}>{page?.content?.heading?.title}</Text>
        </GridItem>
      </Grid>

      <Box>
        <Box justifyContent="center" width="100%">
          <Box width="100%" textAlign="center" margin="auto">
            <Box backgroundColor="#F6D644" position={"relative"} h={"100px"} />
            <Image
              src={"/images/app/border.svg"}
              w={"100%"}
              alt={""}
              pos={"relative"}
              zIndex={1}
            />
            <Image
              alt=""
              height="150px"
              width="150px"
              margin="auto"
              src={page?.content?.publicSuccess?.image}
              position={"relative"}
              zIndex={2}
              marginTop={"-100px"}
            />

            <Center>
              <Flex direction="row" ml={"-30px"} alignItems="center" pt={'30px'}>
                <Box>
                <Image
                  src={"/images/app/click.svg"}
                  alt="clickIcon"
                  alignSelf={"self-end"}
                  p={"5px"}
                />
                </Box>
                <Box>
                  <Text
                    fontWeight={700}
                    dangerouslySetInnerHTML={{
                      __html: page?.content?.publicSuccess?.content,
                    }}
                  />
                </Box>
              </Flex>
            </Center>
            <br/>

            <Box bgColor="#FFF">
              <Box
                style={{
                  background:
                    "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
                  marginTop: "60px",
                }}
                h={"16px"}
                w={"100%"}
                opacity={0.2}
              />
              <Box px={"15px"} py={"12px"} w="100%">
                <Box width="100%" textAlign="center">
                  <Button
                    backgroundColor="#F6D644"
                    borderRadius="22px"
                    height="44px"
                    width="100%"
                    onClick={() => {
                      handleSendLoginSuccessResponse();
                      handleCloseWebView();
                    }}
                  >
                    {page?.content?.publicSuccess?.button}
                  </Button>
                </Box>
              </Box>
            </Box>
            {/* <Text marginTop="10px" textAlign="center">
            <Text as="span">
              {page?.content?.footer?.drop?.text}
              <Text as="span" cursor="pointer" onClick={logout}>
                {page?.content?.footer?.drop?.button}
              </Text>
            </Text>
          </Text> */}
          </Box>
        </Box>
      </Box>
    </Box>
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

import {
  Button,
  Box,
  Image,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Link from "next/link";
import { getPage } from "../../../../../../utils/page/getPage";
import withPageCMS from "../../../../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../../../../utils/server/getSharedServerSideProps";
import { useCredential } from "../../../../../../utils/user";
import { useRouter } from "next/router";
import React from "react";
import nookies from "nookies";
import { useAppContext } from "../../../../../../store/AppStore";

const PAGE_KEY = "identity_public_add_success";

export const getServerSideProps = async (context) => {
  const cookies = nookies.get(context);
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
      token: cookies['jciep-token'],
      identityId: cookies['jciep-identityId']
    },
  };
};

const IdentityPublicAddSuccess = ({ page, token, identityId }) => {
  const [, removeCredential] = useCredential();

  const {postMessage} = useAppContext()

  const sendLoginSuccessResponse = () => {

    let json = {
      name: "sendLoginSuccessResponse",
      options: { 
        callback: "sendLoginSuccessResponseHandler",
        params: {
          token: token,
          identityId: identityId
        }
      }
    }

    postMessage(json)
  }

  return (
    <Box pt={{ base: '64px' }}>
      <Grid templateColumns="repeat(3, 1fr)" width="100%" px={"20px"} alignItems="center" h={'48px'} backgroundColor="#F6D644">
        <GridItem>
          {/* <Image src={'/images/app/close.svg'} alt={''}/> */}
          {" "}
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
              w={'100%'}
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

            <Text
              marginTop="30px"
              fontWeight={700}
              dangerouslySetInnerHTML={{
                __html: page?.content?.publicSuccess?.content,
              }}
            />

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
                      onClick={()=> sendLoginSuccessResponse()}
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

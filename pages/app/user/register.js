import {
  Button,
  Box,
  Image,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  Container,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import { useCredential } from "../../../utils/user";
import { useAppContext } from "../../../store/AppStore";
import { useRouter } from "next/router";
import React from "react";

const PAGE_KEY = "app_user_register";

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
const AppUserRegister = ({ page }) => {
  const router = useRouter();
  const { user } = useAppContext();
  const [, removeCredential] = useCredential();

  const logout = () => {
    removeCredential();
    router.push("/");
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
          <Image src={"/images/app/close.svg"} alt={""} />
        </GridItem>
      </Grid>
      <Box>
        <Box justifyContent="center" width="100%">
          <Box width="100%" textAlign="center" margin="auto">
            <Box
              backgroundColor="#F6D644"
              bgImage={`url('/images/app/welcome_top_bg.png')`}
              bgRepeat={"no-repeat"}
              bgPosition={"center center"}
              position={"relative"}
              h={"230px"}
            />
            <Image
              src={"/images/app/welcome_white_bg.svg"}
              w={"100%"}
              alt={""}
              pos={"relative"}
              zIndex={1}
              mt={"-40px"}
            />
            <Image
              alt=""
              height="200px"
              width="300px"
              margin="auto"
              src={page?.content?.startRegistration?.image}
              position={"relative"}
              zIndex={2}
              marginTop={"-120px"}
            />

            <Box
              bgImage={`url('/images/app/bottom_bg.png')`}
              bgRepeat={"no-repeat"}
              bgPosition={"bottom center"}
            >
              <Container>
                <Text fontWeight={700} fontSize={"24px"}>
                  {page?.content?.heading?.title}
                </Text>
                <Text
                  marginTop="10px"
                  dangerouslySetInnerHTML={{
                    __html: page?.content?.startRegistration?.content,
                  }}
                />
              </Container>

              <Box>
                <Box px={"15px"} py={"12px"} mt={10} w="100%">
                  <Box width="100%" textAlign="center">
                    <Link href="/app/user/identity/public/add">
                      <Button
                        backgroundColor="#F6D644"
                        borderRadius="22px"
                        height="44px"
                        width="100%"
                      >
                        {page?.content?.continue}
                      </Button>
                    </Link>
                  </Box>
                  <Flex
                    direction={"column"}
                    gap={2}
                    py={6}
                    mt={10}
                    color={"#666666"}
                  >
                    <Text
                      dangerouslySetInnerHTML={{
                        __html: page?.content?.remark?.text?.replace(
                          " ",
                          `<b>${user?.email}</b>`
                        ),
                      }}
                    />
                    <Box>
                      <Text as="span">{page?.content?.remark?.text02}</Text>{" "}
                      <Text as="span" onClick={() => logout()}>
                        退出
                      </Text>
                    </Box>
                  </Flex>
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

export default withPageCMS(AppUserRegister, {
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
        {
          name: "subTitle",
          label: "副標題 Sub title",
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
          label: "標題 Title",
          component: "text",
        },
      ],
    },
    {
      name: "startRegistration",
      label: "開始 Start Registration",
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
      ],
    },
    {
      name: "remark",
      label: "身份 current",
      component: "group",
      fields: [
        {
          name: "text",
          label: "文本 text",
          component: "text",
        },
        {
          name: "text02",
          label: "文本 text",
          component: "text",
        },
        {
          name: "logout",
          label: "文本 text",
          component: "text",
        },
      ],
    },
    {
      name: "continue",
      label: "開始設定 Continue Label",
      component: "text",
    },
  ],
});

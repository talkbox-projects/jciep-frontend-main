import { Button, Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../../../utils/server/getSharedServerSideProps";
import { useAppContext } from "../../../../../store/AppStore";
import { useRouter } from "next/router";
import { useCredential } from "../../../../../utils/user";

const PAGE_KEY = "organization_company_pending";

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
const OrganizationCompanyPending = ({ page }) => {
  const { user } = useAppContext();
  const router = useRouter();
  const [setCredential, removeCredential] = useCredential();

  const logout = () => {
    removeCredential();
    router.push("/");
  };

  return (
    <VStack py={36}>
      <Text mt={10}>{page?.content?.step?.title}</Text>
      <Box justifyContent="center" width="100%">
        <Box
          maxWidth={470}
          width="100%"
          textAlign="center"
          margin="auto"
          padding="0px 25px"
        >
          <Heading as="span" textAlign="center">
            {page?.content?.heading?.title}
          </Heading>

          <Image alt=""
            height="150px"
            width="150px"
            marginTop="50px !important"
            margin="auto"
            src={page?.content?.companySuccess?.image}
          />

          <Text marginTop="30px">
            {page?.content?.companySuccess?.description}
          </Text>

          <Box width="100%" textAlign="center" marginBottom="120px">
            <Link href="/">
              <Button
                color="#1E1E1E"
                boxSizing="border-box"
                height="46px"
                width="114px"
                border="2px solid #C6C6C6"
                marginTop="30px !important"
                borderRadius="50px"
                bgColor="primary.400"
              >
                {page?.content?.companySuccess?.button}
              </Button>
            </Link>
          </Box>

          <Text marginTop="10px" textAlign="center">
            <Text as="span">
              {page?.content?.footer?.drop?.text}
              <Text as="span" cursor="pointer" onClick={logout}>
                {page?.content?.footer?.drop?.button}
              </Text>
            </Text>
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(OrganizationCompanyPending, {
  key: PAGE_KEY,
  fields: [
    {
      name: "step",
      label: "?????? step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "????????? Title",
          component: "text",
        },
      ],
    },
    {
      name: "heading",
      label: "?????? Heading",
      component: "group",
      fields: [
        {
          name: "title",
          label: "????????? Title",
          component: "text",
        },
      ],
    },
    {
      name: "companySuccess",
      label: "?????? ?????? Company Success",
      component: "group",
      fields: [
        {
          label: "?????? Image",
          name: "image",
          component: "image",
          uploadDir: () => "/identity",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "description",
          label: "?????? description",
          component: "text",
        },
        {
          name: "button",
          label: "?????? button text",
          component: "text",
        },
      ],
    },
    {
      name: "footer",
      label: "?????? Footer",
      component: "group",
      fields: [
        {
          name: "drop",
          label: "?????? Drop",
          component: "group",
          fields: [
            {
              name: "text",
              label: "?????? Text",
              component: "text",
            },
            {
              name: "button",
              label: "???????????? Button text",
              component: "text",
            },
          ],
        },
      ],
    },
  ],
});

import React from "react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { VStack, Box, Text } from "@chakra-ui/react";
import DividerSimple from "../../components/DividerSimple";
import Container from "../../components/Container";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { htmlStyles } from "../../utils/general";

const PAGE_KEY = "textSize";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isShowLangSwitcher: true,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const TextSize = ({ page }) => {
  const router = useRouter();

  return (
    <>
      <VStack spacing={0} align="stretch" w="100%">
        <Box
          d={!router.query.jobId ? "block" : ["none", "none", "block"]}
          bgColor="#F6D644"
          position="relative"
        >
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Box pb={[48, 48, 48, 36]} pt={[24, 24, 24, 36]}>
              <Text fontSize="5xl" fontWeight="bold">
                {page?.content?.title}
              </Text>
              <Text fontSize="xl">{page?.content?.description}</Text>
            </Box>
          </Container>
        </Box>

        <Box bg="#fafafa" py={[4, 16]}>
          <Container>
            <Box
              sx={htmlStyles}
              bg="white"
              borderRadius="xl"
              p={[4, 8]}
              minH="160px"
              boxShadow="md"
              dangerouslySetInnerHTML={{
                __html: page?.content?.details,
              }}
            ></Box>
          </Container>
        </Box>
      </VStack>
    </>
  );
};

export default withPageCMS(TextSize, {
  key: PAGE_KEY,
  fields: [
    {
      name: "title",
      label: "標題 Title",
      component: "text",
    },
    {
      name: "description",
      label: "描述 Description",
      component: "text",
    },
    {
      name: "details",
      label: "內容 Details",
      component: "html",
    },
  ],
});

import { Box, Text, VStack } from "@chakra-ui/layout";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { NextSeo } from "next-seo";
import { chakra, Heading } from "@chakra-ui/react";
import Container from "../../components/Container";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import metaTextTemplates from "../../utils/tina/metaTextTemplates";
import programmeFieldsForCMS from "../../utils/tina/programmeFieldsForCMS";

const PAGE_KEY = "programme";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const Programme = ({ page }) => {
  return (
    <VStack w="100%" align="stretch">
      {page?.seo?.title && (
        <NextSeo
          title={page?.seo?.title}
          description={page?.seo?.description}
        ></NextSeo>
      )}
      <Text>{JSON.stringify(page)}</Text>
    </VStack>
  );
};

export default withPageCMS(Programme, {
  key: PAGE_KEY,
  fields: programmeFieldsForCMS,
});

import { Text, VStack } from "@chakra-ui/layout";
import { getPage } from "../../utils/page/getPage";
import { NextSeo } from "next-seo";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import withPageCMS from "../../utils/page/withPageCMS";
import withPostCMS from "../../utils/post/withPostCMS";
import withPostCreatorCMS from "../../utils/post/withPostCreatorCMS";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const Sharing = ({ page, setting }) => {
  const categories = setting?.value?.categories;
  return (
    <VStack w="100%" align="stretch">
      {page?.content?.seo?.title && (
        <NextSeo
          title={page?.content?.seo?.title}
          description={page?.content?.seo?.description}
        ></NextSeo>
      )}
      <Text>{JSON.stringify(page)}</Text>
      <Text>{JSON.stringify(categories)}</Text>
    </VStack>
  );
};

export default withPostCreatorCMS(
  withPageCMS(Sharing, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

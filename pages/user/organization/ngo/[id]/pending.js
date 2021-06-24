import { Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";

const PAGE_KEY = "organization_ngo_pending";

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
      lang: context.locale,
    },
  };
};
const OrganizationNgoPending = () => {
  return (
    <VStack py={36}>
      <Text>Your application is pending for approval</Text>
      <Link href="/">
        <Button>Back To Home</Button>
      </Link>
    </VStack>
  );
};

export default withPageCMS(OrganizationNgoPending, { key: PAGE_KEY });

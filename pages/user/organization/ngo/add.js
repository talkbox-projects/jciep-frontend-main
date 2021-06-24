import { Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";

const PAGE_KEY = "organization_ngo_add";

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
const OrganizationNgoAdd = () => {
  return (
    <VStack py={36}>
      <Text>Add Ngo</Text>
      <Link href="/user/organization/ngo/organization-id/pending">
        <Button>Submit</Button>
      </Link>
    </VStack>
  );
};

export default withPageCMS(OrganizationNgoAdd, { key: PAGE_KEY });

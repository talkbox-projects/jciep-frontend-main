import { Button, Text, VStack } from "@chakra-ui/react";
import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import Link from "next/link";

const PAGE_KEY = "organization_company_add";

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
const OrganizationCompanyAdd = () => {
  return (
    <VStack py={36}>
      <Text>Add Company</Text>
      <Link href="/user/organization/company/id/pending">
        <Button>Submit</Button>
      </Link>
    </VStack>
  );
};

export default withPageCMS(OrganizationCompanyAdd, { key: PAGE_KEY });

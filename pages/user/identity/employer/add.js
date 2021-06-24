import { Button, Text, VStack } from "@chakra-ui/react";
import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import Link from "next/link";

const PAGE_KEY = "employer_identity_add";

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

const IdentityEmployerAdd = () => {
  return (
    <VStack py={36}>
      <Text>Add Employer</Text>
      <Link href="/user/organization/company/add">
        <Button>Create Employer Account</Button>
      </Link>
    </VStack>
  );
};

export default withPageCMS(IdentityEmployerAdd, { key: PAGE_KEY });
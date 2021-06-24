import { Button, Text, VStack } from "@chakra-ui/react";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import Link from "next/link";

const PAGE_KEY = "identity_select";

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

const IdentitySelect = () => {
  return (
    <VStack py={36}>
      <Text>Add Staff</Text>
      <Link href="/user/identity/pwd/add">
        <Button>People with disabilities</Button>
      </Link>
      <Link href="/user/identity/public/add">
        <Button>Public</Button>
      </Link>
      <Link href="/user/identity/staff/add">
        <Button>NGO Staff</Button>
      </Link>
      <Link href="/user/identity/employer/add">
        <Button>Employer</Button>
      </Link>
    </VStack>
  );
};

export default withPageCMS(IdentitySelect, { key: PAGE_KEY });

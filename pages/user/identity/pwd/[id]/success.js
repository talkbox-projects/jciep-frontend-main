import { Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { getConfiguration } from "../../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../../utils/page/getPage";
import withPageCMS from "../../../../../utils/page/withPageCMS";

const PAGE_KEY = "identity_pwd_add_success";

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
const IdentityPwdAddSuccess = () => {
  return (
    <VStack py={36}>
      <Text>Your identity is created.</Text>
      <Link href="/user/identity/id/profile">
        <Button>Go to profile</Button>
      </Link>
    </VStack>
  );
};

export default withPageCMS(IdentityPwdAddSuccess, { key: PAGE_KEY });

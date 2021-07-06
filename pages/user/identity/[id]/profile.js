import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useAppContext } from "../../../../store/AppStore";
import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
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

const PwdProfileSection = () => {
  return (
    <VStack>
      <Box>PwdProfileSection</Box>
    </VStack>
  );
};

const PublicProfileSection = () => {
  return (
    <VStack>
      <Box>PublicProfileSection</Box>
    </VStack>
  );
};

const IdentityProfile = () => {
  const { identity } = useAppContext();
  console.log(identity);
  return (
    <VStack pt={64} pb={36}>
      <HStack>
        <VStack>
          <Box boxShadow="lg"></Box>
          <Box boxShadow="lg"></Box>
        </VStack>
        <VStack>
          <Box boxShadow="lg"></Box>
          <Box boxShadow="lg"></Box>
        </VStack>
      </HStack>
      <Text>Identity Profile</Text>
    </VStack>
  );
};

export default withPageCMS(IdentityProfile, { key: PAGE_KEY });

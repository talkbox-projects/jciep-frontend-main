import { Text, Box, VStack, Avatar, HStack } from "@chakra-ui/react";
import Container from "../../../components/Container";
import { useAppContext } from "../../../store/AppStore";
import { useInjectParams } from "../../../utils/general";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../utils/wordExtractor";

const PAGE_KEY = "account_info";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const AccountInfoPage = ({ page }) => {
  const { user } = useAppContext();
  const injectParams = useInjectParams();
  return (
    <VStack py={[24, 36]}>
      <Container>
        <Text fontSize="4xl">
          {wordExtractor(page?.content?.wordings, "title")}
        </Text>
      </Container>
      <Container>
        <VStack mt={8} align="start">
          <Text align="center" px={1} boxShadow="lg" borderRadius={8} p={8}>
            {injectParams(wordExtractor(page?.content?.wordings, "message"), {
              login_method: "Google",
              avatar: <Avatar src={user?.snsMeta?.profilePicUrl} size="lg" />,
            })}
          </Text>
        </VStack>
      </Container>
    </VStack>
  );
};

export default withPageCMS(AccountInfoPage, { key: PAGE_KEY });

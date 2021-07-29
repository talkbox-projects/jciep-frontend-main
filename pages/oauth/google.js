import React from "react";
import { useEffect } from "react";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { VStack } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../utils/apollo";
import { Text, Box, Container, Spinner } from "@chakra-ui/react";
import { useCredential } from "../../utils/user";
import userLogin from "../../utils/api/UserLogin";

const PAGE_KEY = "googleLogin";

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
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const GoogleLogin = ({ page }) => {
  const router = useRouter();
  const { accessToken } = router.query;
  const [setCredential] = useCredential();

  useEffect(() => {
    (async () => {
      try {
      
        const variables = {
          input: {
            googleToken: accessToken,
          },
        };


        // const data = await getGraphQLClient().request(mutation, variables);
        const data = await userLogin(variables)
        setCredential(data);
        if (data) {
          const user = data?.user;
          if (user?.identities?.length === 0) {
            router.replace("/user/identity/select");
          } else {
            router.replace("/");
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();

    console.log(accessToken);
  }, [accessToken, router, setCredential]);

  return (
    <VStack w="100%" spacing={0} align="stretch">
      <Box>
        <Container marginTop="10%" textAlign="center">
          <Text
            d="inline-block"
            mt={48}
            px={2}
            mb={36}
            fontWeight="bold"
            fontSize={["3xl", "5xl", "6xl"]}
          >
            <Spinner />
          </Text>
        </Container>
      </Box>
    </VStack>
  );
};

export default withPageCMS(GoogleLogin, {
  key: PAGE_KEY,
});

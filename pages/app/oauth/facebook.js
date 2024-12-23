import React from "react";
import { useEffect } from "react";
import withPageCMS from "../../../utils/page/withPageCMS";
import { getPage } from "../../../utils/page/getPage";
import { VStack } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { Text, Box, Container, Spinner } from "@chakra-ui/react";
import { useCredential } from "../../../utils/user";
import userLogin from "../../../utils/api/UserLogin";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "facebookLogin";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isApp: true,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const FacebookLogin = () => {
  const router = useRouter();
  const { accessToken } = router.query;
  const [setCredential] = useCredential();

  useEffect(() => {
    (async () => {
      try {
        const variables = {
          input: {
            facebookToken: accessToken,
          },
        };

        const user = await userLogin(variables);
        setCredential(user);
        if (user) {
          if (user?.identities?.length === 0) {
            router.replace("/app/user/identity/public/add");
          } else {
            window.WebContext = {};
            window.WebContext.closeWebViewHandler = () => {
              console.log("close web view");
            };
        
            let json = {
              name: "closeWebView",
              options: {
                callback: "closeWebViewHandler",
                params: {},
              },
            };
        
            if (window && window.AppContext && window.AppContext.postMessage) {
              window.AppContext.postMessage(JSON.stringify(json));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
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

export default withPageCMS(FacebookLogin, {
  key: PAGE_KEY,
});

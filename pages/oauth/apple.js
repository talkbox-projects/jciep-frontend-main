import React from "react";
import { useEffect } from "react";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { VStack } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { Text, Box, Container, Spinner } from "@chakra-ui/react";
import { useCredential } from "../../utils/user";

import formidable from "formidable";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import userLogin from "../../utils/api/UserLogin";

const PAGE_KEY = "appleLogin";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const form = formidable({ multiples: true });

  const body = await new Promise((r) => {
    form.parse(context.req, (err, fields) => {
      r(fields);
    });
  });

  return {
    props: {
      page,
      id_token: body?.id_token || context.query.id_token,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const AppleLogin = ({ id_token: accessToken }) => {
  const router = useRouter();
  const [setCredential] = useCredential();

  useEffect(() => {
    (async () => {
      try {
        

        const variables = {
          input: {
            appleToken: accessToken,
          },
        };

        const data = await userLogin(variables)
        // const data = await getGraphQLClient().request(mutation, variables);
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

export default withPageCMS(AppleLogin, {
  key: PAGE_KEY,
});

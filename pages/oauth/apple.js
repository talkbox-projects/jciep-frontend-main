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
import getRawBody from "raw-body";
import util from "util";
import multer from "multer";

const PAGE_KEY = "appleLogin";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  await util.promisify(multer().any())(context.req, context.res);

  if (context.req.method == "POST") {
    const body = await getRawBody(context.req);
    console.log(body.toString("utf-8"));
  }

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

const AppleLogin = ({ page }) => {
  const router = useRouter();
  const { code: accessToken } = router.query;
  const [setCredential] = useCredential();

  useEffect(() => {
    (async () => {
      try {
        const mutation = gql`
          mutation UserLogin($input: LoginInput) {
            UserLogin(input: $input) {
              token
              user {
                id
                email
                snsMeta {
                  profilePicUrl
                  displayName
                }
                identities {
                  id
                  type
                  chineseName
                  englishName
                  dob
                  gender
                  district
                  pwdType
                  interestedEmploymentMode
                  interestedIndustry
                  interestedIndustryOther
                  industry
                  tncAccept
                  published
                  email
                  phone
                  profilePic {
                    id
                    url
                    contentType
                    fileSize
                  }
                  bannerMedia {
                    file {
                      id
                      url
                      contentType
                      fileSize
                    }
                    videoUrl
                    title
                    description
                  }
                  yearOfExperience
                  biography
                  portfolio {
                    file {
                      id
                      url
                      contentType
                      fileSize
                    }
                    videoUrl
                    title
                    description
                  }
                  writtenLanguage
                  writtenLanguageOther
                  oralLanguage
                  oralLanguageOther
                  hobby
                  education {
                    school
                    degree
                    fieldOfStudy
                    startDatetime
                    endDatetime
                    present
                  }
                  employment {
                    employmentType
                    companyName
                    jobTitle
                    industry
                    startDatetime
                    endDatetime
                    present
                  }
                  activity {
                    name
                    description
                    startDatetime
                    endDatetime
                  }
                }
              }
            }
          }
        `;

        const variables = {
          input: {
            appleToken: accessToken,
          },
        };

        const data = await getGraphQLClient().request(mutation, variables);
        setCredential(data?.UserLogin);
        if (data?.UserLogin) {
          const user = data?.UserLogin?.user;
          if (user?.identities?.length === 0) {
            router.push("/user/identity/select");
          } else {
            router.push("/");
          }
        }
      } catch (e) {
        console.log(e);
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

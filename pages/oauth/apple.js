import React from "react";
import { useEffect } from "react";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { VStack } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../utils/apollo";
import { Text, Box, Container, Spinner } from "@chakra-ui/react";
import { useCredential } from "../../utils/user";

import formidable from "formidable";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "appleLogin";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const form = formidable({ multiples: true });

  console.log(context.query);

  const body = await new Promise((r) => {
    form.parse(context.req, (err, fields) => {
      r(fields);
    });
  });
  console.log(body);

  return {
    props: {
      page,
      id_token: body?.id_token || context.query.id_token,
      isLangAvailable: context.locale === page.lang,
      ...getSharedServerSideProps(context)?.props,
    },
  };
};

const AppleLogin = ({ id_token: accessToken }) => {
  const router = useRouter();
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
                facebookId
                googleId
                appleId
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

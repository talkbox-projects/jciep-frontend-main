import {
  Text,
  Icon,
  VStack,
  Avatar,
  HStack,
  Wrap,
  Button,
  Box,
} from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import {
  IoLogoApple,
  IoLogoFacebook,
  IoLogoGoogle,
  IoMail,
  IoPhoneLandscapeOutline,
} from "react-icons/io5";
import { RiArrowRightLine } from "react-icons/ri";
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
  const { user, resetPasswordModalDisclosure } = useAppContext();
  const injectParams = useInjectParams();

  const getLoginMethod = useCallback(({ user }) => {
    if (user?.facebookId) {
      return "facebook";
    } else if (user?.googleId) {
      return "google";
    } else if (user?.appleId) {
      return "apple";
    } else if (user?.phone) {
      return "phone";
    } else {
      return "email";
    }
  }, []);

  const getLoginMethodDisplay = useCallback(
    ({ user }) => {
      let loginMethodDisplay = null;
      const loginMethod = getLoginMethod({ user });
      switch (loginMethod) {
        case "facebook":
          loginMethodDisplay = (
            <HStack color="facebook.500">
              <Icon fontSize="lg" as={IoLogoFacebook} /> <Text>Facebook</Text>
            </HStack>
          );
          break;
        case "google":
          loginMethodDisplay = (
            <HStack color="google.500">
              <Icon fontSize="lg" as={IoLogoGoogle} /> <Text>Google</Text>
            </HStack>
          );
          break;
        case "apple":
          loginMethodDisplay = (
            <HStack color="gray.500">
              <Icon fontSize="lg" as={IoLogoApple} /> <Text>Facebook</Text>
            </HStack>
          );
          break;

        case "phone":
          loginMethodDisplay = (
            <HStack color="gray.500">
              <Icon fontSize="lg" as={IoPhoneLandscapeOutline} />{" "}
              <Text>Phone</Text>
            </HStack>
          );
          break;
        default:
          loginMethodDisplay = (
            <HStack color="gray.500">
              <Icon fontSize="lg" as={IoMail} /> <Text>Email</Text>
            </HStack>
          );
      }

      if (loginMethod === "email") {
        return injectParams(wordExtractor(page?.content?.wordings, "message"), {
          displayName: <Text fontWeight="bold">{user?.email}</Text>,
          login_method: <>{loginMethodDisplay}</>,
        });
      } else if (loginMethod === "phone") {
        return injectParams(wordExtractor(page?.content?.wordings, "message"), {
          displayName: <Text fontWeight="bold">{user?.phone}</Text>,
          login_method: <>{loginMethodDisplay}</>,
        });
      } else {
        return injectParams(wordExtractor(page?.content?.wordings, "message"), {
          displayName: (
            <>
              <Avatar ml={2} src={user?.snsMeta?.profilePicUrl} size="sm" />
              <Text fontWeight="bold">{user?.snsMeta?.displayName}</Text>
            </>
          ),
          login_method: <>{loginMethodDisplay}</>,
        });
      }
    },
    [getLoginMethod, injectParams, page?.content?.wordings]
  );

  const resetPasswordLink = useMemo(() => {
    const loginViaEmail = getLoginMethod({ user }) === "email";
    if (loginViaEmail) {
      return (
        <Button
          onClick={() => {
            resetPasswordModalDisclosure.onOpen();
          }}
          variant="outline"
          colorScheme="gray"
          rightIcon={<RiArrowRightLine />}
        >
          重設密碼
        </Button>
      );
    } else {
      return null;
    }
  }, [getLoginMethod, user]);

  return (
    <VStack py={[24, 40]}>
      <Container>
        <Text fontSize="4xl">
          {wordExtractor(page?.content?.wordings, "title")}
        </Text>
      </Container>
      <Container>
        <Wrap mt={8} spacing={1} align="center" px={1} borderRadius={8}>
          {getLoginMethodDisplay({ user })}
        </Wrap>
        <Box mt={16}>{resetPasswordLink}</Box>
      </Container>
    </VStack>
  );
};

export default withPageCMS(AccountInfoPage, { key: PAGE_KEY });

import { Box, HStack } from "@chakra-ui/layout";
import wordListFieldsForCMS from "../utils/tina/wordListFieldsForCMS";
import {
  Avatar,
  Button,
  Divider,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCMS } from "tinacms";
import withConfigurationCMS from "../utils/configuration/withConfigurationCMS";
import Container from "./Container";
import { useAppContext } from "../store/AppStore";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import OtpVerifyModal from "./OtpVerifyModal";
import EmailVerifySentModal from "./EmailVerifyModal";
import { useGetWording } from "../utils/wordings/useWording";
import { useCallback } from "react";

const Header = ({ header }) => {
  const getWording = useGetWording();
  const {
    isLoggedIn,
    loginModalDisclosure,
    registerModalDisclosure,
    user,
    identityId: currentIdentityId,
  } = useAppContext();
  const router = useRouter();
  const cms = useCMS();

  const onIdentitySwitch = useCallback((identityId) => {
    setIdentityId(identityId);
  }, []);

  return (
    <Box position="fixed" top={0} w="100%" bg="white" zIndex={200}>
      <Container>
        <HStack py={2} fontSize="sm" alignItems="center">
          <Box flex={1} minW={0} w="100%" />
          <Text>{user ? user.email ?? user.phone : "guest"}</Text>
          <Link href="/web-accessibility" fontSize="sm">
            字體大小
          </Link>
          <Select
            border="none"
            size="sm"
            w={12}
            variant="flushed"
            value={router.locale}
            onChange={(e) => {
              if (cms.enabled) {
                window.location.href = `/${e.target.value}${router.asPath}`;
              } else {
                router.push(router.pathname, router.pathname, {
                  locale: e.target.value,
                });
              }
            }}
          >
            <option value="zh">繁</option>
            <option value="en">EN</option>
          </Select>
          <Popover placement="bottom-end" gutter={20}>
            <PopoverTrigger>
              <Avatar size="xs"></Avatar>
            </PopoverTrigger>
            {!isLoggedIn ? (
              <PopoverContent p={3} w={48}>
                <VStack align="stretch">
                  <Link onClick={loginModalDisclosure.onOpen}>
                    {getWording("header.login_label")}
                  </Link>
                  <Link onClick={registerModalDisclosure.onOpen}>
                    {getWording("header.register_label")}
                  </Link>
                </VStack>
              </PopoverContent>
            ) : (
              <PopoverContent p={3} w={72}>
                <VStack align="stretch" spacing={4}>
                  {user?.identities?.length ? (
                    <VStack spacing={0} align="stretch">
                      <Text fontWeight="bold">身份</Text>
                      <Text
                        alignSelf="center"
                        py={6}
                        color="gray.500"
                        textAlign="center"
                      >
                        未有任何身份
                      </Text>
                    </VStack>
                  ) : (
                    <VStack spacing={2} align="stretch">
                      <Text my={1} fontWeight="bold">
                        身份
                      </Text>
                      <VStack align="stretch">
                        <HStack
                          _hover={{ bg: "gray.50" }}
                          cursor="pointer"
                          p={2}
                          spacing={4}
                        >
                          <Avatar size="sm"></Avatar>
                          <VStack
                            align="start"
                            spacing={0}
                            flex={1}
                            minW={0}
                            w="100%"
                          >
                            <Text fontSize="md">陳大文</Text>
                            <Text color="gray.500" fontSize="sm">
                              多元人才
                            </Text>
                          </VStack>
                          <Tag size="sm">
                            {getWording("header.current_label")}
                          </Tag>
                        </HStack>
                        {(user?.identities ?? []).map((identity) => (
                          <HStack
                            key={identity.id}
                            _hover={{ bg: "gray.100" }}
                            cursor="pointer"
                            p={2}
                            spacing={4}
                            onClick={onIdentitySwitch}
                          >
                            <Avatar size="sm"></Avatar>
                            <VStack spacing={0}>
                              <Text fontSize="md">{identity.chineseName}</Text>
                              <Text color="gray.500" fontSize="sm">
                                {identity.type}
                              </Text>
                            </VStack>
                            {currentIdentityId === identity.id && (
                              <Tag size="sm">
                                {getWording("header.current_label")}
                              </Tag>
                            )}
                          </HStack>
                        ))}
                      </VStack>
                      <Divider />
                      <VStack mt={2} align="stretch" spacing={2}>
                        <Link onClick={registerModalDisclosure.onOpen}>
                          {getWording("header.account_setting_label")}
                        </Link>
                        <Link onClick={registerModalDisclosure.onOpen}>
                          {getWording("header.logout_label")}
                        </Link>
                      </VStack>
                    </VStack>
                  )}
                </VStack>
              </PopoverContent>
            )}
          </Popover>
        </HStack>
      </Container>
      <LoginModal />
      <RegisterModal />
      <OtpVerifyModal />
      <EmailVerifySentModal />
    </Box>
  );
};

export default withConfigurationCMS(
  withConfigurationCMS(Header, {
    key: "header",
    label: "頁首 Header",
    fields: [wordListFieldsForCMS({ name: "wordings" })],
  }),
  {
    key: "setting",
    label: "設定 Setting",
    fields: [
      {
        name: "categories",
        component: "group-list",
        label: "分類 Categories",
        itemProps: ({ id: key, label }) => ({
          key,
          label: label?.zh || label?.en ? `${label?.zh} ${label?.en}` : "",
        }),
        defaultItem: () => ({
          id: Math.random().toString(36).substr(2, 9),
        }),
        fields: [
          {
            name: "key",
            component: "text",
            label: "關鍵碼 Post Category Key",
          },
          {
            name: "label",
            component: "group",
            label: "分類名稱 Category Label",
            fields: [
              {
                name: "en",
                component: "text",
                label: "英文 English",
              },
              {
                name: "zh",
                component: "text",
                label: "繁體中文 Traditional Chinese",
              },
            ],
          },
          {
            name: "color",
            component: "color",
            label: "顏色 Color",
          },
          {
            label: "圖示 Icon",
            name: "image",
            component: "image",
            uploadDir: () => "/sharing/categories",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
        ],
      },
    ],
  }
);

import { Box, HStack } from "@chakra-ui/layout";
import wordListFieldsForCMS from "../utils/tina/wordListFieldsForCMS";
import {
  Avatar,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
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

const Header = ({ header }) => {
  const { loginModalDisclosure, registerModalDisclosure } = useAppContext();
  const router = useRouter();
  const cms = useCMS();
  return (
    <Box zIndex={1000}>
      <Container>
        <HStack py={2} fontSize="sm" alignItems="center">
          <Box flex={1} minW={0} w="100%" />
          <Link href="/web-accessibility" fontSize="sm">
            字體大小
          </Link>
          <Select
            border="none"
            size="xs"
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
              <Avatar
                size="xs"
                name="A K"
                src="https://bit.ly/tioluwani-kolawole"
              ></Avatar>
            </PopoverTrigger>
            <PopoverContent p={4} w={48}>
              <VStack alignItems="flex-start">
                <Link onClick={loginModalDisclosure.onOpen}>登入</Link>
                <Link onClick={registerModalDisclosure.onOpen}>會員註冊</Link>
              </VStack>
            </PopoverContent>
          </Popover>
        </HStack>
      </Container>
      <LoginModal />
      <RegisterModal />
      <OtpVerifyModal />
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

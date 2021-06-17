import { Box, HStack, Text } from "@chakra-ui/layout";
import {
  Avatar,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCMS } from "tinacms";
import withConfigurationCMS from "../utils/configuration/withConfigurationCMS";
import Container from "./Container";

const Header = ({ header }) => {
  const router = useRouter();
  const cms = useCMS();
  return (
    <Box zIndex={100}>
      <Container>
        <HStack zIndex={100} py={2} fontSize="sm" alignItems="center">
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
                <Link>登入</Link>
                <Link>會員註冊</Link>
              </VStack>
            </PopoverContent>
          </Popover>
        </HStack>
      </Container>
    </Box>
  );
};

export default withConfigurationCMS(Header, {
  key: "header",
  label: "頁首 Header",
  fields: [
    {
      name: "title",
      label: "title",
      component: "text",
    },
  ],
});

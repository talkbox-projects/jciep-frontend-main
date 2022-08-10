import React from "react";
import { Box, HStack } from "@chakra-ui/layout";
import wordListFieldsForCMS from "../utils/tina/wordListFieldsForCMS";
import NextLink from "next/link";
import {
  Drawer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Image,
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
  IconButton,
  DrawerBody,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
  PopoverBody,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import withConfigurationCMS from "../utils/configuration/withConfigurationCMS";
import Container from "./Container";
import { useAppContext } from "../store/AppStore";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import OtpVerifyModal from "./OtpVerifyModal";
import EmailVerifySentModal from "./EmailVerifyModal";
import { useGetWording } from "../utils/wordings/useWording";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getGraphQLClient } from "../utils/apollo";
import { gql } from "graphql-request";
import nookies from "nookies";
import { useCredential } from "../utils/user";
import { AiOutlineMenu } from "react-icons/ai";
import ResetPasswordEmailModal from "./ResetPasswordEmailModal";
import ResetPasswordPhoneModal from "./ResetPasswordPhoneModal";
import userMeGet from "../utils/api/UserMeGet";
import ResetPasswordResetModal from "./ResetPasswordResetModal";
const Header = ({ navigation, isShowLangSwitcher = false }) => {
  const getWording = useGetWording();
  const [EnumIdentityTypeList, setEnumIdentityTypeList] = useState([]);

  const {
    identity,
    isLoggedIn,
    loginModalDisclosure,
    registerModalDisclosure,
    user,
    setIdentityId,
    identityId: currentIdentityId,
  } = useAppContext();

  const router = useRouter();
  const mobileMenuDisclosure = useDisclosure();

  const tabIndex = useMemo(() => {
    const kv = {
      0: /^(\/home)/g,
      1: /^(\/programme)/g,
      2: /^(\/people-with-disabilities)/g,
      3: /^(\/resources)/g,
      4: /^(\/job-opportunities)/g,
      5: /^(\/talants)/g,
      6: /^(\/sharing)/g,
    };
    return Object.entries(kv).reduce((tabIndex, [index, regexr]) => {
      if (tabIndex === undefined) {
        if (router.pathname.match(regexr)) {
          return index;
        } else {
          return tabIndex;
        }
      } else {
        return tabIndex;
      }
    }, undefined);
  }, [router.pathname]);

  const [setCredential, removeCredential] = useCredential();

  const onIdentitySwitch = useCallback(
    (identityId) => {
      setIdentityId(identityId);
      nookies.set(null, "jciep-identityId", identityId, { path: "/" });
      router.push(`/user/identity/me`);
    },
    [router, setIdentityId]
  );

  useEffect(() => {
    if (router && router.query) {
      if (router.query.login) {
        loginModalDisclosure.onOpen();
      } else if (router.query.register) {
        registerModalDisclosure.onOpen();
      }
    }
  }, [loginModalDisclosure, registerModalDisclosure, router]);

  useEffect(() => {
    (async () => {
      try {
        const user = await userMeGet();
        setCredential(user);
      } catch (e) {
        removeCredential();
      }
    })();
  }, [setCredential, removeCredential]);

  useEffect(() => {
    (async () => {
      try {
        const query = gql`
          query EnumIdentityTypeList {
            EnumIdentityTypeList {
              key
              value {
                en
                zh
              }
            }
          }
        `;

        const data = await getGraphQLClient().request(query);
        setEnumIdentityTypeList(data.EnumIdentityTypeList);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onLogout = () => {
    removeCredential();
    router.push("/");
  };

  // useEffect(() => {
  //   if (router.pathname) setIsShowLangUnavailable(!isLangAvailable);
  // }, [router, setIsShowLangUnavailable, isLangAvailable]);

  return (
    <Box>
      {/* {!isLangAvailable && isShowLangUnavailable && (
        <Box
          borderBottom="1px"
          borderColor="rgb(239,239,239)"
          bg="rgb(250,250,250)"
          position="fixed"
          h={20}
          w="100%"
          zIndex={100}
        >
          <Container p={4} h="100%">
            <HStack spacing={4} h="100%" align="center">
              <Icon h="32px" w="32px" color="red.500" as={IoWarning} />
              <Stack spacing={0} lineHeight={1.3}>
                <Text fontSize={["md", "lg"]}>
                  No English content available
                </Text>
                <Text fontSize="sm">
                  Sorry, no English content available currently in this page.
                </Text>
              </Stack>
              <Box w="100%" minW={0} flex={1} />
              <CloseButton onClick={() => setIsShowLangUnavailable(false)} />
            </HStack>
          </Container>
        </Box>
      )} */}
      <Box
        d={["none", "none", "none", "block"]}
        bg="white"
        position="fixed"
        // top={isShowLangUnavailable ? 20 : 0}
        w="100%"
        zIndex={100}
        h={28}
      >
        <Container h="100%">
          <HStack h="100%" py={2} fontSize="sm" alignItems="center" spacing={4}>
            <Box as="h1" h="100%">
              <LinkOverlay as={NextLink} href="/home">
                <Image
                  h="100%"
                  alt={navigation?.title}
                  cursor="pointer"
                  p={2}
                  src={navigation?.logo}
                />
              </LinkOverlay>
            </Box>
            {identity?.type === "admin" && (
              <Menu>
                <MenuButton>
                  <Button variant="link" size="sm">
                    管理介面
                  </Button>
                </MenuButton>
                <MenuList>
                  <NextLink href="/admin/identity">
                    <MenuItem key="identities">用戶管理</MenuItem>
                  </NextLink>
                  <NextLink href="/admin/organizations">
                    <MenuItem key="organizations">組織管理</MenuItem>
                  </NextLink>
                </MenuList>
              </Menu>
            )}
            <Box flex={1} minW={0} w="100%" />
            {/* {isShowLangSwitcher && (
              <Select
                border="none"
                size="sm"
                w={16}
                autoFocus={false}
                variant="flushed"
                value={router.locale}
                onChange={(e) => {
                  window.location.href = `/${e.target.value}${router.asPath}`;
                }}
              >
                <option value="zh">繁</option>
                <option value="en">EN</option>
              </Select>
            )} */}
            <Select
                border="none"
                size="sm"
                w={16}
                autoFocus={false}
                variant="flushed"
                value={router.locale}
                onChange={(e) => {
                  window.location.href = `/${e.target.value}${router.asPath}`;
                }}
              >
                <option value="zh">繁</option>
                <option value="en">EN</option>
              </Select>
            <NextLink href="/text-size" passHref>
              <Link fontSize="sm">
                {getWording("header.font_size_level_label")}
              </Link>
            </NextLink>
            <NextLink href="/contact-us" passHref>
              <Link fontSize="sm">{getWording("header.contact_us_label")}</Link>
            </NextLink>
            <Text>
              {(navigation.social ?? []).map(({ icon, url, label }, i) => {
                return (
                  <a key={i} href={url}>
                    <Image
                      alt={label}
                      display="inline-flex"
                      height="25px"
                      src={icon}
                    />
                  </a>
                );
              })}
            </Text>
            <Popover placement="bottom-end" gutter={20}>
              <PopoverTrigger>
                {!isLoggedIn ? (
                  <Button
                    aria-label={
                      router?.locale === "en" ? "Login/Logout" : "登入/登出"
                    }
                    variant="unstyled"
                  >
                    <Avatar size="xs" alt=" "></Avatar>
                  </Button>
                ) : (
                  <Button
                    aria-label={
                      router?.locale === "en" ? "User Management" : "用戶管理"
                    }
                    variant="unstyled"
                  >
                    <Avatar size="xs" alt=" "></Avatar>
                  </Button>
                )}
              </PopoverTrigger>
              {!isLoggedIn ? (
                <PopoverContent p={3} w={48}>
                  <VStack align="stretch">
                    <Button
                      variant="link"
                      onClick={loginModalDisclosure.onOpen}
                    >
                      {getWording("header.login_label")}
                    </Button>
                    <Button
                      variant="link"
                      onClick={registerModalDisclosure.onOpen}
                    >
                      {getWording("header.register_label")}
                    </Button>
                  </VStack>
                </PopoverContent>
              ) : (
                <PopoverContent p={3} w={72}>
                  <VStack align="stretch" spacing={4}>
                    {
                      <VStack spacing={2} align="stretch">
                        <Text my={1} fontWeight="bold">
                          {getWording("header.identity_subheading")}
                        </Text>
                        <VStack maxH={300} overflow="auto" align="stretch">
                          {(user?.identities ?? []).map((identity) => (
                            <HStack
                              key={identity.id}
                              _hover={{ bg: "gray.50" }}
                              cursor="pointer"
                              p={2}
                              spacing={4}
                              onClick={() => onIdentitySwitch(identity.id)}
                            >
                              {/* <Avatar size="sm"></Avatar> */}
                              <VStack
                                align="start"
                                spacing={0}
                                flex={1}
                                minW={0}
                                w="100%"
                              >
                                <Text fontSize="md">
                                  {identity.chineseName}
                                </Text>
                                <Text color="gray.500" fontSize="sm">
                                  {
                                    EnumIdentityTypeList.filter(
                                      (data) => data.key === identity.type
                                    )[0]?.value[router.locale]
                                  }
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
                        <Link href="/user/identity/select">
                          <Button
                            size="sm"
                            mt={4}
                            w="100%"
                            alignSelf="center"
                            variant="ghost"
                            color="gray.500"
                            textAlign="center"
                          >
                            {getWording("header.add_identity_label")}
                          </Button>
                        </Link>
                        <Divider />
                        <VStack mt={2} align="stretch" spacing={2}>
                          <NextLink passHref href="/user/account">
                            <Link>
                              {getWording("header.account_setting_label")}
                            </Link>
                          </NextLink>
                          <Link onClick={onLogout}>
                            {getWording("header.logout_label")}
                          </Link>
                        </VStack>
                      </VStack>
                    }
                  </VStack>
                </PopoverContent>
              )}
            </Popover>
          </HStack>
        </Container>
        <Container mt={4}>
          <HStack
            alignItems="stretch"
            justifyContent="stretch"
            h={16}
            borderRadius="50px"
            bgColor="white"
            boxShadow="sm"
            borderWidth={1}
            px={6}
          >
            <HStack
              spacing={0}
              w="100%"
              justifyContent="center"
              h="100%"
              border={0}
            >
              {(navigation.menu ?? []).map(
                ({ id, submenu = [], label, path = "/" }, index, arr) => (
                  <HStack
                    key={id}
                    h="100%"
                    borderColor="transparent"
                    borderBottomWidth={4}
                    {...(Number(tabIndex) === index && {
                      borderColor: "#00BFBA",
                      fontWeight: "bold",
                    })}
                    align="center"
                  >
                    <Box
                      {...(arr.length - 1 > index && {
                        borderRightWidth: 1,
                        borderRightColor: "#eee",
                      })}
                      px={2}
                    >
                      {submenu?.length > 0 ? (
                        <Popover gutter={20}>
                          <PopoverTrigger>
                            <Box h="100%">
                              {/* <NextLink href={path}> */}
                              <Button
                                h="100%"
                                variant="unstyled"
                                borderRadius={0}
                                fontWeight="normal"
                                fontSize={router?.locale === "zh" ? "lg" : "sm"}
                                maxW={router?.locale === "zh" ? "auto" : "120px"}
                                style={{
                                  whiteSpace: router?.locale === "zh" ? "nowrap" : "normal",
                                  wordWrap: "break-word",
                                }}
                              >
                                {label}
                              </Button>
                              {/* </NextLink> */}
                            </Box>
                          </PopoverTrigger>
                          <PopoverContent w="fit-content">
                            <PopoverBody as={VStack} spacing={4} fontSize="md">
                              {submenu.map(({ id, label, path }) => (
                                <NextLink key={id} href={path}>
                                  <Button
                                    h="100%"
                                    variant="unstyled"
                                    borderRadius={0}
                                    px={10}
                                    minW={200}
                                    fontWeight="normal"
                                    borderColor="transparent"
                                  >
                                    {label}
                                  </Button>
                                </NextLink>
                              ))}
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <NextLink href={path}>
                          <Button
                            h="100%"
                            variant="unstyled"
                            borderRadius={0}
                            fontWeight="normal"
                            fontSize={router?.locale === "zh" ? "lg" : "sm"}
                            maxW={router?.locale === "zh" ? "auto" : "120px"}
                            style={{
                              whiteSpace: router?.locale === "zh" ? "nowrap" : "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {label}
                          </Button>
                        </NextLink>
                      )}
                    </Box>
                  </HStack>
                )
              )}
              <NextLink
                href={navigation?.actionButton?.path ?? "/"}
                target="_blank"
              >
                <Button
                  variant="outline"
                  colorScheme="secondary"
                  color="#0D8282"
                  borderColor="#0D8282"
                  borderRadius="2em"
                  py={0.5}
                  fontWeight="normal"
                  borderWidth={2}
                  fontSize={router?.locale === "zh" ? "md" : "sm"}
                  maxW={router?.locale === "zh" ? "auto" : "160px"}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {navigation?.actionButton?.label}
                </Button>
              </NextLink>
            </HStack>
          </HStack>
        </Container>
      </Box>
      <LoginModal />
      <RegisterModal />
      <OtpVerifyModal />
      <EmailVerifySentModal />
      <ResetPasswordEmailModal />
      <ResetPasswordPhoneModal />
      <ResetPasswordResetModal />
      <Box
        position="fixed"
        zIndex={100}
        // top={isShowLangUnavailable ? 20 : 0}
        w="100%"
        bg="white"
        d={["block", "block", "block", "none"]}
      >
        <HStack align="center" h={24} p={3}>
          <LinkOverlay as={NextLink} href="/home">
            <Image
              alt={navigation?.title}
              cursor="pointer"
              h="100%"
              src={navigation?.logo}
            />
          </LinkOverlay>
          <Box minW={0} w="100%" flex={1} />
          <IconButton
            aria-label="目錄 Menu"
            onClick={mobileMenuDisclosure.onOpen}
            variant="link"
            fontWeight="bold"
            fontSize="2xl"
            icon={<AiOutlineMenu />}
          />
        </HStack>
        <Drawer
          placement="left"
          minW={300}
          isOpen={mobileMenuDisclosure.isOpen}
          onClose={mobileMenuDisclosure.onClose}
        >
          <DrawerOverlay />
          <DrawerContent width="90% !important">
            <DrawerBody>
              <VStack minH="100%" align="stretch">
                <HStack borderBottomWidth={1} borderColor="#ddd" p={4}>
                  <NextLink href="/text-size" passHref>
                    <Link fontSize="sm">
                      {getWording("header.font_size_level_label")}
                    </Link>
                  </NextLink>
                  <Box flex={1} minW={0} w="100%" />
                  {/* {isShowLangSwitcher && (

                  )} */}
                  <Select
                      border="none"
                      size="sm"
                      w={16}
                      variant="flushed"
                      value={router.locale}
                      onChange={(e) => {
                        window.location.href = `/${e.target.value}${router.asPath}`;
                      }}
                    >
                      <option value="zh">繁</option>
                      <option value="en">EN</option>
                    </Select>
                  <Text>
                    {(navigation.social ?? []).map(
                      ({ icon, url, label }, i) => {
                        return (
                          <a key={i} href={url}>
                            <Image
                              alt={label}
                              display="inline-flex"
                              height="25px"
                              src={icon}
                            />
                          </a>
                        );
                      }
                    )}
                  </Text>
                  <Popover placement="bottom-end" gutter={20}>
                    <PopoverTrigger>
                      <Button
                        aria-label={
                          router?.locale === "en"
                            ? "User Management"
                            : "用戶管理"
                        }
                        variant="unstyled"
                      >
                        <Avatar size="xs"></Avatar>
                      </Button>
                    </PopoverTrigger>
                    {!isLoggedIn ? (
                      <PopoverContent p={3} w={48}>
                        <VStack align="stretch">
                          <Button
                            variant="link"
                            onClick={() => {
                              mobileMenuDisclosure.onClose();
                              loginModalDisclosure.onOpen();
                            }}
                          >
                            {getWording("header.login_label")}
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => {
                              mobileMenuDisclosure.onClose();
                              registerModalDisclosure.onOpen();
                            }}
                          >
                            {getWording("header.register_label")}
                          </Button>
                        </VStack>
                      </PopoverContent>
                    ) : (
                      <PopoverContent p={3} w={72}>
                        <VStack align="stretch" spacing={4}>
                          {
                            <VStack spacing={2} align="stretch">
                              <Text my={1} fontWeight="bold">
                                {getWording("header.identity_subheading")}
                              </Text>
                              <VStack
                                maxH={300}
                                overflow="auto"
                                align="stretch"
                              >
                                {(user?.identities ?? []).map((identity) => (
                                  <HStack
                                    key={identity.id}
                                    _hover={{ bg: "gray.50" }}
                                    cursor="pointer"
                                    p={2}
                                    spacing={4}
                                    onClick={() =>
                                      onIdentitySwitch(identity.id)
                                    }
                                  >
                                    {/* <Avatar size="sm"></Avatar> */}
                                    <VStack
                                      align="start"
                                      spacing={0}
                                      flex={1}
                                      minW={0}
                                      w="100%"
                                    >
                                      <Text fontSize="md">
                                        {identity.chineseName}
                                      </Text>
                                      <Text color="gray.500" fontSize="sm">
                                        {
                                          EnumIdentityTypeList.filter(
                                            (data) => data.key === identity.type
                                          )[0]?.value[router.locale]
                                        }
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
                              <Link href="/user/identity/select">
                                <Button
                                  size="sm"
                                  mt={4}
                                  w="100%"
                                  alignSelf="center"
                                  variant="ghost"
                                  color="gray.500"
                                  textAlign="center"
                                >
                                  {getWording("header.add_identity_label")}
                                </Button>
                              </Link>
                              <Divider />
                              <VStack mt={2} align="stretch" spacing={2}>
                                <NextLink passHref href="/user/account">
                                  <Link>
                                    {getWording("header.account_setting_label")}
                                  </Link>
                                </NextLink>
                                <Link onClick={onLogout}>
                                  {getWording("header.logout_label")}
                                </Link>
                              </VStack>
                            </VStack>
                          }
                        </VStack>
                      </PopoverContent>
                    )}
                  </Popover>
                </HStack>

                <Accordion
                  defaultIndex={[0, 1, 2, 3, 4, 5, 6, 7]}
                  flex={1}
                  minH={0}
                  h="100%"
                >
                  <VStack my={12} align="start" spacing={8} overflow="auto">
                    {(navigation.menu ?? []).map(
                      ({ id, submenu = [], label, path = "/" }, index) =>
                        submenu?.length > 0 ? (
                          <AccordionItem
                            w="100%"
                            key={id}
                            trigger="hover"
                            gutter={20}
                            border={0}
                          >
                            <AccordionButton
                              p={0}
                              bg="transparent"
                              textAlign="left"
                              _hover={{ bg: "transparent" }}
                              h="100%"
                            >
                              <Button
                                variant="unstyled"
                                _hover={{ bg: "transparent" }}
                                fontSize="2xl"
                                p={0}
                                bg="transparent"
                                borderRadius={0}
                                fontWeight="normal"
                                borderColor="transparent"
                                borderBottomWidth={3}
                                {...(Number(tabIndex) === index && {
                                  borderColor: "#00BFBA",
                                  fontWeight: "bold",
                                })}
                              >
                                {label}
                              </Button>
                            </AccordionButton>
                            <AccordionPanel padding="0px 0px 0px 20px">
                              <VStack
                                my={4}
                                fontSize="2xl"
                                align="start"
                                w="100%"
                                spacing={2}
                              >
                                {submenu.map(({ id: _id, label, path }) => (
                                  <NextLink key={_id} href={path}>
                                    <Button
                                      fontSize="xl"
                                      h="100%"
                                      variant="unstyled"
                                      borderRadius={0}
                                      fontWeight="normal"
                                      borderColor="transparent"
                                      onClick={mobileMenuDisclosure.onClose}
                                    >
                                      {label}
                                    </Button>
                                  </NextLink>
                                ))}
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        ) : (
                          <NextLink key={id} href={path}>
                            <Button
                              fontSize="2xl"
                              textAlign="left"
                              variant="unstyled"
                              borderRadius={0}
                              px={2}
                              fontWeight="normal"
                              borderColor="transparent"
                              {...(Number(tabIndex) === index && {
                                borderColor: "#00BFBA",
                                fontWeight: "bold",
                              })}
                              borderBottomWidth={3}
                              onClick={mobileMenuDisclosure.onClose}
                            >
                              {label}
                            </Button>
                          </NextLink>
                        )
                    )}
                    <NextLink
                      href={navigation?.actionButton?.path ?? "/"}
                      target="_blank"
                    >
                      <Button
                        fontSize="2xl"
                        textAlign="left"
                        variant="unstyled"
                        borderRadius={0}
                        px={2}
                        fontWeight="normal"
                        borderColor="transparent"
                        borderBottomWidth={3}
                        onClick={mobileMenuDisclosure.onClose}
                      >
                        {navigation?.actionButton?.label}
                      </Button>
                    </NextLink>
                  </VStack>
                </Accordion>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Box>
  );
};

export default withConfigurationCMS(
  withConfigurationCMS(
    withConfigurationCMS(Header, {
      key: "navigation",
      label: "導航 Navigation",
      fields: [
        {
          name: "title",
          label: "標題",
          component: "text",
        },
        {
          label: "Logo",
          name: "logo",
          component: "image",
          uploadDir: () => "/navigation",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "社會的 social",
          name: "social",
          component: "group-list",
          itemProps: (item) => ({
            key: item.id,
            label: item.label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              label: "圖標 Icon",
              name: "icon",
              component: "image",
              uploadDir: () => "/navigation",
              parse: ({ previewSrc }) => previewSrc,
              previewSrc: (src) => src,
            },
            {
              name: "url",
              label: "路由 Url",
              placeholder: "https://",
              component: "text",
            },
            {
              name: "label",
              label: "標籤",
              component: "text",
            },
          ],
        },
        {
          name: "menu",
          label: "Menu 導航",
          component: "group-list",
          itemProps: (item) => ({
            key: item.id,
            label: item.label,
          }),
          defaultItem: () => ({
            label: "Menu Item 導航項目",
            path: "",
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              label: "submenu 子導航",
              name: "submenu",
              component: "group-list",
              itemProps: (item) => ({
                key: item.id,
                label: item.label,
              }),
              defaultItem: () => ({
                label: "Submenu Item 子導航項目",
                path: "",
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  label: "路徑 Path",
                  name: "path",
                  component: "text",
                },
                {
                  label: "標籤 Label",
                  name: "label",
                  component: "text",
                },
              ],
            },
            {
              label: "路徑 Path",
              name: "path",
              component: "text",
            },
            {
              label: "標籤 Label",
              name: "label",
              component: "text",
            },
          ],
        },
        {
          name: "actionButton",
          label: "行動按鈕 Action Button",
          component: "group",
          fields: [
            {
              label: "路徑 Path",
              name: "path",
              component: "text",
            },
            {
              label: "標籤 Label",
              name: "label",
              component: "text",
            },
          ],
        },
      ],
    }),

    {
      key: "header",
      label: "頁首 Header",
      fields: [wordListFieldsForCMS({ name: "wordings" })],
    }
  ),
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
          label: label,
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
            component: "text",
            label: "分類名稱 Category Label",
          },
          {
            name: "bgColor",
            component: "color",
            label: "背景顏色 Background Color",
          },
          {
            name: "textColor",
            component: "color",
            label: "文字顏色 Foreground Color",
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

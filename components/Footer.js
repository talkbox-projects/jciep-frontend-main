import React from "react";
import { Divider, HStack, Text } from "@chakra-ui/layout";
import {
  Box,
  Button,
  Image,
  Link,
  SimpleGrid,
  Stack,
  VStack,
  Wrap,
  WrapItem,
  Flex
} from "@chakra-ui/react";
import withConfigurationCMS from "../utils/configuration/withConfigurationCMS";
import Container from "./Container";
import NextLink from "next/link";
import { useRouter } from "next/router";

const Footer = ({ footer }) => {
  const router = useRouter();
  const footerContentSize =
    router?.local === "zh" ? ["xl", "xl", "lg"] : ["lg", "lg", "md"];
  return (
    <Box py={8} backgroundColor="#FAFAFA">
      <Container>
        <VStack align="stretch">
          <VStack align="stretch" spacing={8}>
            {footer?.partnerSection?.map(({ id, title, partners = [] }) => {
              return (
                <Stack
                  spacing={4}
                  align={["start", "start", "center"]}
                  direction={["column", "column", "row", "row"]}
                  key={id}
                >
                  <Box w="150px" minW="150px" maxW="150px" color="gray.700">
                    {title}
                  </Box>
                  <Wrap spacing={4} align="center">
                    {(partners ?? []).map(
                      ({ id: _id, label, url, logo = "" }) => {
                        return (
                          <WrapItem spacing={0} pr={2} key={_id} maxH={1162}>
                            <Link href={url} key={_id}>
                              <Image
                                alt={label}
                                maxH={16}
                                h="100%"
                                src={logo}
                              />
                            </Link>
                          </WrapItem>
                        );
                      }
                    )}
                  </Wrap>
                </Stack>
              );
            })}
          </VStack>
          <Divider pt={8} borderColor="#EFEFEF" />
          <Stack
            pt={8}
            spacing={8}
            align={"start"}
            direction={["column", "column", "row", "row"]}
          >
            <Box>
              <Image alt="" maxW={150} src={footer?.logo} />
            </Box>

            <SimpleGrid
              flex={1}
              minW={0}
              w="100%"
              columns={[2, 2, 3, 5, 5]}
              gap={[8, 12]}
              padding="0 2%"
            >
              {(footer?.sitemap ?? []).map(
                ({ id, links = [], title, url = "/", social = [] }) => (
                  <VStack key={id} align="start">
                    {title && (
                      <NextLink href={url}>
                        <Button
                          textAlign="left"
                          variant="link"
                          color="black"
                          fontWeight="bold"
                          fontSize={footerContentSize}
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {title}
                        </Button>
                      </NextLink>
                    )}
                    <Flex gap={5} w="100%">
                      {(social ?? []).map(({ icon, id, url, label }) => {
                        return (
                          <a href={url} key={id}>
                            <Image
                              alt={label}
                              display="inline-flex"
                              src={icon}
                              w={label?.includes("w3c") ? "full" : "26px"}
                              h={"auto"}
                            />
                          </a>
                        );
                      })}
                    </Flex>

                    {(links ?? []).map(
                      ({ id: _id, url = "/", label = "" }, i) => {
                        return (
                          <NextLink id={_id} href={url} key={i}>
                            <Button
                              fontSize={footerContentSize}
                              textAlign="left"
                              variant="link"
                              fontWeight="normal"
                              color="black"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                            >
                              {label}
                            </Button>
                          </NextLink>
                        );
                      }
                    )}
                  </VStack>
                )
              )}
            </SimpleGrid>
          </Stack>

          <HStack pt={16} alignSelf="center">
            {footer?.links?.map(({ id, label, url = "/" }) => {
              return (
                <Link key={id} href={url} target="blank">
                  {label}
                </Link>
              );
            })}
          </HStack>
          <Text alignSelf="center">{footer?.copyright}</Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default withConfigurationCMS(Footer, {
  key: "footer",
  label: "頁尾 Footer",
  fields: [
    {
      name: "title",
      label: "title",
      component: "text",
    },

    {
      label: "計劃 Logo Programme Logo",
      name: "logo",
      component: "image",
      uploadDir: () => "/footer/logos",
      parse: ({ previewSrc }) => previewSrc,
      previewSrc: (src) => src,
    },

    {
      name: "partnerSection",
      label: "伙伴機構類型 Partners",
      component: "group-list",
      itemProps: ({ id: key, title: label }) => ({
        key,
        label,
      }),
      defaultItem: () => ({
        id: Math.random().toString(36).substr(2, 9),
      }),
      fields: [
        {
          name: "title",
          component: "text",
          label: "類型 Title",
        },
        {
          name: "partners",
          label: "伙伴機構",
          component: "group-list",
          itemProps: ({ id: key, label }) => ({
            key,
            label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              label: "圖標 Logo",
              name: "logo",
              component: "image",
              uploadDir: () => "/footer/logos",
              parse: ({ previewSrc }) => previewSrc,
              previewSrc: (src) => src,
            },
            {
              name: "url",
              label: "路由 Url",
              placeholder: "https://",
              component: "text",
            },
          ],
        },
      ],
    },

    {
      name: "sitemap",
      label: "網頁地圖 Sitemap",
      component: "group-list",
      itemProps: ({ id: key, title: label }) => ({
        key,
        label,
      }),
      defaultItem: () => ({
        id: Math.random().toString(36).substr(2, 9),
      }),
      fields: [
        {
          name: "title",
          component: "text",
          label: "標題 Title",
        },
        {
          name: "url",
          label: "路由 Url",
          placeholder: "https://",
          component: "text",
        },
        {
          name: "links",
          label: "鏈結 Links",
          component: "group-list",
          itemProps: ({ id: key, label }) => ({
            key,
            label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "url",
              label: "路由 Url",
              placeholder: "https://",
              component: "text",
            },
          ],
        },
        {
          name: "social",
          label: "社會的 Social",
          component: "group-list",
          itemProps: ({ id: key, label }) => ({
            key,
            label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              label: "圖標 Icon",
              name: "icon",
              component: "image",
              uploadDir: () => "/footer/icon",
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
      ],
    },

    {
      name: "links",
      label: "鏈結",
      component: "group-list",
      itemProps: ({ id: key, label }) => ({
        key,
        label,
      }),
      defaultItem: () => ({
        id: Math.random().toString(36).substr(2, 9),
      }),
      fields: [
        {
          name: "label",
          label: "標籤 Label",
          component: "text",
        },
        {
          name: "url",
          label: "路由 Url",
          placeholder: "https://",
          component: "text",
        },
      ],
    },
    {
      name: "copyright",
      label: "版權聲明",
      component: "text",
    },
  ],
});

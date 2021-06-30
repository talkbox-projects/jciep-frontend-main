import { HStack } from "@chakra-ui/layout";
import { Box, Image, Link, Stack, VStack } from "@chakra-ui/react";
import withConfigurationCMS from "../utils/configuration/withConfigurationCMS";
import Container from "./Container";

const Footer = ({ footer }) => {
  return (
    <Box py={8}>
      <Container>
        <VStack align="stretch">
          <VStack align="stretch" spacing={8}>
            {footer?.partnerSection?.map(({ id, title, partners = [] }) => {
              return (
                <Stack
                  spacing={4}
                  align="center"
                  direction={["column", "column", "row", "row"]}
                  key={id}
                >
                  <Box w="150px" color="gray.500">
                    {title}
                  </Box>
                  <HStack spacing={8} maxH={12} align="center">
                    {(partners ?? []).map(
                      ({ id: _id, label, url, logo = "" }) => {
                        return (
                          <Link href={url} key={_id}>
                            <Image alt={label} maxH={12} h="100%" src={logo} />
                          </Link>
                        );
                      }
                    )}
                  </HStack>
                </Stack>
              );
            })}
          </VStack>
        </VStack>
        {JSON.stringify({ footer })}
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

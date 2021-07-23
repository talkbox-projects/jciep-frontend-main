import React from "react";
import { VStack, Box, Text } from "@chakra-ui/layout";
import {
  Image,
  Container,
  Stack,
  Flex,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import DividerA from "../../components/DividerA";
import HighlightHeadline from "../../components/HighlightHeadline";
import contactUsFieldsForCMS from "../../utils/tina/contactUsFieldsForCMS";
import wordExtractor from "../../utils/wordExtractor";

const PAGE_KEY = "contactUs";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isShowLangSwitcher: true,
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

const ContactUs = ({ page }) => {
  return (
    <VStack w="100%" align="stretch" spacing={0}>
      <Box
        minH={["50vh", "70vh"]}
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundColor={page?.content?.banner?.bgColor}
        // backgroundImage={`url(${page?.content?.banner?.bgImageMain})`}
        backgroundSize="cover"
        backgroundPosition="center center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Container>
          <Image src={page?.content?.banner?.bgImageMain} />
        </Container>
        <Image
          position="absolute"
          bottom="-74px"
          left={["0", "0", "0", "0", "149"]}
          src={page?.content?.banner?.bgImageLeft}
          h={["0%", "0%", "200px", "200px", "306px"]}
          w="auto"
          maxW="334"
          zIndex="2"
        />
        <Image
          position="absolute"
          bottom="-27px"
          right={["20px", "20px", "0", "0", "100"]}
          src={page?.content?.banner?.bgImageRight}
          h={["142px", "142px", "200px", "200px", "306px"]}
          w="auto"
          maxW="551"
          zIndex="2"
        />
        <Box pos="absolute" bottom="-1px" w="100%">
          <DividerA
            primaryColor="rgb(252,181,48)"
            secondaryColor="rgb(255,255,255)"
            nextColor="rgb(32,191,186)"
          />
        </Box>
      </Box>

      <Box
        bg={page?.content?.contactSection?.bgColor}
        w="100%"
        justifyContent="center"
        alignItems="center"
        py={16}
      >
        <Container
          maxW={["100%", "100%", "container.lg"]}
          justifyContent="center"
        >
          <VStack spacing={8}>
            <HighlightHeadline bgColor="#fff">
              {page?.content?.contactSection?.title}
            </HighlightHeadline>
            <Text textAlign="center" fontSize="xl">
              {page?.content?.contactSection?.description}
            </Text>

            <Box
              bg={page?.content?.contactSection?.contactInfo?.bgColor}
              p={[4, 8]}
              borderRadius="xl"
              w="100%"
              zIndex={10}
            >
              <SimpleGrid columns={[1, 1, 2, 2]} spacing={4}>
                <Box>
                  <Image
                    src={page?.content?.contactSection?.contactInfo?.logo}
                  />
                  <Text mt={4}>
                    {page?.content?.contactSection?.contactInfo?.title}
                  </Text>
                </Box>
                <Stack color="gray.600">
                  <Flex>
                    <Text minW="15%">
                      {wordExtractor(
                        page?.content?.wordings,
                        "contactUs_address"
                      )}
                    </Text>
                    <Text>
                      {page?.content?.contactSection?.contactInfo?.address}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text minW="15%">
                      {wordExtractor(
                        page?.content?.wordings,
                        "contactUs_email"
                      )}
                    </Text>
                    <Link
                      href={`mailto:${page?.content?.contactSection?.contactInfo?.email}`}
                    >
                      {page?.content?.contactSection?.contactInfo?.email}
                    </Link>
                  </Flex>
                  <Flex>
                    <Text minW="15%">
                      {wordExtractor(
                        page?.content?.wordings,
                        "contactUs_phone"
                      )}
                    </Text>
                    <Text>
                      {page?.content?.contactSection?.contactInfo?.phone}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text minW="15%">
                      {wordExtractor(page?.content?.wordings, "contactUs_fax")}
                    </Text>
                    <Text>
                      {page?.content?.contactSection?.contactInfo?.fax}
                    </Text>
                  </Flex>
                </Stack>
              </SimpleGrid>
              {page?.content?.contactSection?.contactInfo?.facebookPage && (
                <Box mt={4}>
                  <iframe
                    src={`https://www.facebook.com/plugins/page.php?href=${page?.content?.contactSection?.contactInfo?.facebookPage}&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                    width="340"
                    height="130"
                    style={{
                      border: "none",
                      overflow: "hidden",
                      maxWidth: "100%",
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen="true"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                </Box>
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
    </VStack>
  );
};

export default withPageCMS(ContactUs, {
  key: PAGE_KEY,
  fields: contactUsFieldsForCMS,
});

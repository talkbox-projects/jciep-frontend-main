import React from "react";
import { useRouter } from "next/router";
import { VStack, Box, Text, Grid } from "@chakra-ui/layout";
import { Image, chakra, Container, Heading } from "@chakra-ui/react";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import pwdFieldsForCMS from "../../utils/tina/pwdFieldsForCMS";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import DividerA from "../../components/DividerA";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import HighlightHeadline from "../../components/HighlightHeadline";
import Anchor from "../../components/Anchor";
import contactUsFieldsForCMS from "../../utils/tina/contactUsFieldsForCMS";

const PAGE_KEY = "contactUs";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

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

const ContactUs = ({ page }) => {
  const router = useRouter();

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
        {/* <Image
          position="absolute"
          bottom="-1px"
          src={page?.content?.banner?.bgImageBottom}
          width="100%"
          fit="contain"
        /> */}
      </Box>

      <Box
        bg={page?.content?.contactSection?.bgColor}
        w="100%"
        justifyContent="center"
        alignItems="center"
        p={16}
      >
        <Container maxW="container.lg" justifyContent="center">
          <VStack spacing={8}>
            <HighlightHeadline bgColor="#fff">
              {page?.content?.contactSection?.title}
            </HighlightHeadline>
            <Text fontSize="xl">
              {page?.content?.contactSection?.description}
            </Text>
            <Box
              bg={page?.content?.contactSection?.contactInfo?.bgColor}
              p={8}
              borderRadius="xl"
              w="100%"
              zIndex={10}
            >
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="340"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen="true"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Excerpt Section */}
      {/* <Box
        bg={page?.content?.excerpt?.bgColor}
        w="100%"
        paddingTop={["59px", "59px", "151px"]}
        paddingBottom={["56px", "56px", "80px"]}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        zIndex="-2"
      >
        <Box position="relative" mb="34px" mx={["47px", "47px", "5%"]}>
          <ApostropheHeadline fontSize={["xl", "4xl"]}>
            {page?.content?.excerpt?.tagline}
          </ApostropheHeadline>
        </Box>

        <Box
          padding={["16px", "16px", "41px 42px"]}
          mx={["16px", "16px", "0px"]}
          mt={["17px", "17px", "24.31px"]}
          maxW="936px"
          background="#fff"
          borderRadius="22px"
        >
          <MultiTextRenderer
            textAlign="center"
            fontSize={["16", "16", "24"]}
            data={page?.content?.excerpt?.content}
          />
        </Box>
      </Box> */}

      {/* PWDs List */}
      {/* <Anchor id="list" />
      <Box
        bg={page?.content?.pwdList?.bgStyle?.bgColor}
        w="100%"
        pt={["36px", "36px", "53px"]}
        overflow="hidden"
        position="relative"
      >
        <Box
          textAlign="center"
          pos="relative"
          fontSize={["24", "30", "36"]}
          w={["fit-content"]}
          mx={["50", "auto"]}
        >
          <Box pos="relative">
            <HighlightHeadline bgColor="#fff">
              {page?.content?.pwdList?.title}
            </HighlightHeadline>
          </Box>
        </Box>

        <Grid
          pos="relative"
          zIndex="10"
          templateColumns={[
            "repeat(2, 136px)",
            "repeat(2, 136px)",
            "repeat(2, 296px)",
            "repeat(3, 296px)",
          ]}
          gap={["16px", "16px", "24px"]}
          mt={["36px", "56px"]}
          justifyContent="center"
        >
          {(page?.content?.pwdList?.pwds ?? []).map((data, i) => (
            <Box
              key={i}
              w="100%"
              h={["132px", "132px", "122px"]}
              transition="all 0.2s"
              bg={["#fff", "#fff", "#fff", "rgba(255, 255, 255, 0.3)"]}
              boxShadow={["lg", "lg", "lg", "none"]}
              borderRadius="10px"
              cursor="pointer"
              _hover={{
                background: "#fff",
                boxShadow: "lg",
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              px="12px"
              onClick={() =>
                router.push(`people-with-disabilities/${data.slug}`)
              }
              zIndex={1}
            >
              <Image src={data.icon} h="48px" w="48px" />
              <Text
                fontWeight="bold"
                fontSize={["16px", "16px", "24px"]}
                textAlign="center"
              >
                {data.name}
              </Text>
            </Box>
          ))}
        </Grid>

        <Image
          pos="absolute"
          src={page?.content?.pwdList?.bgStyle?.bgGradient1}
          bottom={0}
          right={0}
        />
        <Box pos="relative" pb={["124px", "124px", "380px"]}>
          <Image
            pos="absolute"
            right={["22px", "35px", "35px", "81px"]}
            bottom="0"
            h={["124px", "135px", "300px", "380px"]}
            width={["248px", "270px", "600px", "749px"]}
            src={page?.content?.pwdList?.bgStyle?.bottomImage}
            zIndex="1"
          />
          <Box pos="absolute" bottom="0" w="100%">
            <DividerA
              primaryColor="rgb(0,191,186)"
              secondaryColor="rgb(198,198,198)"
              nextColor="#fff"
            />
          </Box>
        </Box>
      </Box> */}
    </VStack>
  );
};

export default withPageCMS(ContactUs, {
  key: PAGE_KEY,
  fields: contactUsFieldsForCMS,
});

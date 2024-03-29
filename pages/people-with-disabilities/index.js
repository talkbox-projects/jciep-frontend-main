import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  VStack,
  Box,
  Text,
  Grid,
  AspectRatio,
  Container,
} from "@chakra-ui/layout";
import NextLink from "next/link";
import { Image, Link } from "@chakra-ui/react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import pwdFieldsForCMS from "../../utils/tina/pwdFieldsForCMS";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import DividerA from "../../components/DividerA";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import HighlightHeadline from "../../components/HighlightHeadline";
import Anchor from "../../components/Anchor";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { getYoutubeLink } from "../../utils/general";
import wordExtractor from "../../utils/wordExtractor";

const PAGE_KEY = "pwd";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale
    },
  };
};

const PwdMain = ({ page, lang }) => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      document.querySelector(`[data-tag='${hash}']`).scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [router]);

  return (
    <VStack w="100%" align="stretch" spacing={0}>
      <Box
        minH={["80vh", "100vh"]}
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundColor={page?.content?.banner?.bgColor}
        backgroundImage={`url(${page?.content?.banner?.bgImageMain})`}
        backgroundSize="cover"
        backgroundPosition="center center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        zIndex="-1"
        justifyContent="center"
      >
        <Box mb="43px" position="relative" zIndex={10}>
          <Text textAlign="center" fontSize={["16", "16", "24", "24"]}>
            {page?.content?.banner?.reference}
          </Text>
          <MultiTextRenderer
            textAlign="center"
            fontSize={["24", "24", "56", "56"]}
            data={page?.content?.banner?.quote}
            parentStyles={{ zIndex: "1" }}
          />
          <Box
            position="absolute"
            bottom={["1", "1", "2", "2"]}
            right={["-1", "-1", "-3", "-3"]}
            pt={["0", "0", "6", "6"]}
            pb="5"
            background="#fff"
            w={["110px", "110px", "250px", "250px"]}
            zIndex="-1"
          />
        </Box>
        <Image
          alt=""
          position="absolute"
          bottom="-74px"
          left={["0", "0", "0", "0", "149"]}
          src={page?.content?.banner?.bgImageLeft}
          h={["0%", "0%", "300px", "388px"]}
          w="auto"
          maxW="334"
          zIndex="1"
        />
        <Image
          alt=""
          position="absolute"
          bottom="-27px"
          right={["20px", "20px", "0", "0", "100"]}
          src={page?.content?.banner?.bgImageRight}
          h={["142px", "142px", "200px", "200px", "306px"]}
          w="auto"
          maxW="551"
          zIndex="1"
        />
        <Image
          alt=""
          position="absolute"
          bottom="-1px"
          src={page?.content?.banner?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Excerpt Section */}
      <Box
        bg={page?.content?.excerpt?.bgColor}
        w="100%"
        paddingTop={["59px", "59px", "151px"]}
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
      </Box>

      <Box
        bg={page?.content?.excerpt?.bgColor}
        w="100%"
        paddingBottom={["56px", "56px", "80px"]}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Container maxWidth={"966px"} pt={12} position="relative">
          <Box w="100%" border={"6px solid #fff"} borderRadius="22px" p={4} bgColor={'#FFF'}>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={getYoutubeLink(
                  wordExtractor(page?.content?.wordings, "youtube_link")
                )}
                w="100%"
              />
            </AspectRatio>
          </Box>
        </Container>
      </Box>

      {/* PWDs List */}
      <Anchor id="list" />
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
            <NextLink
              key={i}
              passHref
              href={`people-with-disabilities/${data.slug?.replaceAll(' ','-').toLowerCase()}`}
            >
              <Link>
                <Box
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
                  // onClick={() => router?.push()}
                  zIndex={1}
                >
                  <Image alt={data?.name} src={data?.icon} h="48px" w="48px" />
                  <Text
                    fontWeight="bold"
                    fontSize={lang === 'zh' ? ["16px", "16px", "24px"] : ["12px", "14px", "18px"]}
                    textAlign="center"
                  >
                    {data?.name}
                  </Text>
                </Box>
              </Link>
            </NextLink>
          ))}
        </Grid>

        <Image
          alt=""
          pos="absolute"
          src={page?.content?.pwdList?.bgStyle?.bgGradient1}
          bottom={0}
          right={0}
        />
        <Box pos="relative" pb={["124px", "124px", "380px"]}>
          <Image
            alt=""
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
      </Box>
    </VStack>
  );
};

export default withPageCMS(PwdMain, {
  key: PAGE_KEY,
  fields: pwdFieldsForCMS,
});

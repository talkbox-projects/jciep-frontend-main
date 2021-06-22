import { useRouter } from "next/router";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import programmeFieldsForCMS from "../../../utils/tina/programmeFieldsForCMS";
import { Box, Text, Image, chakra, Heading } from "@chakra-ui/react";
import { SimpleGrid, GridItem } from "@chakra-ui/layout";
import { VStack, Flex, HStack } from "@chakra-ui/layout";
import MultiTextRenderer from "../../../components/MultiTextRenderer";
import Accordian from "./../../../components/Acordian";
import BorderedTitle from "./../../../components/BorderedTitle";
const PAGE_KEY = "programme";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const Partner = ({ page }) => {
  const router = useRouter();
  const slug = router.query.slug;
  const partner = (page?.content?.partnerSection?.partners ?? [])?.find((x) => x.slug === slug);
  return (
    <VStack w="100%" spacing={0} align="stretch">
      {/* Banner Section */}

      <Box
        h="calc(50vw - 55px)"
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundImage={`url(${page?.content?.partnerSection?.slugBannerSection?.image})`}
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        display="flex"
        flexDirection="column"
        alignItems="center"
        zIndex="-1"
      >
        <Box position="absolute" left={["5%", "10%", "15%"]} bottom={["40%"]}>
          <MultiTextRenderer
            bgColor="#F6D644"
            fontSize={["24px", "56px"]}
            data={page?.content?.partnerSection?.slugBannerSection?.title}
          />
        </Box>
        <Image
          position="absolute"
          bottom="-1px"
          src={page?.content?.partnerSection?.slugBannerSection?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Plan Section */}
      <Box
        // h="calc(50vw - 80px)"
        minH="70vh"
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundImage={`url(${page?.content?.partnerSection?.planSection?.image})`}
        backgroundSize="cover"
        backgroundPosition="center center"
        display="flex"
        pt={["36px", "48px"]}
        flexDirection="column"
        alignItems="center"
        zIndex="-1"
      >
        <Box position="relative" mb="34px" mx={["47px", "47px", "0px"]}>
          <Text fontSize={["16", "16", "24"]} textAlign="center">
            {page?.content?.partnerSection?.planSection?.title}
          </Text>
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            right={["-6", "-6", "-12"]}
            bottom="-3"
            background="#F6D644"
            transform="rotate(30deg)"
          />
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            left={["-6", "-6", "-12"]}
            bottom="-3"
            background="#F6D644"
            transform="rotate(-30deg)"
          />
        </Box>
        <Box display="flex" justifyContent="center" pt="48px">
          <SimpleGrid justifyContent="center" columns={[1, 1, 2, 2]}>
            {(partner?.projectObjective ?? []).map(({ content }, index) => {
              return (
                <GridItem pt={["20px", ""]} key={index}>
                  <HStack justifyContent="center" alignItems="center">
                    <Image w="50px" src={page?.content?.partnerSection?.planSection?.objectiveIcon} />
                    <Text fontWeight="bold" w={["70%", "50%"]}>
                      {content}
                    </Text>
                  </HStack>
                </GridItem>
              );
            })}
          </SimpleGrid>
        </Box>
        <Image
          position="absolute"
          bottom="-1px"
          src={page?.content?.partnerSection?.planSection?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Services Highlights*/}
      <Box
        minH="70vh"
        w="100%"
        position="relative"
        bg={page?.content?.partnerSection?.serviceSection?.bgColor}
        display="flex"
        flexDirection="column"
        alignItems="center"
        zIndex="0"
        pt="16"
      >
        <Box position="relative" mb="34px" mx={["47px", "47px", "0px"]}>
          <Text fontSize={["16", "16", "24"]} textAlign="center">
            {page?.content?.partnerSection?.serviceSection?.title}
          </Text>
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            right={["-6", "-6", "-12"]}
            bottom="-3"
            background="#F6D644"
            transform="rotate(30deg)"
          />
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            left={["-6", "-6", "-12"]}
            bottom="-3"
            background="#F6D644"
            transform="rotate(-30deg)"
          />
        </Box>
        <Box zIndex="10000" w={["80%", "65%", "55%", "45%"]} pt="36px">
          {(partner?.serviceHighlights[0].sections ?? []).map(({ title, content }, index) => {
            return (
              <Accordian
                textAlign="center"
                title={title}
                boldTitle
                description={content}
                multi={true}
                key={index}
                bgColor="#FFFFFF"
              />
            );
          })}
        </Box>
        <Image
          pos="absolute"
          left={["5%", "10%", "15%"]}
          bottom="0"
          width={["20%", "35%", "25%", "15%"]}
          src={page?.content?.partnerSection?.serviceSection?.bgImageLeft}
          zIndex="1"
        />
        <Image
          pos="absolute"
          right={["5%", "5%", "10%"]}
          bottom={["5%", "10%"]}
          width={["20%", "35%", "180px", "208px"]}
          src={page?.content?.partnerSection?.serviceSection?.bgImageRight}
          zIndex="-1"
        />
        <Image
          position="absolute"
          bottom="-1px"
          src={page?.content?.partnerSection?.serviceSection?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Service Targets */}
      <Box bg={page?.content?.partnerSection?.serviceTarget?.bgColor}>
        <VStack w="100%">
          <BorderedTitle
            title={page?.content?.partnerSection?.serviceTarget?.title}
            color={page?.content?.partnerSection?.serviceTarget?.titleColor}
            mobileWidth="40%"
            right="30%"
            width={["0%", "106%"]}
          />
        </VStack>
        <HStack justifyContent="center" w="100%" pt="56px">
          <SimpleGrid justifyContent="center" w="60%" gap="36px" columns={[2, 2, 4, 4]}>
            {(partner?.serviceTargets ?? []).map(({ label, description, image }, index) => {
              return (
                <VStack>
                  <Image w="150px" src={image} />
                  <Text textAlign="center" w="150px" fontSize="2xl" fontWeight="semibold">
                    {label}
                  </Text>
                </VStack>
              );
            })}
          </SimpleGrid>
        </HStack>

        <Flex px={["12", "36", "56"]} wrap="wrap" pt={["16", "36"]}>
          <VStack bg="white" w={["100%", "50%"]}>
            <Image w="150px" src={partner?.contact?.logo} />
            <Text>{partner?.contact?.label}</Text>
          </VStack>
          <VStack bg="white" pt={["10px", ""]} w={["100%", "50%"]}>
            <Text w="100%">{partner?.contact?.address}</Text>
            <Text w="100%">{partner?.contact?.email}</Text>
            <Text w="100%">{partner?.contact?.phone}</Text>
            <Text w="100%">{partner?.contact?.fax}</Text>
          </VStack>
        </Flex>
      </Box>
    </VStack>
  );
};

export default withPageCMS(Partner, {
  key: PAGE_KEY,
  fields: programmeFieldsForCMS,
});

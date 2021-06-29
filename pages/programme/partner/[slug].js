import React from "react";

import { useRouter } from "next/router";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import programmeFieldsForCMS from "../../../utils/tina/programmeFieldsForCMS";
import {
  Box,
  Text,
  Image,
  chakra,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
} from "@chakra-ui/react";
import { SimpleGrid, GridItem } from "@chakra-ui/layout";
import { VStack, Flex, HStack, Stack } from "@chakra-ui/layout";
import MultiTextRenderer from "../../../components/MultiTextRenderer";
import Accordian from "./../../../components/Acordian";
import wordExtractor from "../../../utils/wordExtractor";
import { AiOutlinePlus } from "react-icons/ai";
import Container from "../../../components/Container";
const PAGE_KEY = "programme";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
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

const Partner = ({ page }) => {
  const router = useRouter();
  const slug = router.query.slug;
  const partner = (page?.content?.partnerSection?.partners ?? [])?.find(
    (x) => x.slug === slug
  );

  return (
    <VStack overflowY="visible" w="100%" spacing={0} align="stretch">
      {/* Banner Section */}

      <Box
        h="calc(50vw - 40px)"
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundImage={`url(${partner?.image})`}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        display="flex"
        flexDirection="column"
        alignItems="center"
        zIndex="-1"
      >
        <Box position="absolute" left={["5%", "10%", "15%"]} bottom={["40%"]}>
          <Box>
            <Text
              fontWeight="bold"
              bgColor="#F6D644"
              fontSize={["12px", "16px", "24px", "56px"]}
              children={partner?.agencyName}
            />
          </Box>
          <Box>
            <Text
              bgColor="#F6D644"
              fontSize={["12px", "16px", "24px", "56px"]}
              children={partner?.projectName}
            />
          </Box>
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
      <Box zIndex="-11" bg="#FAFAFA">
        <Box
          w="100%"
          position="relative"
          overflowY="visible"
          backgroundImage={`url(${page?.content?.partnerSection?.planSection?.image})`}
          backgroundSize={["300%", "cover"]}
          backgroundRepeat="no-repeat"
          backgroundPosition={["", "", "center"]}
          display="flex"
          pt={["36px", "48px"]}
          flexDirection="column"
          alignItems="center"
          zIndex="-1"
          pb="20%"
        >
          <Box position="relative" mx={["47px", "47px", "0px"]}>
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
          <Box display="flex" justifyContent="center" pt={["24px", "48px"]}>
            <SimpleGrid justifyContent="center" columns={[1, 1, 2, 2]}>
              {(partner?.projectObjective ?? []).map(({ content }, index) => {
                return (
                  <GridItem pt={["20px", ""]} key={index}>
                    <Stack
                      direction={["column", "column", "row"]}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image
                        w="38px"
                        w="34px"
                        src={
                          page?.content?.partnerSection?.planSection
                            ?.objectiveIcon
                        }
                      />
                      <Text
                        pl={["", "", "16px"]}
                        fontWeight="bold"
                        fontSize={["", "", "20px"]}
                        w={["70%", "50%"]}
                      >
                        {content}
                      </Text>
                    </Stack>
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
      </Box>
      {/* Services Highlights*/}
      <Box
        w="100%"
        minH="70vh"
        position="relative"
        bg={page?.content?.partnerSection?.serviceSection?.bgColor}
        display="flex"
        flexDirection="column"
        alignItems="center"
        zIndex="0"
        pt="16"
        pb="8%"
      >
        {partner?.serviceHighlights &&
          Object.keys(partner.serviceHighlights).map((key) => {
            return (
              <>
                <Box pos="relative" mb="34px" mx={["47px", "47px", "0px"]}>
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize={["16", "16", "24"]}
                      textAlign="center"
                    >
                      {partner?.serviceHighlights[key].audience}
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
                </Box>
                <Accordion defaultIndex={[0]} as={VStack} align="stretch">
                  {(partner?.serviceHighlights[key]?.sections ?? []).map(
                    ({ title, content }, index) => {
                      return (
                        <AccordionItem borderRadius={16} key={index} bg="white">
                          <AccordionButton
                            w="100%"
                            textAlign="center"
                            lineHeight={2}
                            fontWeight="bold"
                            fontSize="md"
                          >
                            <HStack w="100%">
                              <Text
                                flex={1}
                                minW={0}
                                w="100%"
                                textAlign="center"
                              >
                                {title}
                              </Text>
                              <Icon as={AiOutlinePlus} fontSize="2xl" />
                            </HStack>
                          </AccordionButton>
                          <AccordionPanel p={4}>
                            <MultiTextRenderer data={content} />
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    }
                  )}
                </Accordion>
              </>
            );
          })}

        <Image
          pos="absolute"
          left={["5%", "10%", "15%"]}
          bottom="0"
          width={["0%", "0%", "25%", "15%"]}
          src={page?.content?.partnerSection?.serviceSection?.bgImageLeft}
          zIndex="1"
        />
        <Image
          pos="absolute"
          right={["5%", "5%", "10%"]}
          bottom={["0", "0", "5%", "10%"]}
          width={["35%", "35%", "180px", "208px"]}
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
          <chakra.span
            fontSize={["22px", "30px", "36px"]}
            textAlign="center"
            fontWeight="semibold"
            pos="relative"
            lineHeight="1.5"
            backgroundImage="linear-gradient(#F6D644, #F6D644)"
            backgroundRepeat="no-repeat"
            backgroundPosition="0 0.8em"
            pl="15px"
            pr="15px"
          >
            {page?.content?.partnerSection?.serviceTarget?.title}
          </chakra.span>
        </VStack>
        <HStack justifyContent="center" w="100%" pt="56px" pb="72px">
          <SimpleGrid
            justifyContent="center"
            w="60%"
            gap="36px"
            columns={[2, 2, 4, 4]}
          >
            {(partner?.serviceTargets ?? []).map(
              ({ label, description, image }, index) => {
                return (
                  <VStack>
                    <Image w="150px" src={image} />
                    <Text
                      textAlign="center"
                      w={["100%", "100%", "150px"]}
                      fontSize={["xl", "2xl"]}
                      fontWeight="semibold"
                    >
                      {label}
                    </Text>
                  </VStack>
                );
              }
            )}
          </SimpleGrid>
        </HStack>

        <Container maxW={1200} mb={8}>
          <SimpleGrid
            columns={[1, 1, 2, 2]}
            spacing={8}
            dir={["column", "column", "row", "row"]}
            bg="white"
            p={8}
            w="100%"
            align="top"
          >
            <VStack as={GridItem} align="start">
              <Image w="310px" src={partner?.contact?.logo} />
              <Text>{partner?.contact?.label}</Text>
            </VStack>
            <VStack as={GridItem} align="stretch">
              {(partner?.contact?.fields ?? []).map(({ id, label, data }) => (
                <HStack align="start" w="100%" key={id}>
                  <Text
                    w={24}
                    lineHeight={1.5}
                    fontWeight="bold"
                    color="#666666"
                  >
                    {label}
                  </Text>
                  <Text
                    flex={1}
                    minW={0}
                    lineHeight={1.5}
                    w={"100%"}
                    color="#666666"
                  >
                    {data}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </VStack>
  );
};

export default withPageCMS(Partner, {
  key: PAGE_KEY,
  fields: programmeFieldsForCMS,
});

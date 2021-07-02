import React from "react";
import DividerSimple from "../../../components/DividerSimple";
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
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import { SimpleGrid, GridItem } from "@chakra-ui/layout";
import { VStack, Flex, HStack, Stack } from "@chakra-ui/layout";
import MultiTextRenderer from "../../../components/MultiTextRenderer";
import Accordian from "./../../../components/Acordian";
import wordExtractor from "../../../utils/wordExtractor";
import {
  AiOutlineInfoCircle,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import Container from "../../../components/Container";
import ApostropheHeadline from "../../../components/ApostropheHeadline";
import HighlightHeadline from "../../../components/HighlightHeadline";
import DividerTriple from "../../../components/DividerTriple";
import DividerA from "../../../components/DividerA";
const PAGE_KEY = "programme";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {},
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
      {/* First Section */}
      <Box
        h="50vw"
        minH={["40vh", "70vh"]}
        position="relative"
        overflow="hidden"
        backgroundImage={`url(${partner?.image})`}
        backgroundSize="cover"
        backgroundPosition="center center"
      >
        <VStack
          // zIndex={10}
          align="stretch"
          position="absolute"
          bottom={0}
          w="100%"
          textAlign="center"
          // backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.8))"
        >
          <Container>
            <Box pb={16}>
              <VStack align="start" spacing={0}>
                <Box>
                  <Text
                    fontWeight={900}
                    bgColor="#F6D644"
                    fontSize={["24px", "56px"]}
                    children={partner?.agencyName}
                  />
                </Box>
                <Box>
                  <Text
                    bgColor="#F6D644"
                    fontSize={["24px", "56px"]}
                    children={partner?.projectName}
                  />
                </Box>
              </VStack>
            </Box>
          </Container>
          <DividerSimple />
        </VStack>
      </Box>

      {/* Plan Section */}
      <Box
        bgImage={`url(${page?.content?.partnerSection?.planSection?.image})`}
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        position="relative"
        bgColor="#fafafa"
        backgroundPosition="left bottom"
      >
        <Container
          // zIndex={200}
          position="relative"
          pt={24}
          pb={[64, 64, 64, 24]}
        >
          <VStack spacing={8}>
            <ApostropheHeadline color="#F6D644">
              {page?.content?.partnerSection?.planSection?.title}
            </ApostropheHeadline>
            <SimpleGrid
              px={[8, 8, 4, 4]}
              py={[8, 16]}
              justifyContent="center"
              columns={[1, 1, 1, 2]}
              spacing={8}
            >
              {(partner?.projectObjective ?? []).map(({ content }, index) => {
                return (
                  <GridItem w="100%" key={index}>
                    <Stack
                      w="100%"
                      spacing={[8, 8, 4]}
                      direction={["column", "column", "row"]}
                      alignItems="center"
                      textAlign={["center", "left", "left"]}
                    >
                      <Image
                        w={[12, 8, 8, 8]}
                        src={
                          page?.content?.partnerSection?.planSection
                            ?.objectiveIcon
                        }
                      />
                      <Text
                        lineHeight={1.5}
                        w="100%"
                        minW={0}
                        flex={1}
                        fontWeight="bold"
                        fontSize="xl"
                      >
                        {content}
                      </Text>
                    </Stack>
                  </GridItem>
                );
              })}
            </SimpleGrid>
          </VStack>
        </Container>
        <DividerA
          primaryColor="#f6d644"
          secondaryColor="#fff"
          nextColor="#00BFBA"
        />
        <Image
          position="absolute"
          bottom={0}
          src={page?.content?.partnerSection?.planSection?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Services Highlights*/}
      <Box
        position="relative"
        bg={page?.content?.partnerSection?.serviceSection?.bgColor}
      >
        <Container
          zIndex={10}
          position="relative"
          pt={24}
          pb={[64, 64, 64, 24]}
        >
          <VStack>
            {partner?.serviceHighlights &&
              Object.keys(partner.serviceHighlights).map((key) => {
                return (
                  <>
                    <Box mb={12}>
                      <ApostropheHeadline color="#FFFFFF">
                        {partner?.serviceHighlights[key].audience}
                      </ApostropheHeadline>
                    </Box>
                    <Box maxW={[640, 640, 640, 640, 768]} w="100%">
                      <Accordion defaultIndex={[0]} as={VStack} align="stretch">
                        {(partner?.serviceHighlights[key]?.sections ?? []).map(
                          ({ title, content }, index) => {
                            return (
                              <AccordionItem
                                borderRadius={16}
                                key={index}
                                bg="white"
                              >
                                {({ isExpanded }) => (
                                  <>
                                    <AccordionButton
                                      w="100%"
                                      textAlign="center"
                                      fontWeight="bold"
                                      fontSize="md"
                                    >
                                      <HStack w="100%" py={2}>
                                        <Text
                                          flex={1}
                                          minW={0}
                                          w="100%"
                                          textAlign="center"
                                          fontSize="xl"
                                        >
                                          {title}
                                        </Text>
                                        <Icon
                                          as={
                                            isExpanded
                                              ? AiOutlineMinus
                                              : AiOutlinePlus
                                          }
                                          fontSize="2xl"
                                        />
                                      </HStack>
                                    </AccordionButton>
                                    <AccordionPanel
                                      fontSize="lg"
                                      borderTopWidth={2}
                                      borderTopColor="#eee"
                                      p={4}
                                    >
                                      <MultiTextRenderer data={content} />
                                    </AccordionPanel>
                                  </>
                                )}
                              </AccordionItem>
                            );
                          }
                        )}
                      </Accordion>
                    </Box>
                  </>
                );
              })}
          </VStack>
        </Container>
        <Image
          d={["none", "none", "none", "block"]}
          position="absolute"
          bottom={"30px"}
          w={"308px"}
          left={"10%"}
          src={page?.content?.partnerSection?.serviceSection?.bgImageLeft}
          zIndex="3"
        />
        <Image
          position="absolute"
          bottom={["5%", "5%", "10%"]}
          right={"5%"}
          w={"200px"}
          src={page?.content?.partnerSection?.serviceSection?.bgImageRight}
          zIndex="1"
        />
        <Box pos="relative" zIndex={2}>
          <DividerA
            primaryColor="rgb(246,214,68)"
            secondaryColor="rgb(254,181,52)"
            nextColor="rgb(250,250,250)"
          />
        </Box>
      </Box>

      {/* Service Targets */}
      <Box bg="#fafafa">
        <Container>
          <VStack py={36}>
            <Box pb={12}>
              <HighlightHeadline bgColor={"#F6D644"}>
                {page?.content?.partnerSection?.serviceTarget?.title}
              </HighlightHeadline>
            </Box>
            <SimpleGrid justifyContent="center" gap={12} columns={[2, 2, 4, 4]}>
              {(partner?.serviceTargets ?? []).map(
                ({ label, description, image }, index) => {
                  return (
                    <VStack key={index}>
                      <Image w="200px" src={image} />
                      <Text
                        textAlign="center"
                        w={["100%", "100%", "150px"]}
                        fontSize={["xl", "2xl"]}
                        fontWeight="semibold"
                      >
                        {label}
                        {description && (
                          <Tooltip hasArrow label={description}>
                            <Text d="inline">
                              <Icon as={AiOutlineInfoCircle}></Icon>
                            </Text>
                          </Tooltip>
                        )}
                      </Text>
                    </VStack>
                  );
                }
              )}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      <Box bg="#fafafa">
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

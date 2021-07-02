import { useState } from "react";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { NextSeo } from "next-seo";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import resourceFieldsForCMS from "../../utils/tina/resourceFieldsForCMS";
import {
  chakra,
  Heading,
  Text,
  Image,
  Box,
  Stack,
  UnorderedList,
  ListItem,
  Button,
  Grid,
  GridItem,
  Link,
} from "@chakra-ui/react";
import { VStack, HStack, Flex } from "@chakra-ui/layout";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import wordExtractor from "../../utils/wordExtractor";
import Card from "../../components/CarouselCard";
import ButtonGroup from "../../components/CarouselButtons";
import Container from "../../components/Container";
import DividerSimple from "../../components/DividerSimple";
import HighlightHeadline from "../../components/HighlightHeadline";
import ApostropheHeadline from "../../components/ApostropheHeadline";

const PAGE_KEY = "resources";

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

const responsiveCarousel = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 7,
  },
  xxLargeDesktop: {
    breakpoint: { max: 3000, min: 2500 },
    items: 6,
  },
  xLargeDesktop: {
    breakpoint: { max: 2500, min: 2000 },
    items: 5,
  },
  largeDesktop: {
    breakpoint: { max: 2000, min: 1600 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1600, min: 1272 },
    items: 3.5,
  },
  mdDesktop: {
    breakpoint: { max: 1271, min: 900 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 899, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 463, min: 0 },
    items: 0,
  },
};

const Resources = ({ page }) => {
  const [showItems, setShowItems] = useState(3);

  return (
    <VStack w="100%" spacing={0} align="stretch">
      {page?.content?.seo?.title && (
        <NextSeo
          title={page?.content?.seo?.title}
          description={page?.content?.seo?.description}
        ></NextSeo>
      )}
      {/* Banner Section */}
      <Text>fdsa</Text>
      <Box
        bgImg={`url(${page?.content?.heroBannerSection?.image})`}
        bgSize="cover"
        bgPos="center center"
      >
        <Container>
          <Text
            d="inline-block"
            mt={48}
            px={2}
            mb={36}
            fontWeight="bold"
            fontSize={["3xl", "5xl", "6xl"]}
            bg="#F6D644"
          >
            {page?.content?.heroBannerSection["title 標題"]}
          </Text>
        </Container>
        <Box>
          <DividerSimple nextColor="#F6D644" />
        </Box>
      </Box>
      {/* Dialogue Section */}
      <Box bg="#F6D644">
        <Container pos="relative">
          <VStack align="stretch" spacing={0} pt={16}>
            <Box alignSelf="center" fontSize={["2xl", "4xl"]}>
              <HighlightHeadline bgColor="#fff">
                {page?.content?.dialogue?.tagline}
              </HighlightHeadline>
            </Box>

            <VStack pt={16} align="start" position="relative" spacing={4}>
              {(page?.content?.dialogue?.left?.dialogue ?? []).map(
                ({ message }, index) => {
                  if (index == 0) {
                    return (
                      <HStack position="relative">
                        <Box
                          ml={[0, 0, 0, 16]}
                          py={1}
                          px={2}
                          w={["75%", "75%", "65%", "max"]}
                          borderRadius={["10px", "10px", "10px", "20px"]}
                          bg="white"
                          pos="relative"
                        >
                          <MultiTextRenderer
                            key={index}
                            parentStyles={{
                              padding: "5px",
                              paddingLeft: "10px",
                            }}
                            data={message}
                            fontSize={["lg", "xl", "2xl"]}
                          />
                          <Box
                            w="0px"
                            height="0px"
                            borderRight="5px solid transparent"
                            borderLeft="5px solid transparent"
                            borderTop="12px solid #FFFFFF"
                            transform="scaleY(-1) rotate(150deg)"
                            pos="absolute"
                            left="0"
                            bottom="-6px"
                          ></Box>
                        </Box>
                        <Image
                          h="120%"
                          src={page?.content?.dialogue?.leftQuoteImage}
                        />
                      </HStack>
                    );
                  } else {
                    return (
                      <Box
                        py={1}
                        px={2}
                        w={["75%", "75%", "65%", "max"]}
                        borderRadius={["10px", "10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          data={message}
                          parentStyles={{
                            padding: "5px",
                            paddingLeft: "10px",
                          }}
                          fontSize={["lg", "xl", "2xl"]}
                        />
                        <Box
                          w="0px"
                          height="0px"
                          borderRight="5px solid transparent"
                          borderLeft="5px solid transparent"
                          borderTop="12px solid #FFFFFF"
                          transform="scaleY(-1) rotate(150deg)"
                          pos="absolute"
                          left="0"
                          bottom="-6px"
                        ></Box>
                      </Box>
                    );
                  }
                }
              )}
              <Text mt={3} fontSize="lg" ml={-6}>
                {page?.content?.dialogue?.left?.role}
              </Text>
              <Box mr={["", "", "", "", "-275px !important"]}>
                <Image
                  h={["127px", "127px", "194px", "194px"]}
                  src={page?.content?.dialogue?.left?.left}
                  zIndex="0"
                />
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>
      <Box bg="#FEB534" pb={48}>
        <Container mt={"-150px"} pos="relative">
          <VStack alignItems="flex-end" position="relative" spacing={4}>
            {(page?.content?.dialogue?.right?.dialogue ?? []).map(
              ({ message }, index) => {
                if (index == 0) {
                  return (
                    <HStack justifyContent="flex-end" position="relative">
                      <Image
                        h="120%"
                        src={page?.content?.dialogue?.rightQuoteImage}
                      />
                      <Box
                        ml={[0, 0, 0, 16]}
                        py={1}
                        px={2}
                        w={["75%", "75%", "65%", "max"]}
                        borderRadius={["10px", "10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          parentStyles={{
                            padding: "5px",
                            paddingLeft: "10px",
                          }}
                          data={message}
                          fontSize={["lg", "xl", "2xl"]}
                        />
                        <Box
                          w="0px"
                          height="0px"
                          borderRight="5px solid transparent"
                          borderLeft="5px solid transparent"
                          borderTop="12px solid #FFFFFF"
                          transform="scaleY(-1) rotate(-150deg)"
                          pos="absolute"
                          right={0}
                          bottom="-6px"
                        ></Box>
                      </Box>
                    </HStack>
                  );
                }
              }
            )}
            <Text mt={3} fontSize="lg" mr={-6}>
              {page?.content?.dialogue?.right?.role}
            </Text>
            <Box mr={["", "", "", "", "-125px !important"]}>
              <Image
                w={["152px", "152px", "152px", "255px", "255px"]}
                src={page?.content?.dialogue?.right?.rightImage}
              />
            </Box>
          </VStack>
        </Container>
        <Container mt={["", "", "", "", "-200px"]}>
          <VStack>
            <Box fontSize="2xl">
              <ApostropheHeadline color="#FFF">
                {page?.content?.howSection["title 標題"]}
              </ApostropheHeadline>
            </Box>
            <Box
              maxW={["80%", "80%", "80%", 700]}
              w="100%"
              pb={8}
              borderRadius={16}
              py={4}
              px={6}
              bg="white"
            >
              <MultiTextRenderer
                textAlign="center"
                fontSize={["lg", "lg", "xl", "2xl"]}
                data={page?.content?.howSection?.content}
              />
            </Box>
          </VStack>
        </Container>
      </Box>
      <Box bg="#FEB534">
        <DividerSimple nextColor="#FAFAFA" />
      </Box>
      {/* resource Section */}
      <Box w="100%" bg="#FAFAFA" pos="relative">
        <VStack
          alignItems="start"
          w="100%"
          pt={["36px", "36px", "109px"]}
          maxW={{ lg: "83%", md: "90%" }}
          pl={{ base: "16px", md: "0" }}
          mx="auto"
        >
          <VStack alignItems="start" w="100%">
            <Heading fontSize={["24px", "24px", "36px", "54px"]}>
              {page?.content?.resourceSection["title 標題"]}
            </Heading>
          </VStack>
        </VStack>

        <Box
          display={["none", "none", "block", "block"]}
          pt="110px"
          overflow="hidden"
          pos="relative"
        >
          <Carousel
            responsive={responsiveCarousel}
            swipeable={false}
            draggable={false}
            showDots={false}
            customButtonGroup={<ButtonGroup />}
          >
            {(page?.content?.resourceSection?.resources ?? []).map(
              (
                {
                  name,
                  category,
                  organization,
                  serviceTarget,
                  services,
                  internship,
                  probationOrReferral,
                  subsidy,
                  remark,
                  topColor,
                  contact,
                  reminder,
                },
                index
              ) => (
                <Stack align="center" justifyContent="center" key={index}>
                  <Card
                    name={name}
                    topColor={topColor}
                    organization={organization}
                    category={wordExtractor(page?.content?.wordings, category)}
                    serviceTarget={serviceTarget}
                    services={services}
                    internship={internship}
                    probationOrReferral={probationOrReferral}
                    subsidy={subsidy}
                    remark={remark}
                    contact={contact}
                    reminder={reminder}
                    page={page}
                  />
                </Stack>
              )
            )}
          </Carousel>
        </Box>
        <VStack
          w="100%"
          pt="49px"
          spacing="24px"
          justifyContent="center"
          display={["block", "block", "none", "none"]}
        >
          <VStack
            spacing="16px"
            w="100%"
            justifyContent="center"
            alignItems="center"
          >
            {(
              page?.content?.resourceSection?.resources.slice(0, showItems) ??
              []
            ).map(
              (
                {
                  name,
                  category,
                  organization,
                  serviceTarget,
                  services,
                  internship,
                  probationOrReferral,
                  subsidy,
                  remark,
                  topColor,
                  contact,
                  reminder,
                },
                index
              ) => (
                <Card
                  name={name}
                  topColor={topColor}
                  organization={organization}
                  category={category}
                  serviceTarget={serviceTarget}
                  services={services}
                  internship={internship}
                  probationOrReferral={probationOrReferral}
                  subsidy={subsidy}
                  remark={remark}
                  contact={contact}
                  reminder={reminder}
                  page={page}
                />
              )
            )}
          </VStack>
          <VStack>
            <Button
              color="black"
              borderRadius="22px"
              onClick={() => setShowItems(showItems + 1)}
              hidden={
                showItems >= page?.content?.resourceSection?.resources.length
              }
              bg="transparent"
              pb="5px"
              border="2px solid #1E1E1E"
            >
              {wordExtractor(page?.content?.wordings, "showMore")}
            </Button>
          </VStack>
        </VStack>
      </Box>
      {/* Equip Section */}
      <Box overflow="hidden" bg="red" pos="relative">
        <Box
          pb={["46px", "46px", "72px"]}
          pt={["", "", "50px"]}
          background="#FAFAFA"
        >
          <Box
            display="flex"
            pos="relative"
            maxW={{ lg: "83%", md: "90%" }}
            px={{ base: "16px", md: "0" }}
            mx="auto"
          >
            <Box mt={["110px", "110px", "80px"]}>
              <Text fontSize={["24px", "24px", "54px"]} fontWeight="bold">
                {wordExtractor(page?.content?.wordings, "equip")}
              </Text>
            </Box>
          </Box>

          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(6, 1fr)"
            gap="24px"
            justifyContent="center"
            mt="24px"
            position="relative"
            zIndex="1"
            maxW={{ lg: "83%", md: "90%" }}
            px={{ base: "16px", md: "0" }}
            mx="auto"
          >
            <GridItem rowSpan="2" colSpan={[6, 6, 3, 3]}>
              <Box
                background="#FFFFFF"
                borderRadius="10"
                h={["100%", "100%", "571px"]}
                py={["16px", "16px", "36px"]}
                px={["16px", "16px", "24px"]}
                display="flex"
                flexDirection="column"
              >
                <MultiTextRenderer
                  fontSize={["24px", "24px", "30px", "36px"]}
                  data={page?.content?.equipSection?.left?.content}
                />
                {page?.content?.equipSection?.left?.links && (
                  <Box py={["48px", "48px", "84px"]}>
                    <Text fontSize={["16px", "16px", "24px"]}>
                      {wordExtractor(page?.content?.wordings, "relatedLinks")}
                    </Text>
                    <UnorderedList m={0}>
                      {(page?.content?.equipSection?.left?.links ?? []).map(
                        ({ label, url }, index) => {
                          return (
                            <ListItem
                              display="flex"
                              _before={{
                                content: '"."',
                                color: "black",
                                pr: "6px",
                                fontWeight: "bold",
                                fontSize: "20px",
                              }}
                              fontSize="16px"
                            >
                              <Link
                                pt="8px"
                                isExternal
                                textDecoration="underline"
                                href={url}
                              >
                                {label}
                              </Link>
                            </ListItem>
                          );
                        }
                      )}
                    </UnorderedList>
                  </Box>
                )}
              </Box>
            </GridItem>
            <GridItem colSpan={[6, 6, 3, 3]}>
              <Box
                background="#FFFFFF"
                borderRadius="10"
                minH={["300px", "300px", "100%"]}
                py={["16px", "16px", "36px"]}
                px={["16px", "16px", "24px"]}
                display="flex"
                flexDirection="column"
              >
                <MultiTextRenderer
                  fontSize={["24px", "24px", "30px", "36px"]}
                  data={page?.content?.equipSection?.topRight?.content}
                />
                {page?.content?.equipSection?.topRight?.links && (
                  <Box py={["48px", "48px", "84px"]}>
                    <Text fontSize={["16px", "16px", "24px"]}>
                      {wordExtractor(page?.content?.wordings, "relatedLinks")}
                    </Text>
                    <UnorderedList m={0}>
                      {(page?.content?.equipSection?.topRight?.links ?? []).map(
                        ({ label, url }, index) => {
                          return (
                            <ListItem
                              display="flex"
                              _before={{
                                content: '"."',
                                color: "black",
                                pr: "6px",
                                fontWeight: "bold",
                                fontSize: "20px",
                              }}
                              fontSize="16px"
                            >
                              <Link
                                pt="8px"
                                isExternal
                                textDecoration="underline"
                                href={url}
                              >
                                {label}
                              </Link>
                            </ListItem>
                          );
                        }
                      )}
                    </UnorderedList>
                  </Box>
                )}
              </Box>
            </GridItem>
            <GridItem colSpan={[6, 6, 3, 3]} d="none">
              <Box
                background="#FFFFFF"
                borderRadius="10"
                minH={["300px", "300px", "100%"]}
                py={["16px", "16px", "36px"]}
                px={["16px", "16px", "24px"]}
                display="flex"
                flexDirection="column"
              >
                <MultiTextRenderer
                  fontSize={["24px", "24px", "30px", "36px"]}
                  data={page?.content?.equipSection?.bottomRight?.content}
                />
                {page?.content?.equipSection?.bottomRight?.links && (
                  <Box py={["48px", "48px", "84px"]}>
                    <Text fontSize={["16px", "16px", "24px"]}>
                      {wordExtractor(page?.content?.wordings, "relatedLinks")}
                    </Text>
                    <UnorderedList>
                      {(
                        page?.content?.equipSection?.bottomRight?.links ?? []
                      ).map(({ label, url }, index) => {
                        return (
                          <ListItem
                            display="flex"
                            _before={{
                              content: '"."',
                              color: "black",
                              mr: "6px",
                              fontWeight: "bold",
                              fontSize: "20px",
                            }}
                            fontSize="16px"
                          >
                            {" "}
                            <Link
                              pt="8px"
                              isExternal
                              textDecoration="underline"
                              href={url}
                            >
                              {label}
                            </Link>
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </Box>
                )}
              </Box>
            </GridItem>
          </Grid>
        </Box>
        <Image
          pos="absolute"
          right={["-5%", "-10%", "-35%"]}
          bottom="-30%"
          w="100%"
          src={page?.content?.equipSection?.image}
        />
      </Box>
      {/* jobOportunity Setting */}
      <Box
        pt={["90px", "90px", "45px"]}
        background="#F6D644"
        display="flex"
        flexDirection="column"
        alignItems="center"
        pos="relative"
        zIndex="0"
        overflow="hidden"
      >
        <Heading fontSize={["24px", "24px", "36px"]}>
          {page?.content?.jobOpportunitySection?.title}
        </Heading>

        <Text
          textAlign="center"
          pt="24px"
          fontSize="16px"
          px={["16px", "16px", "0px"]}
          mx="auto"
          maxW={{ lg: "83%", md: "90%" }}
        >
          {page?.content?.jobOpportunitySection?.description}
        </Text>
        <Flex
          pb={["90px", "90px", "53px"]}
          gridGap="24px"
          flexDirection={["column", "column", "row", "row"]}
          mt={["36px", "36px", "68px"]}
        >
          {(page?.content?.jobOpportunitySection?.buttons ?? []).map(
            ({ label, link }, index) => {
              return (
                <Button
                  zIndex="100"
                  borderRadius="22px"
                  color="#1E1E1E"
                  bg="transparent"
                  key={index}
                  fontWeight={["normal", "semibold"]}
                  border="2px solid #1E1E1E"
                  _hover={{ bg: "#FFFFFF", borderColor: "#FFFFFF" }}
                  fontSize="23px"
                >
                  {label}
                </Button>
              );
            }
          )}
        </Flex>
        <Image
          right="15%"
          top="0"
          src={page?.content?.jobOpportunitySection?.image}
          pos="absolute"
          bottom="0"
          zIndex="1"
        />
      </Box>
    </VStack>
  );
};

export default withPageCMS(Resources, {
  key: PAGE_KEY,
  fields: resourceFieldsForCMS,
});

import React, { useMemo, useRef, useState } from "react";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { NextSeo } from "next-seo";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import resourceFieldsForCMS from "../../utils/tina/resourceFieldsForCMS";
import Slider from "react-slick";
import {
  Heading,
  Text,
  Image,
  Box,
  UnorderedList,
  ListItem,
  Button,
  Grid,
  GridItem,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { VStack, HStack, Flex } from "@chakra-ui/layout";
import "react-multi-carousel/lib/styles.css";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import wordExtractor from "../../utils/wordExtractor";
import Card from "../../components/CarouselCard";
import Container from "../../components/Container";
import DividerSimple from "../../components/DividerSimple";
import HighlightHeadline from "../../components/HighlightHeadline";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Anchor from "../../components/Anchor";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import ReactSelect from "react-select";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@chakra-ui/icons";

const PAGE_KEY = "resources";

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
      enums: (await getSharedServerSideProps(context))?.props?.enums,
    },
  };
};

const Resources = ({ page, enums }) => {
  const router = useRouter();
  const [showItems, setShowItems] = useState(3);
  const sliderRef = useRef(null);
  const settings = {
    ref: (c) => (sliderRef.current = c),
    dots: false,
    speed: 500,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: false,
  };

  const [serivceTargetFilter, setSerivceTargetFilter] = useState([]);
  const serviceTargetList = useMemo(
    () =>
      enums?.EnumServiceTargetList?.map((target) => ({
        value: target.key,
        label: target.value[router.locale],
      })),
    [enums?.EnumServiceTargetList, router.locale]
  );

  const filteredResourceList = useMemo(() => {
    if (serivceTargetFilter.length === 0)
      return page?.content?.resourceSection?.resources;
    // console.log(page?.content?.resourceSection?.resources);
    return page?.content?.resourceSection?.resources.filter((resource) => {
      return serivceTargetFilter?.some((tag) =>
        resource?.serviceTarget?.tags?.find(({ value }) => value === tag)
      );
    });
  }, [page?.content?.resourceSection?.resources, serivceTargetFilter]);

  return (
    <VStack w="100%" spacing={0} align="stretch">
      {page?.content?.seo?.title && (
        <NextSeo
          title={page?.content?.seo?.title}
          description={page?.content?.seo?.description}
        ></NextSeo>
      )}
      {/* Banner Section */}
      {/* <Text>fdsa</Text> */}
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
        <DividerSimple nextColor="#F3F3F3" />
      </Box>
      {/* resource Section */}

      <Box bg="#F3F3F3">
        <Anchor id="list" />
        <Container>
          <Text my={16} fontSize={"6xl"} fontWeight="bold">
            {page?.content?.resourceSection["title 標題"]}
          </Text>
        </Container>

        <Box
          d={["none", "none", "block"]}
          p={4}
          pos="relative"
          w="100vw"
          minH="600px"
        >
          <Container>
            <HStack pb={4}>
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                  borderWidth={0}
                  borderBottomWidth="2px"
                  size="lg"
                  borderRadius={0}
                  px={0}
                  _hover={{}}
                  _focus={{}}
                  _active={{}}
                >
                  篩選服務對象
                </MenuButton>
                <MenuList minWidth="240px">
                  <MenuOptionGroup
                    value={serivceTargetFilter}
                    onChange={setSerivceTargetFilter}
                    type="checkbox"
                  >
                    {serviceTargetList?.map((target, i) => (
                      <MenuItemOption key={i} value={target.value}>
                        {target.label}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </HStack>
          </Container>
          <Slider {...settings}>
            {(filteredResourceList ?? []).map((resource, index) => {
              const {
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
              } = resource;
              return (
                <Box key={resource?.id} px={1} h="100%" maxW={"336px"}>
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
                </Box>
              );
            })}
          </Slider>
          <HStack
            pos="absolute"
            zIndex={1}
            left={0}
            top={0}
            h="100%"
            align="center"
            p={12}
          >
            <Box
              _hover={{
                color: "white",
                bg: "black",
              }}
              boxShadow="lg"
              bg="white"
              p={4}
              borderRadius="50%"
              cursor="pointer"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <IconButton variant="unstyled" as={FaArrowLeft} size="md" />
            </Box>
          </HStack>
          <HStack
            pos="absolute"
            zIndex={1}
            top={0}
            right={0}
            h="100%"
            align="center"
            p={12}
          >
            <Box
              _hover={{
                color: "white",
                bg: "black",
              }}
              boxShadow="lg"
              bg="white"
              p={4}
              borderRadius="50%"
              cursor="pointer"
              onClick={() => sliderRef.current.slickNext()}
            >
              <IconButton
                borderRadius="50%"
                variant="unstyled"
                round={true}
                size="md"
                as={FaArrowRight}
              />
            </Box>
          </HStack>
        </Box>
        <VStack
          w="100%"
          px={[2, 4]}
          justifyContent="center"
          d={["block", "block", "none"]}
        >
          <Box>
            {(filteredResourceList?.slice(0, showItems) ?? []).map(
              (resource, index) => {
                const {
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
                } = resource;
                return (
                  <VStack key={index} px={2} alignItems="stretch">
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
                  </VStack>
                );
              }
            )}
            <VStack mt={6} w="100%" align="center">
              <Button
                variant="outline"
                borderColor="black"
                borderWidth={2}
                p={3}
                size="xl"
                borderRadius="2em"
                onClick={() =>
                  setShowItems((i) =>
                    Math.min(
                      i + 3,
                      page?.content?.resourceSection?.resources?.length
                    )
                  )
                }
                outline="none"
                appearance="none"
              >
                {wordExtractor(page?.content?.wordings, "showMore")}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
      {/* Equip Section */}
      <Box overflow="hidden" bg="red" pos="relative">
        <Anchor id="equip" top="0" />
        <Box
          pb={["46px", "46px", "72px"]}
          pt={["", "", "50px"]}
          background="#F3F3F3"
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
                              key={index}
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
                              key={index}
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
            {/* temp hidden */}
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
                            key={index}
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

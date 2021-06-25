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
  Icon,
  Divider,
  Tooltip,
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
import { FaShareSquare } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { motion } from "framer-motion";

const PAGE_KEY = "resources";

const MotionBox = motion(Box);

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

const responsiveCarousel = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1199, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 0,
  },
};

const Resources = ({ page }) => {
  const [showItems, setShowItems] = useState(3);
  const TextTool = ({ text, link, description, pt, fontSize, hover, share, bold, small }) => {
    return (
      <Text pt={pt} color="#1E1E1E">
        <chakra.span
          _hover={hover ? { cursor: "pointer", decoration: "underline" } : ""}
          fontSize={fontSize}
          fontWeight={bold ? "bold" : "normal"}
        >
          {text}
        </chakra.span>

        {share && (
          <chakra.span pl="3px">
            <Icon w="15px" h="13px">
              <FaShareSquare />
            </Icon>
          </chakra.span>
        )}
        {description && description !== "" && (
          <chakra.span pl="6px">
            <Tooltip hasArrow label={description} bg="white" color="#1E1E1E">
              <Icon mt={small ? "5px" : "5px"} w={small ? "16px" : "24px"} h={small ? "16px" : "24px"}>
                <AiOutlineInfoCircle />
              </Icon>
            </Tooltip>
          </chakra.span>
        )}
      </Text>
    );
  };
  const Card = ({
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
  }) => {
    const [show, setShow] = useState(false);
    return (
      <Box
        w={["90%", "303px", "303px", "350px"]}
        borderTop={`8px solid ${topColor ? topColor : "#4E7F8E"}`}
        boxShadow="12px 12px 24px 0px rgba(30,30,30,0.1)"
        borderRadius="10px"
        mb="8px"
        mr={["", "", "24px"]}
      >
        <Box minH="571px" borderRadius="10px" bg="#FFFFFF">
          <VStack borderRadius="10px" alignItems="start" px="18px" w="100%">
            <VStack w="100%" minH="520px" alignItems="start">
              <Text pt="40px" fontSize="12px" h="58px" color={topColor}>
                {category}
              </Text>
              <TextTool
                text={name?.text}
                fontSize={["20px", "20px", "24px", "24px"]}
                description={name?.description}
                pt="8px"
                hover
                bold
                share={true}
              />
              <Divider />
              <HStack spacing="3px">
                <Image w="24px" h="24px" src={page?.content?.resourceSection?.resourceListIcons?.organization} />
                <TextTool
                  share={true}
                  text={organization?.text}
                  description={organization?.description}
                  fontSize="16px"
                />
              </HStack>
              <Divider />
              <HStack spacing="3px">
                <Image w="24px" h="24px" src={page?.content?.resourceSection?.resourceListIcons?.avatar} />

                <TextTool text={serviceTarget?.text} description={serviceTarget?.description} fontSize="16px" />
              </HStack>
              <Divider />
              <Box minH="281px">
                <UnorderedList styleConfig={{ fontSize: "4px" }} ml="4px">
                  <HStack spacing="3px">
                    <Image w="24px" h="24px" src={page?.content?.resourceSection?.resourceListIcons?.tick} />

                    <TextTool
                      text={wordExtractor(page?.content?.wordings, "serviceHeading")}
                      fontSize="16px"
                      pt="8px"
                    />
                  </HStack>
                  {(services ?? []).map(({ category, description }, index) => {
                    return (
                      <ListItem
                        display="flex"
                        _before={{
                          content: '"."',
                          color: "black",
                          mr: "6px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                        key={index}
                        ml="63px"
                      >
                        <TextTool text={category} description={description} fontSize="12px" small />
                      </ListItem>
                    );
                  })}
                </UnorderedList>
                {internship?.value && (
                  <HStack spacing="3px">
                    <Image w="24px" h="24px" src={page?.content?.resourceSection?.resourceListIcons?.tick} />

                    <TextTool
                      text={wordExtractor(page?.content?.wordings, "internship")}
                      description={internship?.description}
                      fontSize="16px"
                      pt="8px"
                    />
                  </HStack>
                )}
                {probationOrReferral?.value && (
                  <HStack spacing="3px">
                    <Image w="24px" h="24px" src={page?.content?.resourceSection?.resourceListIcons?.tick} />

                    <TextTool
                      text={wordExtractor(page?.content?.wordings, "onProbation")}
                      description={probationOrReferral?.description}
                      fontSize="16px"
                      pt="8px"
                    />
                  </HStack>
                )}
                <UnorderedList listStyleType="none" ml="4px">
                  <HStack spacing="3px">
                    <Image w="24px" h="24px" src={page?.content?.resourceSection?.resourceListIcons?.tick} />

                    <TextTool
                      text={wordExtractor(page?.content?.wordings, "fundingHeading")}
                      fontSize="16px"
                      pt="8px"
                    />
                  </HStack>
                  {(subsidy ?? []).map(({ target, description }, index) => {
                    return (
                      <ListItem
                        display="flex"
                        _before={{
                          content: '"."',
                          color: "black",
                          mr: "6px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                        key={index}
                        ml="63px"
                      >
                        <TextTool text={target} description={description} fontSize="12px" small />
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              </Box>
              <MotionBox
                overflow="hidden"
                animate={{ height: show ? "auto" : 0 }}
                transition={{ duration: 0.5 }}
                alignItems="start"
                spacing={0}
                w="100%"
              >
                <Divider />
                <HStack pt="8px" spacing="3px">
                  <Image w="16px" h="16px" src={page?.content?.resourceSection?.resourceListIcons?.contact} />
                  <Text color="#1E1E1E" fontSize="16px">
                    {contact?.text}
                  </Text>
                </HStack>
                <VStack pl="27px" alignItems="start">
                  <Text color="#1E1E1E" fontSize="12px">
                    {contact?.description}
                  </Text>
                  <Text pt="24px" color="#1E1E1E" fontSize="12px">
                    {contact?.linkName}
                  </Text>
                </VStack>
                <HStack pt="32px" spacing="3px">
                  <Image w="16px" h="16px" src={page?.content?.resourceSection?.resourceListIcons?.remarks} />

                  <Text color="#1E1E1E" fontSize="16px">
                    {wordExtractor(page?.content?.wordings, "remarkHeading")}
                  </Text>
                </HStack>

                <Text pl="27px" color="#1E1E1E" fontSize="12px">
                  {remark}
                </Text>
              </MotionBox>
              <Box pt="32px"></Box>
            </VStack>
          </VStack>
          <Box>
            <Divider />
            <Text
              pb="10px"
              cursor="pointer"
              onClick={() => setShow(!show)}
              textAlign="center"
              w="100%"
              mt="10px"
              fontSize="16px"
            >
              {wordExtractor(page?.content?.wordings, "showMore")}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <VStack w="100%" spacing={0} align="stretch">
      {page?.content?.seo?.title && (
        <NextSeo title={page?.content?.seo?.title} description={page?.content?.seo?.description}></NextSeo>
      )}
      {/* Banner Section */}
      <Box
        h={["calc(50vw - 45px)", "calc(50vw - 45px)", "calc(50vw - 220px)"]}
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundImage={`url(${page?.content?.heroBannerSection?.image})`}
        backgroundSize="cover"
        backgroundPosition="center center"
        zIndex="0"
      >
        <Box mt={["20px", "50px", "80px", "300px"]} ml={["25px", "25px", "150px", "250px"]} maxW="80%">
          <Text
            w="max"
            maxW="80%"
            fontWeight={["normal", "normal", "semibold"]}
            fontSize={["24px", "24px", "36px", "54px"]}
            bg="#F6D644"
            color="black"
            display="inline"
          >
            {page?.content?.heroBannerSection["title 標題"]}
          </Text>
        </Box>
        <Image
          position="absolute"
          bottom="-1px"
          src={page?.content?.heroBannerSection?.bgImageBottom}
          width="100%"
          fit="contain"
          zIndex="-1"
        />
      </Box>
      {/* Dialogue Section */}
      <Box pb="15%" pos="relative" bg="#F6D644">
        <VStack align="center" spacing={0} pt="23px">
          <Box mx={["20px", "30px"]}>
            <chakra.span
              fontSize={["22px", "30px", "36px"]}
              textAlign="center"
              fontWeight={["normal", "normal", "bold", "bold"]}
              pos="relative"
              lineHeight={2}
              backgroundImage="linear-gradient(#fff, #fff)"
              backgroundRepeat="no-repeat"
              backgroundPosition="0 0.7em"
              pl="15px"
              pr="15px"
              pb="10px"
            >
              {page?.content?.dialogue?.tagline}
            </chakra.span>
          </Box>
        </VStack>

        {(page?.content?.dialogue?.left?.dialogue ?? []).map(({ message }, index) => {
          if (index == 0) {
            return (
              <Flex>
                <Box
                  mt={["24px", "24px", "68px"]}
                  ml={["16px", "16px", "16px", "325px"]}
                  w={["75%", "75%", "65%", "max"]}
                  borderRadius={["10px", "10px", "10px", "20px"]}
                  bg="white"
                  pos="relative"
                >
                  <MultiTextRenderer
                    key={index}
                    parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                    data={message}
                    fontSize={["14px", "14px", "16px", "20px"]}
                    textAlign={["left", "left", "left", "center"]}
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
                  mt={["24px", "24px", "68px"]}
                  ml={["10px", "10px", "26px", "26px"]}
                  w={["20px", "20px", "20px", "40px"]}
                  h={["16px", "16px", "16px", "32px"]}
                  src={page?.content?.dialogue?.leftQuoteImage}
                />
              </Flex>
            );
          } else {
            return (
              <Box
                mt={["16px", "16px", "18px"]}
                ml={["16px", "16px", "", "218px"]}
                w={["75%", "75%", "65%", "max"]}
                borderRadius={["10px", "10px", "10px", "20px"]}
                bg="white"
                pos="relative"
              >
                <MultiTextRenderer
                  key={index}
                  data={message}
                  parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                  fontSize={["14px", "14px", "16px", "20px"]}
                  textAlign={["left", "left", "left", "center"]}
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
        })}
        <Text
          pb={["30%", "15%", "15%", "0"]}
          ml={["16px", "16px", "", "211px"]}
          mt={["12px", "12px", "8px"]}
          fontSize="16px"
        >
          {page?.content?.dialogue?.left?.role}
        </Text>
        <Image
          pos="absolute"
          left={["16px", "16px", "32px", "110px"]}
          bottom={["0px", "0px", "20px", "40px"]}
          w={["80px", "80px", "100px", "122px"]}
          h={["127px", "127px", "194px", "194px"]}
          src={page?.content?.dialogue?.left?.left}
          zIndex="0"
        />
        <Image
          pos="absolute"
          right="0px"
          bottom="0"
          width="100%"
          src={page?.content?.dialogue?.bottomImage}
          zIndex="0"
        />
      </Box>

      {/* Conversation Section */}
      <Box pb={["", "", "", "20%"]} w="100%" pos="relative" bg="#FEB534">
        <Box pos="relative" zIndex="100" pb={["5%", "5%", "5%", "20%"]}>
          <Box
            pos={["relative", "relative", "relative", "absolute"]}
            right={{ lg: "0" }}
            w="100%"
            top={["", "", "", "-250px"]}
          >
            <VStack w="100%" justifyContent="right" alignItems="right">
              {(page?.content?.dialogue?.right?.dialogue ?? []).map(({ message }, index) => {
                if (index == 0) {
                  return (
                    <Flex justifyContent="flex-end" w="100%">
                      <Image
                        mt={["24px", "24px", "24px", "68px"]}
                        mr={["8px", "8px", "8px", "32px"]}
                        w={["20px", "20px", "20px", "40px"]}
                        h={["16px", "16px", "16px", "32px"]}
                        transform="rotate(180deg)"
                        src={page?.content?.dialogue?.leftQuoteImage}
                      />
                      <Box
                        mt={["24px", "24px", "24px", "68px"]}
                        mr={["16px", "16px", "16px", "230px"]}
                        w={["75%", "75%", "65%", "max"]}
                        borderRadius={["10px", "10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                          data={message}
                          fontSize={["14px", "14px", "16px", "20px"]}
                          textAlign={["left", "left", "left", "center"]}
                        />
                        <Box
                          w="0px"
                          height="0px"
                          borderRight="5px solid transparent"
                          borderLeft="5px solid transparent"
                          borderTop="12px solid #FFFFFF"
                          transform="scaleY(-1) rotate(-150deg)"
                          pos="absolute"
                          right="0"
                          bottom="-6px"
                        ></Box>
                      </Box>
                    </Flex>
                  );
                } else {
                  return (
                    <Flex justifyContent="flex-end" w="100%">
                      <Box
                        mt={["16px", "16px", "18px"]}
                        mr={["16px", "16px", "", "207px"]}
                        w={["75%", "75%", "65%", "max"]}
                        borderRadius={["10px", "10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                          data={message}
                          fontSize={["14px", "14px", "16px", "20px"]}
                          textAlign={["left", "left", "left", "center"]}
                        />
                        <Image src={page?.content?.dialogue?.rightTooltip} pos="absolute" bottom="-2" right="0" />
                      </Box>
                    </Flex>
                  );
                }
              })}
              <VStack justifyContent="right" alignItems="right" w="100%">
                <Text
                  textAlign="right"
                  mr={["16px", "16px", "24px", "207px"]}
                  mt={["12px", "12px", "8px"]}
                  fontSize="16px"
                >
                  {page?.content?.dialogue?.right?.role}
                </Text>
              </VStack>
              <HStack pos={["unset", "unset", "unset", "relative"]} justifyContent="flex-end" w="100%" zIndex="-1">
                <Box
                  w="100%"
                  pt="6%"
                  display={["none", "none", "none", "block"]}
                  pos={["absolute", "absolute", "absoulte", "unset"]}
                >
                  <VStack w="100%">
                    <Box textAlign="center" position="relative" mb="34px" w="max" mx={["47px", "47px", "47px", "0px"]}>
                      <Text fontSize={["16", "16", "16", "24"]} textAlign="center" fontWeight="bold">
                        {page?.content?.howSection["title 標題"]}
                      </Text>
                      <Box
                        width="6.15px"
                        height="27.69px"
                        borderRadius="5px"
                        pos="absolute"
                        right={["-6", "-6", "-6", "-12"]}
                        bottom="-3"
                        background="#fff"
                        transform="rotate(30deg)"
                      />
                      <Box
                        width="6.15px"
                        height="27.69px"
                        borderRadius="5px"
                        pos="absolute"
                        left={["-6", "-6", "-6", "-12"]}
                        bottom="-3"
                        background="#fff"
                        transform="rotate(-30deg)"
                      />
                    </Box>

                    <Box
                      padding={["16px", "16px", "16px ", "42px"]}
                      mx={["16px", "16px", "16px", "0px"]}
                      mt={["17px", "17px", "17px", "24.31px"]}
                      maxW="936px"
                      background="#fff"
                      borderRadius="22px"
                    >
                      <MultiTextRenderer
                        textAlign="center"
                        fontSize={["16", "16", "24"]}
                        data={page?.content?.howSection?.content}
                      />
                    </Box>
                  </VStack>
                </Box>
                <Image
                  pos={["unset", "unset", "unset", "absolute"]}
                  top="-80px"
                  right="40px"
                  w={["152px", "152px", "195px", "255px"]}
                  h={["206px", "206px", "286px", "346px"]}
                  src={page?.content?.dialogue?.right?.rightImage}
                />
              </HStack>
            </VStack>
          </Box>
        </Box>
        <VStack
          pb="20%"
          alignItems="center"
          w="100%"
          px="16px"
          justifyContent="center"
          display={["block", "block", "block", "none"]}
        >
          <Box position="relative" mb="34px" mx="10%">
            <Text fontSize={["16", "16", "16", "24"]} textAlign="center" fontWeight="bold">
              {page?.content?.howSection["title 標題"]}
            </Text>
            <Box
              width="6.15px"
              height="27.69px"
              borderRadius="5px"
              pos="absolute"
              right={["6", "12", "48", "-12"]}
              bottom="-3"
              background="#fff"
              transform="rotate(30deg)"
            />
            <Box
              width="6.15px"
              height="27.69px"
              borderRadius="5px"
              pos="absolute"
              left={["6", "12", "48", "-12"]}
              bottom="-3"
              background="#fff"
              transform="rotate(-30deg)"
            />
          </Box>

          <Box
            padding={["16px", "16px", "16px", " 42px"]}
            mx={["16px", "16px", "16px", "0px"]}
            mt={["17px", "17px", "17px", "24.31px"]}
            maxW="936px"
            background="#fff"
            borderRadius="22px"
          >
            <MultiTextRenderer
              textAlign="center"
              fontSize={["16", "16", "24"]}
              data={page?.content?.howSection?.content}
            />
          </Box>
        </VStack>
        <Image
          pos="absolute"
          right="0px"
          bottom="0"
          width="100%"
          objectFit="contain"
          src={page?.content?.howSection?.bottomImage}
          zIndex="0"
        />
      </Box>

      {/* resource Section */}
      <Box w="100%" bg="#FAFAFA" pos="relative">
        <VStack alignItems="start" w="100%" pt={["36px", "36px", "109px"]} maxW="1200px" mx="auto">
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
          maxW="1200px"
          mx="auto"
        >
          <Carousel responsive={responsiveCarousel} swipeable={false} draggable={false} showDots={false}>
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
                  />
                </Stack>
              )
            )}
          </Carousel>
        </Box>
        <VStack w="100%" pt="49px" spacing="24px" justifyContent="center" display={["block", "block", "none", "none"]}>
          <VStack spacing="16px" w="100%" justifyContent="center" alignItems="center">
            {(page?.content?.resourceSection?.resources.slice(0, showItems) ?? []).map(
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
                />
              )
            )}
          </VStack>
          <VStack>
            <Button
              color="black"
              borderRadius="22px"
              onClick={() => setShowItems(showItems + 1)}
              hidden={showItems >= page?.content?.resourceSection?.resources.length}
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
          px={["16px", "16px", "16px", "20%"]}
          background="#FAFAFA"
        >
          <Box display="flex" pos="relative">
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
                    <UnorderedList fontSize="12px">
                      {(page?.content?.equipSection?.left?.links ?? []).map(({ label, url }, index) => {
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
                            fontSize={["16px", "16px", "20px"]}
                          >
                            <Link isExternal textDecoration="underline" href={url}>
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
                    <UnorderedList>
                      {(page?.content?.equipSection?.topRight?.links ?? []).map(({ label, url }, index) => {
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
                            fontSize={["16px", "16px", "20px"]}
                          >
                            <Link isExternal textDecoration="underline" href={url}>
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
                  data={page?.content?.equipSection?.bottomRight?.content}
                />
                {page?.content?.equipSection?.bottomRight?.links && (
                  <Box py={["48px", "48px", "84px"]}>
                    <Text fontSize={["16px", "16px", "24px"]}>
                      {wordExtractor(page?.content?.wordings, "relatedLinks")}
                    </Text>
                    <UnorderedList>
                      {(page?.content?.equipSection?.bottomRight?.links ?? []).map(({ label, url }, index) => {
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
                            fontSize={["16px", "16px", "20px"]}
                          >
                            {" "}
                            <Link isExternal textDecoration="underline" href={url}>
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
        <Heading fontSize={["24px", "24px", "36px"]}>{page?.content?.jobOpportunitySection?.title}</Heading>

        <Text textAlign="center" pt="24px" fontSize="16px" px={["16px", "16px", "293px"]}>
          {page?.content?.jobOpportunitySection?.description}
        </Text>
        <Flex
          pb={["90px", "90px", "53px"]}
          gridGap="24px"
          flexDirection={["column", "column", "row", "row"]}
          mt={["36px", "36px", "68px"]}
        >
          {(page?.content?.jobOpportunitySection?.buttons ?? []).map(({ label, link }, index) => {
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
          })}
        </Flex>
        <Image
          left={["10%", "20%", "35%"]}
          w={["1000px", "1000px", "700px"]}
          h={["300px"]}
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

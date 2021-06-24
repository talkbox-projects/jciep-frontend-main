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
} from "@chakra-ui/react";
import { VStack, HStack, Flex } from "@chakra-ui/layout";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import wordExtractor from "../../utils/wordExtractor";
import { Carousel } from "react-responsive-carousel";
import { FaShareSquare } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
const PAGE_KEY = "resources";

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

const Resources = ({ page }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const TextTool = ({ text, link, description, pt, fontSize, hover, share, bold, small }) => {
    return (
      <Text pt={pt} _hover={hover ?? { decoration: "underline" }} color="#1E1E1E">
        <chakra.span fontSize={fontSize} fontWeight={bold ? "bold" : "normal"}>
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
          <chakra.span>
            <Tooltip hasArrow label={description} bg="white" color="#1E1E1E">
              <Icon w={small ? "16px" : "24px"} h={small ? "16px" : "24px"}>
                <AiOutlineInfoCircle />
              </Icon>
            </Tooltip>
          </chakra.span>
        )}
      </Text>
    );
  };
  const handleArrow = (val) => () => {
    if (val === "forward" && slideIndex < page?.content?.resourceSection?.resources.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else if (val === "back" && slideIndex >= 0) {
      setSlideIndex(slideIndex - 1);
    }
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
    reminder,
  }) => {
    const [show, setShow] = useState(false);
    return (
      <Box
        w={["90%", "303px", "303px", "350px"]}
        bg={topColor ? topColor : "#4E7F8E"}
        boxShadow=" 12px 12px 24px 0 rgba(30,30,30,0.1)"
        borderRadius="10px"
        pt="8px"
        mr={["", "", "24px"]}
      >
        <Box minH="571px" borderRadius="10px" bg="#FFFFFF">
          <VStack borderRadius="10px" alignItems="start" px="18px" w="100%">
            <Text pt="40px" fontSize="12px" color={topColor}>
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
            <TextTool share={true} text={organization?.text} description={organization?.description} fontSize="16px" />
            <Divider />
            <TextTool text={serviceTarget?.text} description={serviceTarget?.description} fontSize="16px" />
            <Divider />
            <UnorderedList styleConfig={{ fontSize: "4px" }}>
              {(services ?? []).map(({ category, description }, index) => {
                return (
                  <ListItem key={index} ml="63px">
                    <TextTool text={category} description={description} fontSize="12px" small />
                  </ListItem>
                );
              })}
            </UnorderedList>
            {internship?.value && (
              <TextTool
                text={wordExtractor(page?.content?.wordings, "internship")}
                description={internship?.description}
                fontSize="16px"
                pt="8px"
              />
            )}
            {probationOrReferral?.value && (
              <TextTool
                text={wordExtractor(page?.content?.wordings, "onProbation")}
                description={probationOrReferral?.description}
                fontSize="16px"
                pt="8px"
              />
            )}
            <UnorderedList>
              {(subsidy ?? []).map(({ target, description }, index) => {
                return (
                  <ListItem key={index} ml="63px">
                    <TextTool text={target} description={description} fontSize="12px" small />
                  </ListItem>
                );
              })}
            </UnorderedList>
            <Box
              transition="height 0.2s ease-out"
              overflow="hidden"
              h={show ? "100%" : "0px"}
              alignItems="start"
              spacing={0}
              w="100%"
            >
              <Divider />
              <Text pt="8px" color="#1E1E1E" fontSize="16px">
                {contact?.text}
              </Text>
              <Text color="#1E1E1E" fontSize="12px">
                {contact?.description}
              </Text>
              <Text pt="24px" color="#1E1E1E" fontSize="12px">
                {contact?.linkName}
              </Text>
              <Text pt="32px" color="#1E1E1E" fontSize="16px">
                {reminder?.text}
              </Text>
              <Text color="#1E1E1E" fontSize="12px">
                {reminder?.description}
              </Text>
            </Box>
            <Box pt="32px"></Box>
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
          </VStack>
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
        <Box mt={["30px", "50px", "80px", "300px"]} ml={["25px", "25px", "150px", "250px"]} maxW="80%">
          <Text
            w="max"
            maxW="80%"
            fontWeight="semibold"
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
                  ml={["16px", "16px", "", "325px"]}
                  w={["70%", "70%", "", "max"]}
                  borderRadius={["10px", "10px", "20px"]}
                  bg="white"
                  pos="relative"
                >
                  <MultiTextRenderer
                    key={index}
                    parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                    data={message}
                    fontSize={["14px", "14px", "16px", "20px"]}
                    textAlign={["left", "left", "center"]}
                  />
                  <Image src={page?.content?.dialogue?.tooltip} pos="absolute" bottom="-2" left="0" />
                </Box>
                <Image
                  mt={["24px", "24px", "68px"]}
                  ml={["10px", "10px", "26px", "26px"]}
                  w={["20px", "20px", "40px"]}
                  h={["16px", "16px", "32px"]}
                  src={page?.content?.dialogue?.leftQuoteImage}
                />
              </Flex>
            );
          } else {
            return (
              <Box
                mt={["16px", "16px", "18px"]}
                ml={["16px", "16px", "", "218px"]}
                w={["70%", "70%", "", "max"]}
                borderRadius={["10px", "10px", "20px"]}
                bg="white"
                pos="relative"
              >
                <MultiTextRenderer
                  key={index}
                  data={message}
                  parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                  fontSize={["14px", "14px", "16px", "20px"]}
                  textAlign={["left", "left", "center"]}
                />
                <Image src={page?.content?.dialogue?.tooltip} pos="absolute" bottom="-2" left="0" />
              </Box>
            );
          }
        })}
        <Text
          pb={["30%", "15%", "0", "0"]}
          ml={["16px", "16px", "", "211px"]}
          mt={["12px", "12px", "8px"]}
          fontSize="16px"
        >
          {page?.content?.dialogue?.left?.role}
        </Text>
        <Image
          pos="absolute"
          left={["16px", "16px", "110px"]}
          bottom={["0px", "0px", "30px", "40px"]}
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
      <Box pb={["", "", "20%", "20%"]} w="100%" pos="relative" bg="#FEB534">
        <Box pos="relative" zIndex="100" pb="15%">
          <Box
            pos={["relative", "relative", "absolute", "absolute"]}
            right={["", "", "0", "0"]}
            w="100%"
            top={["", "", "-150px", "-250px"]}
          >
            <VStack w="100%" justifyContent="right" alignItems="right">
              {(page?.content?.dialogue?.right?.dialogue ?? []).map(({ message }, index) => {
                if (index == 0) {
                  return (
                    <Flex justifyContent="flex-end" w="100%">
                      <Image
                        mt={["24px", "24px", "68px"]}
                        mr={["8px", "8px", "32px", "32px"]}
                        w={["20px", "20px", "40px"]}
                        h={["16px", "16px", "32px"]}
                        transform="rotate(180deg)"
                        src={page?.content?.dialogue?.leftQuoteImage}
                      />
                      <Box
                        mt={["24px", "24px", "68px"]}
                        mr={["16px", "16px", "230px", "230px"]}
                        w={["70%", "70%", "", "max"]}
                        borderRadius={["10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                          data={message}
                          fontSize={["14px", "14px", "16px", "20px"]}
                          textAlign={["left", "left", "center"]}
                        />
                        <Image src={page?.content?.dialogue?.rightTooltip} pos="absolute" bottom="-2" right="0" />
                      </Box>
                    </Flex>
                  );
                } else {
                  return (
                    <Flex justifyContent="flex-end" w="100%">
                      <Box
                        mt={["16px", "16px", "18px"]}
                        mr={["16px", "16px", "", "207px"]}
                        w={["70%", "70%", "", "max"]}
                        borderRadius={["10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          parentStyles={{ padding: "5px", paddingLeft: "10px" }}
                          data={message}
                          fontSize={["14px", "14px", "16px", "20px"]}
                          textAlign={["left", "left", "center"]}
                        />
                        <Image src={page?.content?.dialogue?.rightTooltip} pos="absolute" bottom="-2" right="0" />
                      </Box>
                    </Flex>
                  );
                }
              })}
              <VStack justifyContent="right" alignItems="right" w="100%">
                <Text textAlign="right" mr={["16px", "16px", "", "207px"]} mt={["12px", "12px", "8px"]} fontSize="16px">
                  {page?.content?.dialogue?.right?.role}
                </Text>
              </VStack>
              <HStack pos={["unset", "unset", "relative", "relative"]} justifyContent="flex-end" w="100%" zIndex="-1">
                <Box
                  w="100%"
                  pt="6%"
                  display={["none", "none", "block", "block"]}
                  pos={["absolute", "absolute", "unset", "unset"]}
                >
                  <VStack w="100%">
                    <Box textAlign="center" position="relative" mb="34px" w="max" mx={["47px", "47px", "0px"]}>
                      <Text fontSize={["16", "16", "24"]} textAlign="center" fontWeight="bold">
                        {page?.content?.howSection["title 標題"]}
                      </Text>
                      <Box
                        width="6.15px"
                        height="27.69px"
                        borderRadius="5px"
                        pos="absolute"
                        right={["-6", "-6", "-12"]}
                        bottom="-3"
                        background="#fff"
                        transform="rotate(30deg)"
                      />
                      <Box
                        width="6.15px"
                        height="27.69px"
                        borderRadius="5px"
                        pos="absolute"
                        left={["-6", "-6", "-12"]}
                        bottom="-3"
                        background="#fff"
                        transform="rotate(-30deg)"
                      />
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
                        data={page?.content?.howSection?.content}
                      />
                    </Box>
                  </VStack>
                </Box>
                <Image
                  pos={["unset", "unset", "absolute", "absolute"]}
                  top="-80px"
                  right="40px"
                  w={["152px", "152px", "255px", "255px"]}
                  h={["206px", "206px", "346px", "346px"]}
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
          display={["block", "block", "none", "none"]}
        >
          <Box position="relative" mb="34px" mx="10%">
            <Text fontSize={["16", "16", "24"]} textAlign="center" fontWeight="bold">
              {page?.content?.howSection["title 標題"]}
            </Text>
            <Box
              width="6.15px"
              height="27.69px"
              borderRadius="5px"
              pos="absolute"
              right={["-6", "-6", "-12"]}
              bottom="-3"
              background="#fff"
              transform="rotate(30deg)"
            />
            <Box
              width="6.15px"
              height="27.69px"
              borderRadius="5px"
              pos="absolute"
              left={["-6", "-6", "-12"]}
              bottom="-3"
              background="#fff"
              transform="rotate(-30deg)"
            />
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
        <VStack alignItems="start" w="100%" pt={["36px", "36px", "109px"]}>
          <VStack alignItems="start" w="100%" px={["16px", "16px", "207px", "207px"]}>
            <Heading fontSize={["24px", "24px", "36px", "54px"]}>
              {page?.content?.resourceSection["title 標題"]}
            </Heading>
          </VStack>
        </VStack>
        <Box display={["none", "none", "block", "block"]} pt="110px" overflow="hidden" pos="relative">
          <Button
            aria-label="Previous slide"
            pos="absolute"
            bg="transparent"
            border="none"
            top={["20%", "20%", "50%"]}
            left={["10px", "20%", "50"]}
            _hover="none"
            disabled={slideIndex <= 0}
            zIndex={1}
            onClick={handleArrow("back")}
          >
            <Image src={page?.content?.resourceSection?.leftArrow} />
          </Button>
          <Flex
            direction="row"
            ml="350px"
            verticalAlign="top"
            mb="300px"
            alignItems="flex-start"
            width={`${page?.content?.resourceSection?.resources.length * 100}vw`}
            transform={`translateX(-${25 * slideIndex}vw)`}
            transition="transform 0.5s"
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
                <Stack align="center" justifyContent="center">
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
                </Stack>
              )
            )}
          </Flex>
          <Button
            aria-label="Next slide"
            pos="absolute"
            bg="transparent"
            border="none"
            top={["20%", "20%", "50%"]}
            right={["10px", "10px", "50"]}
            _hover="none"
            disabled={slideIndex >= page?.content?.resourceSection?.resources.length - 4}
            onClick={handleArrow("forward")}
          >
            <Image src={page?.content?.resourceSection?.rightArrow} />
          </Button>
        </Box>
        <VStack
          w="100%"
          pt="49px"
          spacing="24px"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          display={["block", "block", "none", "none"]}
        >
          <VStack w="100%" justifyContent="center" alignItems="center">
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
        </VStack>
      </Box>

      {/* Equip Section */}
      <Box pt={["25px", "25px", "50px"]} px={["16px", "16px", "14%"]} background="#FAFAFA">
        <Box display="flex" pos="relative">
          <Box mt={["110px", "110px", "80px"]}>
            <Text fontSize={["24px", "24px", "56px"]} fontWeight="bold">
              {wordExtractor(page?.content?.wordings, "equip")}
            </Text>
          </Box>
        </Box>

        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(6, 1fr)"
          gap="24px"
          justifyContent="center"
          mt="26px"
          position="relative"
          zIndex="1"
        >
          <GridItem rowSpan={[0, 0, 2, 2]} colSpan={[6, 6, 3, 3]}>
            <Box
              background="#FFFFFF"
              borderRadius="10"
              h="100%"
              px={["16px", "16px", "24px"]}
              display="flex"
              flexDirection="column"
            >
              <MultiTextRenderer
                fontSize={["24px", "24px", "36px"]}
                data={page?.content?.equipSection?.left?.content}
              />
              <Box pt="56px">
                <UnorderedList>
                  {(page?.content?.equipSection?.left?.links ?? []).map(({ label, url }, index) => {
                    return <ListItem fontSize={["16px", "16px", "20px"]}>{label}</ListItem>;
                  })}
                </UnorderedList>
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={[6, 6, 3, 3]}>
            <Box
              background="#FFFFFF"
              borderRadius="10"
              h="100%"
              px={["16px", "16px", "24px"]}
              display="flex"
              flexDirection="column"
            >
              <MultiTextRenderer
                fontSize={["24px", "24px", "36px"]}
                data={page?.content?.equipSection?.topRight?.content}
              />
              <Box pt="56px">
                <UnorderedList>
                  {(page?.content?.equipSection?.topRight?.links ?? []).map(({ label, url }, index) => {
                    return <ListItem fontSize={["16px", "16px", "20px"]}>{label}</ListItem>;
                  })}
                </UnorderedList>
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={[6, 6, 3, 3]}>
            <Box
              background="#FFFFFF"
              borderRadius="10"
              h="100%"
              px={["16px", "16px", "24px"]}
              display="flex"
              flexDirection="column"
            >
              <MultiTextRenderer
                fontSize={["24px", "24px", "36px"]}
                data={page?.content?.equipSection?.bottomRight?.content}
              />
              <Box pt="56px">
                <UnorderedList>
                  {(page?.content?.equipSection?.bottomRight?.links ?? []).map(({ label, url }, index) => {
                    return <ListItem fontSize={["16px", "16px", "20px"]}>{label}</ListItem>;
                  })}
                </UnorderedList>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </VStack>
  );
};

export default withPageCMS(Resources, {
  key: PAGE_KEY,
  fields: resourceFieldsForCMS,
});

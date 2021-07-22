import { useRouter } from "next/router";
import { VStack, Box, Text, Grid } from "@chakra-ui/layout";
import {
  Image,
  chakra,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  AspectRatio,
  Link,
  SimpleGrid,
  GridItem,
  HStack,
  Icon,
  Wrap,
  WrapItem,
  Divider,
  Tooltip,
  Stack,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import pwdFieldsForCMS from "../../utils/tina/pwdFieldsForCMS";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import React from "react";
import Container from "../../components/Container";
import {
  AiFillInfoCircle,
  AiOutlineBulb,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import DividerA from "../../components/DividerA";
import DividerTriple from "../../components/DividerTriple";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import HighlightHeadline from "../../components/HighlightHeadline";

const PAGE_KEY = "pwd";

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

const PwdDetail = ({ page }) => {
  const router = useRouter();
  const slug = router.query.slug;
  const pwd = (page?.content?.pwdList?.pwds ?? [])?.find(
    (x) => x.slug === slug
  );
  const [activeJob, setActiveJob] = React.useState("");
  const [activeJobItems, setActiveJobItems] = React.useState([]);
  const [remainingPwds, setRemainingPwds] = React.useState([]);

  React.useEffect(() => {
    if (pwd) {
      performSelection(pwd?.careerSection?.sections ?? [], "");

      if (page?.content?.pwdList?.pwds) {
        const remaining = [];
        const pwds = page.content.pwdList.pwds;
        let currentIndex = pwds.findIndex((data) => data.slug === pwd.slug);
        for (let i = 1; i <= 3; i++) {
          if (currentIndex + i < pwds.length - 1) {
            remaining.push(pwds[currentIndex + i]);
          } else {
            currentIndex = -1;
            remaining.push(pwds[currentIndex + i]);
          }
        }
        setRemainingPwds(remaining);
      }
    }
  }, [page.content.pwdList.pwds, pwd]);

  const performSelection = (data, item) => {
    setActiveJob(item);
    const section = item ? data.find((x) => x.id === item) : data[0];
    if (section) {
      setActiveJobItems(section.items ?? []);
    } else {
      setActiveJobItems([]);
    }
  };

  return (
    <VStack w="100%" align="stretch" spacing={0}>
      {/* Description Section */}
      <Box
        bg={pwd?.descriptionStyles?.bgColor}
        w="100%"
        pt={["36px", "36px", "53px"]}
        overflow="hidden"
        position="relative"
        display="flex"
        alignItems="center"
        flexDirection="column"
        pb={["146px", "146px", "222px"]}
        px={["16px", "16px", "0px"]}
      >
        <Box
          background="#fff"
          width={["100px", "100px", "124px"]}
          height={["100px", "100px", "124px"]}
          mt={["55px", "55px", "116px"]}
          mb={["24px", "24px", "48px"]}
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={2}
        >
          <Image src={pwd?.icon} height={[16, 16, 88]} />
        </Box>
        <HStack zIndex={2} fontSize={["24", "24", "56"]}>
          <Text fontWeight="bold">{pwd?.name}</Text>
          {pwd?.remark && (
            <Tooltip hasArrow label={pwd?.remark}>
              <Text d="inline">
                <Icon as={AiOutlineInfoCircle}></Icon>
              </Text>
            </Tooltip>
          )}
        </HStack>
        <Box zIndex={2}>
          <MultiTextRenderer
            textAlign="center"
            fontSize={["16", "16", "24", "24"]}
            data={pwd?.description}
          />
        </Box>
        <Image
          pos="absolute"
          bottom="0"
          right="0"
          height="86%"
          src={pwd?.descriptionStyles?.bgGradient}
          zIndex={1}
        />
        <Box pos="absolute" bottom="0" w="100%">
          <DividerA
            primaryColor="rgb(246,214,68)"
            secondaryColor="white"
            nextColor="rgb(0, 191,186)"
          />
        </Box>
      </Box>

      {/* Q&A Section */}
      <Box
        pt={["54", "54", "65"]}
        pb={["160", "160", "240"]}
        pos="relative"
        background={pwd?.qnaStyles?.bgColor}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <VStack spacing={24}>
          {(pwd?.qna ?? []).map((qnGroup, i) => (
            <Box
              key={i}
              pos="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box pos="relative" maxW="80%">
                <ApostropheHeadline>
                  {qnGroup.accordionGroup?.title}
                </ApostropheHeadline>
              </Box>
              <Accordion allowToggle mt={["24px", "24px", 8]} zIndex={2}>
                {(qnGroup.accordionGroup?.accordions ?? []).map(
                  (qna, index) => (
                    <AccordionItem
                      background="#fff"
                      borderRadius={10}
                      key={index}
                      mt={index > 0 ? "16px" : "0px"}
                      border="none"
                      w={["288px", "288px", "616px"]}
                    >
                      {({ isExpanded }) => (
                        <>
                          <h2>
                            <AccordionButton>
                              <Box
                                p={2}
                                flex="1"
                                textAlign="center"
                                fontWeight="bold"
                              >
                                {qna.question}
                              </Box>
                              {isExpanded ? (
                                <MinusIcon fontSize="12px" />
                              ) : (
                                <AddIcon fontSize="12px" />
                              )}
                            </AccordionButton>
                          </h2>
                          {isExpanded && (
                            <Divider m="auto" w="95%" color="#eee" />
                          )}
                          <AccordionPanel pt={4} pb={8}>
                            <MultiTextRenderer
                              textAlign="center"
                              fontSize={16}
                              data={qna.response}
                            />
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </Box>
          ))}
        </VStack>

        <Image
          src={pwd?.qnaStyles?.imageTop}
          pos="absolute"
          left={["-10%", "0%", "16%"]}
          top="41px"
          w={["37%", "37%", "19%"]}
          zIndex="0"
        />
        <Image
          src={pwd?.qnaStyles?.imageBottom}
          pos="absolute"
          right={["9%", "10%", "16%"]}
          bottom={["30px", "38px", "94px"]}
          w={["37%", "37%", "19%"]}
          zIndex="0"
        />
        <Box pos="absolute" bottom="0" w="100%">
          <DividerA
            primaryColor="rgb(246,214,68)"
            secondaryColor="rgb(254,181,52)"
            nextColor="rgb(250,250,250)"
          />
        </Box>
      </Box>

      {/* Traits Section */}
      <Box
        pb={["80px", "80px", "56px"]}
        px={["16px", "16px", "14%"]}
        background={pwd?.traitSection?.bgColor}
      >
        <Box display="flex" pos="relative">
          <Box zIndex={2} mt={["110px", "110px", "80px"]}>
            <Text fontSize={["24px", "24px", "56px"]} fontWeight="bold">
              {pwd?.traitSection?.title}
            </Text>
            <Text zIndex={2} fontSize="16px" position="relative">
              {pwd?.traitSection?.description}
            </Text>
          </Box>
          <Image
            src={pwd?.traitSection?.imageTop}
            w={["91px", "91px", "190px"]}
            h={["123px", "123px", "auto"]}
            pos="absolute"
            top="57px"
            right="41px"
            zIndex="0"
          />
        </Box>

        <Stack
          position="relative"
          direction={["column", "row"]}
          mt={16}
          zIndex={2}
          spacing={16}
        >
          <VStack minW="50%" spacing={8}>
            <Box w="100%" py={2} borderBottom="1px">
              <Heading size="lg">
                {pwd?.traitSection?.prosSection?.title}
              </Heading>
            </Box>
            {pwd?.traitSection?.prosSection?.list?.map((text, i) => (
              <HStack spacing={4} w="100%" key={i} minH="32px">
                <Image src={pwd?.traitSection?.prosSection?.icon} w="32px" />
                <Text fontSize="lg">{text}</Text>
              </HStack>
            ))}
          </VStack>
          <VStack minW="50%" spacing={8}>
            <Box w="100%" py={2} borderBottom="1px">
              <Heading size="lg">
                {pwd?.traitSection?.consSection?.title}
              </Heading>
            </Box>
            {pwd?.traitSection?.consSection?.list?.map((text, i) => (
              <HStack spacing={4} w="100%" key={i} minH="32px">
                <Image src={pwd?.traitSection?.consSection?.icon} w="32px" />
                <Text fontSize="lg">{text}</Text>
              </HStack>
            ))}
          </VStack>
        </Stack>
        {/* <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
          ]}
          gap="24px"
          justifyContent="center"
          mt={16}
          position="relative"
          zIndex="1"
        >
          {(pwd?.traitSection?.traits ?? []).map((trait, index) => (
            <Box
              key={index}
              background={trait.color}
              height={["170px", "170px", "220px"]}
              borderRadius="10"
              px={["16px", "16px", "24px"]}
              pb={["16px", "16px", "24px"]}
              justifyContent="flex-end"
              display="flex"
              flexDirection="column"
              transition="all 0.2s"
              cursor="default"
            >
              <Text fontSize="lg">{trait.captionTop}</Text>
              <Text fontSize={["2xl", "2xl", "2xl"]} fontWeight="bold">
                {trait.text}
              </Text>
            </Box>
          ))}
        </Grid> */}
        <Text mt={["56px", "56px", "80px"]} fontSize="14px">
          {(pwd?.traitSection?.extraInfo ?? []).map((data, index) => (
            <chakra.span key={index}>{data.text}</chakra.span>
          ))}
        </Text>
      </Box>

      {/* Career Section */}
      <Box
        pb={["88px", "88px", "154px"]}
        pt={["34px", "34px", "41px"]}
        px={["16px", "16px", "14%"]}
        background={pwd?.careerSection?.bgColor}
        display="flex"
        flexDirection="column"
        alignItems="center"
        pos="relative"
        overflow="hidden"
      >
        <Box pos="relative">
          <ApostropheHeadline>{pwd?.careerSection?.title}</ApostropheHeadline>
        </Box>
        <Text mt={8} fontSize={["xl"]}>
          {pwd?.careerSection?.description}
        </Text>

        <Container mt={["24px", "24px", "48px"]} pb={24}>
          <Box display="flex" justifyContent="center">
            {(pwd?.careerSection?.sections ?? []).map((section, i) => {
              const active = activeJob ? activeJob === section.id : i === 0;
              return (
                <Button
                  bg={active ? "#000" : "transparent"}
                  color={active ? "#fff" : "#000"}
                  borderColor={active ? "#000" : "#000"}
                  borderWidth={2}
                  variant="outline"
                  key={i}
                  onClick={() =>
                    performSelection(
                      pwd?.careerSection?.sections ?? [],
                      section.id
                    )
                  }
                  borderRadius={19}
                  _hover={{ color: "#fff", background: "#00000030" }}
                  _active={{ color: "#fff", background: "#00000080" }}
                  mr={i === 0 ? "16px" : "0px"}
                  mb={["24px", "24px", "48px"]}
                >
                  {section.jobType}
                </Button>
              );
            })}
          </Box>

          <SimpleGrid columns={[1, 2, 2, 2]} spacing={16} align="start">
            {activeJobItems.map((item, index) => (
              <GridItem key={index} w="100%">
                <HStack align="start" spacing={4} w="100%">
                  <Icon fontSize="2xl" as={AiOutlineBulb} color="white" />
                  <Text fontSize="xl" flex={1} minW={0} w="100%">
                    {item.caption}
                  </Text>
                </HStack>
              </GridItem>
            ))}
          </SimpleGrid>
          {pwd?.careerSection?.extraInfo?.length > 0 && (
            <Box
              mt={["56px", "56px", "80px"]}
              zIndex={3}
              p={4}
              bg="white"
              borderRadius="xl"
            >
              <HStack>
                <Icon
                  as={AiFillInfoCircle}
                  fontSize="48px"
                  color="rgb(252,210,0)"
                />
                <Text fontSize="14px">
                  {(pwd?.careerSection?.extraInfo ?? []).map((data, index) => (
                    <chakra.span key={index}>{data.text}</chakra.span>
                  ))}
                </Text>
              </HStack>
            </Box>
          )}
        </Container>

        <Box>
          <Image
            src={pwd?.careerSection?.personLeft}
            pos="absolute"
            left="5%"
            bottom={["-10%", "-10%", "-20%", "-25%"]}
            w={["133px", "133px", "276px"]}
          />
        </Box>

        <Box>
          <Image
            src={pwd?.careerSection?.personRight}
            pos="absolute"
            right="5%"
            bottom={["-5%", "-5%", "-10%"]}
            w={["174px", "174px", "366px"]}
          />
        </Box>

        <Box pos="absolute" bottom={0} w="100%">
          <DividerTriple
            primaryColor="rgb(246,214,68)"
            secondaryColor="transparent"
            nextColor="rgb(246,214,68)"
          />
        </Box>
      </Box>

      {/* Videos & Reference Section */}
      <Box
        pb={["138px", "138px", "300px"]}
        pt={["46px", "46px", "53px"]}
        background={pwd?.videoSection?.bgColor}
        display="flex"
        flexDirection="column"
        alignItems="center"
        pos="relative"
        overflow="hidden"
      >
        <Box mx="46px" zIndex={2}>
          <HighlightHeadline bgColor="white">
            {pwd?.videoSection?.title}
          </HighlightHeadline>
        </Box>

        <Box
          pos="relative"
          mt={["45px", "45px", "59px"]}
          mb={["20px", "20px", "27px"]}
          px={["46px"]}
          zIndex={2}
        >
          <ApostropheHeadline fontSize={["xl", "2xl"]}>
            {pwd?.videoSection?.description}
          </ApostropheHeadline>
        </Box>

        <Box
          w="100%"
          h="100%"
          pos="relative"
          mb={["36px", "36px", "105px"]}
          px="24px"
          zIndex={2}
        >
          <Image
            src={pwd?.videoSection?.leftImage}
            pos="absolute"
            left={["0", "0", "0", "5%", "16%", "25%"]}
            top="0"
            w={["0", "0", "0", "184px"]}
          />
          <Image
            src={pwd?.videoSection?.rightImage}
            pos="absolute"
            right={["0", "0", "0", "5%", "18%", "25%"]}
            bottom="0"
            w={["0", "0", "0", "145px"]}
          />
          {pwd?.videoSection?.videos.map((video, i) => (
            <AspectRatio
              key={i}
              border="5px solid #FFFFFF"
              maxW="668px"
              ratio={668 / 376}
              margin="auto"
              px={["24px", "24px", "0"]}
              mb={["24px", "24px", "24px"]}
            >
              <iframe
                src={video.url}
                title="PWD Video"
                frameBorder="0"
                allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          ))}
        </Box>

        {/* References */}
        <Wrap
          spacing={["36px", "36px", "66px"]}
          px="16px"
          justify="center"
          zIndex={2}
        >
          {(pwd?.referenceSection?.category ?? []).map((category, index) => (
            <WrapItem key={index}>
              <Box w="100%" display="flex" flexDirection="column">
                <Image
                  src={pwd?.referenceSection?.categoryIcon}
                  w="36px"
                  mb="6px"
                />
                <Text fontSize={["20px", "20px", "24px"]} fontWeight="bold">
                  {category.title}
                </Text>
                <Box
                  w="100%"
                  minW={0}
                  flex={1}
                  borderBottom="1px solid #1E1E1E"
                  mb="8px"
                />
                {(category.links ?? []).map((link, i) => (
                  <Box key={i} display="flex" pb="6px">
                    <Text pr="8px" fontSize="16px">
                      .
                    </Text>
                    <Link href={link.url} textDecoration="underline" isExternal>
                      {link.label} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Box>
                ))}
              </Box>
            </WrapItem>
          ))}
        </Wrap>

        <Image
          pos="absolute"
          bottom="0"
          right="0"
          height="100%"
          src={pwd?.referenceSection?.gradient}
          zIndex={0}
        />
        <Box pos="absolute" bottom={0} width="100%">
          <DividerTriple
            primaryColor="rgb(0,191,186)"
            secondaryColor="rgb(217,217,217)"
            nextColor="white"
          />
        </Box>
      </Box>

      {/* Last Section */}
      <Box
        bg="#fff"
        pt="20px"
        pb={["146px", "146px", "400px"]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="hidden"
        position="relative"
      >
        <Box pos="relative">
          <ApostropheHeadline fontSize={["xl", "2xl"]} color="rgb(246,214,68)">
            {pwd?.othersSection?.title}
          </ApostropheHeadline>
        </Box>
        <Grid
          templateColumns={[
            "repeat(2, 1fr)",
            "repeat(2, 1fr)",
            "repeat(4, 1fr)",
          ]}
          gap={["16px", "16px", "24px"]}
          mt={["36px", "56px"]}
          justifyContent="center"
          w="100%"
          px="10%"
        >
          {(remainingPwds ?? []).map((data, i) => (
            <Box
              key={i}
              transition="all 0.2s"
              w="100%"
              h={["132px", "132px", "122px"]}
              bg="#FAFAFA"
              borderRadius="10px"
              cursor="pointer"
              _hover={{
                boxShadow: "12px 12px 24px 0px rgba(30,30,30,0.1)",
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              px="12px"
              onClick={() => router.push(`${data.slug}`)}
            >
              <Image src={data.icon} h="48px" w="48px" />
              <Text fontSize={["16px", "16px", "24px"]} textAlign="center">
                {data.name}
              </Text>
            </Box>
          ))}
          <Box
            transition="all 0.2s"
            w="100%"
            h={["132px", "132px", "122px"]}
            bg="#FAFAFA"
            borderRadius="10px"
            cursor="pointer"
            _hover={{
              boxShadow: "12px 12px 24px 0px rgba(30,30,30,0.1)",
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            px="12px"
            onClick={() => router.push("/people-with-disabilities#list")}
          >
            <Icon as={HiOutlineDotsHorizontal} h="48px" w="48px" />
            <Text fontSize={["16px", "16px", "24px"]} textAlign="center">
              顯示更多
            </Text>
          </Box>
        </Grid>
        <Image
          pos="absolute"
          right={["9%", "9%", "19%"]}
          bottom="0"
          h={["146px", "146px", "350px"]}
          src={pwd?.othersSection?.bottomImage}
          zIndex="1"
        />
        <Box pos="absolute" bottom="0" width="100%">
          <DividerA
            primaryColor="rgb(0,191,186)"
            secondaryColor="rgb(254,181,52)"
            nextColor="white"
          />
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(PwdDetail, {
  key: PAGE_KEY,
  fields: pwdFieldsForCMS,
});

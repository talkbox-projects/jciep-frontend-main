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
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import pwdFieldsForCMS from "../../utils/tina/pwdFieldsForCMS";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import wordExtractor from "../../utils/wordExtractor";
import React from "react";

const PAGE_KEY = "pwd";

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

const PwdDetail = ({ page }) => {
  const router = useRouter();
  const slug = router.query.slug;
  const pwd = (page?.content?.pwdList?.pwds ?? [])?.find((x) => x.slug === slug);
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
        for (let i = 1; i <= 4; i++) {
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
  }, [pwd]);

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
        >
          <Image src={pwd?.icon} height={["64", "64", "88"]} />
        </Box>
        <Text fontWeight="bold" fontSize={["24", "24", "56"]}>
          {pwd?.name}
        </Text>
        <MultiTextRenderer textAlign="center" fontSize={["16", "16", "24", "24"]} data={pwd?.description} />
        <Image pos="absolute" bottom="0" right="0" height="86%" src={pwd?.descriptionStyles?.bgGradient} />
        <Image pos="absolute" bottom="0" src={pwd?.descriptionStyles?.bottomBorder} width="100%" fit="contain" />
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
        {(pwd?.qna ?? []).map((qnGroup, i) => (
          <Box key={i} pos="relative" display="flex" flexDirection="column" alignItems="center" pb="16px">
            <Box pos="relative">
              <Text fontSize={["24", "24", "36"]}>{qnGroup.accordionGroup?.title}</Text>
              <Box
                width="6.15px"
                height="27.69px"
                borderRadius="5px"
                pos="absolute"
                right={["-6", "-6", "-12"]}
                bottom="0"
                background="#fff"
                transform="rotate(30deg)"
              />
              <Box
                width="6.15px"
                height="27.69px"
                borderRadius="5px"
                pos="absolute"
                left={["-6", "-6", "-12"]}
                bottom="0"
                background="#fff"
                transform="rotate(-30deg)"
              />
            </Box>
            <Accordion allowToggle mt={["24px", "24px", "55px"]} zIndex={2}>
              {(qnGroup.accordionGroup?.accordions ?? []).map((qna, index) => (
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
                          <Box flex="1" textAlign="center" fontWeight="bold">
                            {qna.question}
                          </Box>
                          {isExpanded ? <MinusIcon fontSize="12px" /> : <AddIcon fontSize="12px" />}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <MultiTextRenderer textAlign="center" fontSize={16} data={qna.response} />
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        ))}

        <Image
          src={pwd?.qnaStyles?.imageTop}
          pos="absolute"
          left={["-10%", "0%", "16%"]}
          top="41px"
          w={["37%", "37%", "19%"]}
          zIndex="0"
        />
        <Box>
          <Image
            src={pwd?.qnaStyles?.imageBottom}
            pos="absolute"
            right={["9%", "10%", "16%"]}
            bottom={["30px", "38px", "94px"]}
            h={["128px", "128px", "168px"]}
            w={["96px", "96px", "auto"]}
            zIndex="1"
          />
          <Box
            width={["118px", "118px", "230px"]}
            height={["118px", "118px", "230px"]}
            background="#08A3A3"
            borderRadius="50%"
            position="absolute"
            right={["8%", "9%", "14%"]}
            bottom={["30px", "38px", "94px"]}
            zIndex="0"
          />
        </Box>
        <Image pos="absolute" bottom="0" src={pwd?.qnaStyles?.bottomBorder} width="100%" fit="contain" zIndex={2} />
      </Box>

      {/* Traits Section */}
      <Box pb={["80px", "80px", "56px"]} px={["16px", "16px", "14%"]} background={pwd?.traitSection?.bgColor}>
        <Box display="flex" pos="relative">
          <Box mt={["110px", "110px", "80px"]}>
            <Text fontSize={["24px", "24px", "56px"]} fontWeight="bold">
              {wordExtractor(page?.content?.wordings, "traitSectionTitle")}
            </Text>
            <Text fontSize="16px" position="relative" zIndex="1">
              {wordExtractor(page?.content?.wordings, "traitSectionDescription")}
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
          <chakra.span
            pos="absolute"
            fontSize={["33px", "33px", "56"]}
            fontWeight="bold"
            top={["56px", "56px", "65px"]}
            right={["86px", "86px", "146px"]}
          >
            ?
          </chakra.span>
          <Image
            src={pwd?.traitSection?.svgObject}
            w={["91px", "91px", "190px"]}
            pos="absolute"
            top={["44px", "44px", "0px"]}
            right="44px"
          />
        </Box>

        <Grid
          templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]}
          gap="24px"
          justifyContent="center"
          mt="26px"
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
              _hover={{
                boxShadow: "12px 12px 24px 0px #1E1E1E10",
                cursor: "pointer",
              }}
            >
              <Text fontSize="14px">{trait.captionTop}</Text>
              <Text fontSize={["24px", "24px", "36px"]} fontWeight="bold">
                {trait.text}
              </Text>
            </Box>
          ))}
        </Grid>
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
          <Text fontSize={["24", "24", "36"]}>{wordExtractor(page?.content?.wordings, "jobTypeSectionTitle")}</Text>
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            right={["-6", "-6", "-12"]}
            bottom="0"
            background="#fff"
            transform="rotate(30deg)"
          />
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            left={["-6", "-6", "-12"]}
            bottom="0"
            background="#fff"
            transform="rotate(-30deg)"
          />
        </Box>
        <Text fontSize={["14", "14", "16"]}>{wordExtractor(page?.content?.wordings, "jobTypeSectionDescription")}</Text>

        <Box mt={["24px", "24px", "48px"]}>
          <Box display="flex" justifyContent="center">
            {(pwd?.careerSection?.sections ?? []).map((section, i) => {
              const active = activeJob ? activeJob === section.id : i === 0;
              return (
                <Button
                  bg={active ? "#000" : "transparent"}
                  color={active ? "#fff" : "#000"}
                  borderColor={active ? "#fff" : "#000"}
                  variant="outline"
                  key={i}
                  onClick={() => performSelection(pwd?.careerSection?.sections ?? [], section.id)}
                  borderRadius={19}
                  _hover={{ color: "#fff", background: "#00000030" }}
                  mr={i === 0 ? "16px" : "0px"}
                  mb={["24px", "24px", "48px"]}
                >
                  {section.jobType}
                </Button>
              );
            })}
          </Box>

          <Grid
            templateColumns={["repeat(1, 288px)", "repeat(1, 288px)", "repeat(2, 320px)"]}
            gap={["16px", "16px", "48px"]}
          >
            {activeJobItems.map((item, i) => (
              <Box key={i} bg="#fff" borderRadius="24px" border="1px solid #fff" zIndex={3}>
                <Image src={item.image} />
                <Box
                  h={["76px", "76px", "92px"]}
                  verticalAlign="center"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text>{item.caption}</Text>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>

        <Box>
          <Image
            src={pwd?.careerSection?.personLeftPolygon}
            pos="absolute"
            left="10%"
            bottom="0"
            w={["133px", "133px", "276px"]}
          />
          <Image
            src={pwd?.careerSection?.personLeft}
            pos="absolute"
            left="10%"
            bottom="0"
            w={["80px", "80px", "165px"]}
          />
        </Box>

        <Box>
          <Image
            src={pwd?.careerSection?.personRightPolygon}
            pos="absolute"
            right="1%"
            bottom={["-87px", "-87px", "-183px"]}
            w={["174px", "174px", "366px"]}
          />
          <Image
            src={pwd?.careerSection?.personRight}
            pos="absolute"
            right="10%"
            bottom="0"
            w={["93px", "93px", "195px"]}
          />
        </Box>

        <Image
          pos="absolute"
          bottom="-1px"
          src={pwd?.careerSection?.borderBottom}
          width="100%"
          fit="contain"
          zIndex={2}
        />
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
        <Box mx="46px">
          <chakra.span
            textAlign="center"
            lineHeight={2}
            fontWeight="bold"
            fontSize={["24px", "24px", "36px"]}
            zIndex="1"
            pos="relative"
            backgroundImage="linear-gradient(#fff, #fff)"
            backgroundRepeat="no-repeat"
            backgroundPosition="0 0.5em"
            pl="5px"
            pb="16px"
          >
            {wordExtractor(page?.content?.wordings, "videosTitle")}
          </chakra.span>
        </Box>

        <Box pos="relative" mt={["45px", "45px", "59px"]} mb={["20px", "20px", "27px"]} px={["46px"]}>
          <Text fontSize={["16", "16", "24"]} textAlign="center">
            {pwd?.videoSection?.description}
          </Text>
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            right={["26px", "26px", "18.94px"]}
            bottom={["0", "0", "-10px"]}
            background="#fff"
            transform="rotate(30deg)"
          />
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            left={["26px", "26px", "10.94px"]}
            bottom={["0", "0", "-10px"]}
            background="#fff"
            transform="rotate(-30deg)"
          />
        </Box>

        <Box w="100%" h="100%" pos="relative" mb={["36px", "36px", "105px"]} px="24px">
          <Image src={pwd?.videoSection?.leftImage} pos="absolute" left="16%" top="0" w={["0", "0", "184px"]} />
          <Image src={pwd?.videoSection?.rightImage} pos="absolute" right="18%" bottom="0" w={["0", "0", "145px"]} />
          {pwd?.videoSection?.videos.map((video) => (
            <AspectRatio
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
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </AspectRatio>
          ))}
        </Box>

        {/* References */}
        <Grid
          templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]}
          gap={["36px", "36px", "66px"]}
          px="16px"
        >
          {(pwd?.referenceSection?.category ?? []).map((category, index) => (
            <Box key={index}>
              <Box w="100%" display="flex" flexDirection="column" borderBottom="1px solid #1E1E1E" mb="8px">
                <Image src={pwd?.referenceSection?.categoryIcon} w="36px" mb="6px" />
                <Text fontSize={["20px", "20px", "24px"]} fontWeight="bold">
                  {category.title}
                </Text>
              </Box>

              <Box display="flex" flexDirection="column">
                {(category.links ?? []).map((link, i) => (
                  <Box display="flex" pb="6px">
                    <Text pr="8px" fontSize="16px">
                      .
                    </Text>
                    <Link href={link.url} textDecoration="underline" isExternal>
                      {link.label} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Grid>
        <Image pos="absolute" bottom="0" right="0" height="100%" src={pwd?.referenceSection?.gradient} />
        <Image
          pos="absolute"
          bottom="-1px"
          src={pwd?.referenceSection?.borderBottom}
          width="100%"
          fit="contain"
          zIndex={1}
        />
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
      >
        <Box pos="relative">
          <Text fontSize={["24", "24", "36"]}>{wordExtractor(page?.content?.wordings, "otherPwdSectionType")}</Text>
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            right={["-6", "-6", "-12"]}
            bottom="0"
            background="#F6D644"
            transform="rotate(30deg)"
          />
          <Box
            width="6.15px"
            height="27.69px"
            borderRadius="5px"
            pos="absolute"
            left={["-6", "-6", "-12"]}
            bottom="0"
            background="#F6D644"
            transform="rotate(-30deg)"
          />
        </Box>
        <Grid
          templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
          gap={["16px", "16px", "24px"]}
          mt={["36px", "56px"]}
          justifyContent="center"
          w="100%"
          px="10%"
        >
          {(remainingPwds ?? []).map((data) => (
            <Box
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
        </Grid>
        <Image
          pos="absolute"
          left={["9%", "9%", "19%"]}
          bottom="0"
          h={["146px", "146px", "350px"]}
          src={pwd?.othersSection?.bottomImage}
          zIndex="1"
        />
        <Image
          pos="absolute"
          bottom="-1px"
          src={pwd?.othersSection?.borderBottom}
          width="100%"
          fit="contain"
          zIndex={0}
        />
      </Box>
    </VStack>
  );
};

export default withPageCMS(PwdDetail, {
  key: PAGE_KEY,
  fields: pwdFieldsForCMS,
});

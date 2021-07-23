import React, { useRef } from "react";
import { Stack, Box, Text, VStack } from "@chakra-ui/layout";
import withPageCMS from "../utils/page/withPageCMS";
import { getPage } from "../utils/page/getPage";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import {
  Icon,
  SimpleGrid,
  Grid,
  chakra,
  GridItem,
  Heading,
  Image,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Link,
  TabPanel,
  AspectRatio,
  IconButton,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import Container from "../components/Container";
import metaTextTemplates from "../utils/tina/metaTextTemplates";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useCallback, useState } from "react";
import DividerSimple from "../components/DividerSimple";
import MultiTextRenderer from "../components/MultiTextRenderer";
import HighlightHeadline from "../components/HighlightHeadline";
import ApostropheHeadline from "../components/ApostropheHeadline";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getFilteredPosts } from "../utils/post/getPost";
import { useEffect } from "react";
import { VscQuote } from "react-icons/vsc";
import getSharedServerSideProps from "../utils/server/getSharedServerSideProps";
import VisibilitySensor from "react-visibility-sensor";
import NextLink from "next/link";
import { getNullableType } from "graphql";
const PAGE_KEY = "home";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const Video = chakra("video");

const Home = ({ setting, page }) => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  const isMobile = useBreakpointValue([true, false]);
  const videoRef = useRef(undefined);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const categories = setting?.value?.categories;
  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };

  const fetchFeaturePosts = useCallback(async () => {
    try {
      const { data } = await getFilteredPosts({
        page: 1,
        featureDisplay: true,
        limit: 20,
      });
      setPosts(
        data
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(5, data?.length ?? 0))
      );
    } catch (err) {
      console.log("***** error", err);
    }
  }, []);

  useEffect(() => {
    fetchFeaturePosts();
  }, [fetchFeaturePosts]);

  useEffect(() => {
    if (isMobile || !isMobile) setHasVideoEnded(false);
  }, [isMobile]);

  return (
    <VStack w="100%" align="stretch" spacing={0}>
      {page?.content?.seo?.title && (
        <NextSeo
          title={page?.content?.seo?.title}
          description={page?.content?.seo?.description}
        ></NextSeo>
      )}

      {/* First Section */}
      <Box h={"100vh"} position="relative" overflow="hidden">
        <AspectRatio h="100%" ratio={5 / 3} zIndex="-1">
          {page?.content?.banner?.youtube ? (
            <iframe
              width="560"
              height="315"
              src={`${page?.content?.banner?.youtube}?controls=0&autoplay=1&loop=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : page?.content?.banner?.video ? (
            <Video
              h="100%"
              src={page?.content?.banner?.video}
              autoPlay
              loop
              playsInline
              muted
            ></Video>
          ) : (
            <Video
              h="100%"
              src={"/banner_video.mp4"}
              autoPlay
              loop
              playsInline
              muted
            ></Video>
          )}
        </AspectRatio>

        <VStack
          zIndex={10}
          align="stretch"
          position="absolute"
          bottom={0}
          w="100%"
          textAlign="center"
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.8))"
        >
          <Container>
            <VStack pb={16}>
              <Heading color="white" fontSize={["4xl", "4xl", "6xl"]}>
                <MultiTextRenderer data={page?.content?.banner?.title} />
              </Heading>
              <Text
                maxW={480}
                w="100%"
                whiteSpace="pre-wrap"
                color="white"
                fontSize="2xl"
                pt={[8, 8, 12, 12]}
              >
                {page?.content?.banner?.description}
              </Text>
              <Button
                borderRadius="full"
                color="white"
                bg="transparent"
                variant="outline"
                _hover={{
                  bg: "rgba(255,255,255, 0.3)",
                }}
                onClick={() =>
                  page?.content?.banner?.buttonHyperlink &&
                  router.push(page?.content?.banner?.buttonHyperlink)
                }
              >
                {page?.content?.banner?.buttonText}
              </Button>
            </VStack>
          </Container>
          <DividerSimple nextColor="#fafafa"></DividerSimple>
        </VStack>
      </Box>

      {/* Second Section */}
      <Box minH={["110vh", "110vh", "100vh"]} bg="#fafafa">
        <Container>
          <VStack align="center" py={"15vh"}>
            <Box fontSize={["2xl", "2xl", "4xl", "4xl"]}>
              <HighlightHeadline>
                {page?.content?.animation?.startFrame?.headline}
              </HighlightHeadline>
            </Box>

            <Box
              pt={16}
              textAlign="center"
              fontSize={["4xl", "4xl", "5xl", "5xl"]}
            >
              {(page?.content?.animation?.startFrame?.title ?? []).map(
                ({ _template, content, textcolor, bold }, index) => {
                  switch (_template) {
                    case "textBlock":
                      return (
                        <Text
                          d="inline"
                          key={index}
                          textColor={textcolor}
                          {...(bold && { fontWeight: "bold" })}
                        >
                          {content}
                        </Text>
                      );
                    case "lineBreakBlock":
                      return <br key={index} />;
                    default:
                  }
                }
              )}
            </Box>
            <SimpleGrid pt={16} columns={[2, 2, 2, 4]} spacing={8}>
              {(page?.content?.animation?.startFrame?.roles ?? []).map(
                ({ icon, name, caption }, index) => {
                  return (
                    <GridItem key={index}>
                      <VStack textAlign="center" fontSize={["xl"]}>
                        <Image w={100} src={icon}></Image>
                        <Text fontWeight="bold">{name}</Text>
                        <Text>{caption}</Text>
                      </VStack>
                    </GridItem>
                  );
                }
              )}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Third Section */}
      <Box>
        <VisibilitySensor
          partialVisibility
          onChange={(isVisible) => {
            if (!hasVideoEnded && !!videoRef?.current)
              isVisible ? videoRef.current.play() : videoRef.current.pause();
          }}
        >
          <AspectRatio h="100%" ratio={isMobile ? 2 / 5 : 5 / 3}>
            <Video
              ref={videoRef}
              h="100%"
              src={
                isMobile ? "/logo_video_mobile.mov" : "/logo_video_desktop.mov"
              }
              muted
              onEnded={() => setHasVideoEnded(true)}
              playsInline
            />
          </AspectRatio>
        </VisibilitySensor>
      </Box>
      {/* <Box bg="#fff">
        <Container>
          <VStack align="center" py={"20vh"}>
            <Image
              maxW="768"
              w="80%"
              src={page?.content?.animation?.endFrame?.image}
            ></Image>
            <Box pt={"12vh"} as="h4" fontSize={["2xl", "4xl", "6xl"]}>
              <HighlightHeadline>
                {page?.content?.animation?.endFrame?.title}
              </HighlightHeadline>
            </Box>
            <Text
              w="80%"
              pt={"8vh"}
              textAlign="center"
              fontSize={["2xl", "2xl", "3xl"]}
            >
              {(page?.content?.animation?.endFrame?.caption ?? []).map(
                ({ _template, content, textcolor, bold }, index) => {
                  switch (_template) {
                    case "textBlock":
                      return (
                        <Text
                          d="inline"
                          key={index}
                          textColor={textcolor}
                          {...(bold && { fontWeight: "bold" })}
                        >
                          {content}
                        </Text>
                      );
                    case "lineBreakBlock":
                      return <br key={index} />;
                    default:
                  }
                }
              )}
            </Text>
          </VStack>
        </Container>
      </Box> */}

      {/* Fourth Section */}

      <Box bg="#F6D644" position="relative">
        <Container>
          <Box py={32}>
            <SimpleGrid gap={4} align="center" py={16} columns={[1, 2, 2, 4]}>
              {(page?.content?.transitionBanner?.slides ?? []).map(
                ({ caption, image, link }, index) => (
                  <Box key={index} {...{ [index % 2 ? "pt" : "pb"]: 12 }}>
                    <Box textAlign="center">
                      {caption && (
                        <Box h={8} mb={8}>
                          <ApostropheHeadline fontSize={"xl"}>
                            {caption}
                          </ApostropheHeadline>
                        </Box>
                      )}
                    </Box>
                    <NextLink href={link ?? "#"}>
                      <Box
                        borderWidth={4}
                        borderColor="white"
                        borderRadius={32}
                        bgImage={`url(${image})`}
                        bgSize="cover"
                        bgPos="center"
                        w="240px"
                        h="240px"
                        maxW="100%"
                      />
                    </NextLink>
                  </Box>
                )
              )}
            </SimpleGrid>
          </Box>
        </Container>
        <Box position="absolute" w="100%" bottom={0} left={0}>
          <svg viewBox="0 0 1367 118">
            <path
              id="border-yelo"
              d="M-89.57,13.3S42.93,121.87,209,121.87c109.69,0,171.75-11.82,299.71-40.29C653.81,49.29,790.55,1,937.84,1c110.53,0,351.82,92.9,433.81,92.9,113.73,0,145.78-15.67,145.78-15.67v71.23h-1607Z"
              fill="#f6d644"
              fillRule="evenodd"
            />
            <path
              id="border-blu"
              d="M1393.43,24.86S1324,80.79,1021.31,80.79c-236.59,0-266.11-61.87-433.82-61.87-130.63,0-259.57,91.81-429.83,91.81C61.48,110.73,5.43,58.21,5.43,58.21v92.23h1388Z"
              fill="#FEB534"
              fillRule="evenodd"
            />
            <path
              id="border-whtie"
              d="M-2.57,11.9s113,96.18,254.7,96.18c93.58,0,146.52-10.47,255.69-35.7C631.64,43.78,748.29,1,874,1c94.31,0,300.16,82.3,370.11,82.3,97,0,124.37-13.88,124.37-13.88v348H-2.57Z"
              fill="#00BFBA"
              fillRule="evenodd"
            />
          </svg>
        </Box>
      </Box>

      {/* Fifth Section */}

      <Box bg="#00BFBA" position="relative">
        <Carousel
          showArrows={true}
          showIndicators={false}
          autoPlay
          infiniteLoop
          interval={3000}
          showStatus={false}
          showThumbs={false}
          renderArrowPrev={(clickHandler, hasPrev, label) => {
            return hasPrev ? (
              <HStack
                px={3}
                position="absolute"
                h="100%"
                zIndex={25}
                align="center"
                left={[2, 2, 2, 2, 8, "10vw"]}
              >
                <IconButton
                  cursor="pointer"
                  onClick={clickHandler}
                  variant="unstyled"
                  round={true}
                  as={FaArrowLeft}
                />
              </HStack>
            ) : null;
          }}
          renderArrowNext={(clickHandler, hasNext, label) => {
            return hasNext ? (
              <HStack
                px={3}
                top={0}
                right={[2, 2, 2, 2, 8, "10vw"]}
                position="absolute"
                h="100%"
                align="center"
              >
                <IconButton
                  cursor="pointer"
                  onClick={clickHandler}
                  variant="unstyled"
                  round={true}
                  as={FaArrowRight}
                />
              </HStack>
            ) : null;
          }}
        >
          {(posts ?? []).map((post, index) => (
            <Container key={index} py={28}>
              <Stack
                align="center"
                justifyContent="center"
                spacing={[6, 8, 10, 16]}
                px="50px"
                direction={["column", "column", "column", "row"]}
                onClick={() => router.push(`/sharing/${post?.slug}`)}
              >
                <Box w={["100%", "60%", "50%", "50%", "40%"]}>
                  <Image src={post?.content?.feature?.image} />
                </Box>
                <VStack
                  px={8}
                  align="start"
                  flex={[0, 0, 0, 1]}
                  minW={0}
                  textAlign="left"
                >
                  <HStack>
                    <Icon
                      as={VscQuote}
                      fontSize={36}
                      color="white"
                      fontWeight="bold"
                    />
                    <Box
                      bgColor="#00F5E7"
                      borderRadius={24}
                      fontSize="xl"
                      px={4}
                      py={0.5}
                    >
                      <Text>{getCategoryData(post?.category)?.label}</Text>
                    </Box>
                  </HStack>
                  <Text
                    fontWeight="bold"
                    d="block"
                    pb={4}
                    lineHeight="xl"
                    fontSize={["2xl", "2xl", "2xl", "2xl"]}
                  >
                    {post?.content?.feature?.persona}
                  </Text>
                  <Heading
                    lineHeight="xl"
                    fontSize={["2xl", "3xl", "4xl", "4xl"]}
                    whiteSpace="pre-wrap"
                    bgColor="white"
                  >
                    {post?.content?.feature?.tagline ?? post?.title}
                  </Heading>
                  <Text
                    d="block"
                    pt={4}
                    whiteSpace="pre-wrap"
                    fontSize="2xl"
                    borderRadius={4}
                  >
                    {post?.excerpt}
                  </Text>
                </VStack>
              </Stack>
            </Container>
          ))}
        </Carousel>
      </Box>

      {/* role introduction */}
      <Grid bg="#fafafa" gridTemplateColumns="auto" minH="100vh" w="100%">
        <Box
          gridArea="1/1/2/2"
          bgImage={`url(${page?.content?.roleIntroduction?.topLeftImage})`}
          bgRepeat="no-repeat"
          bgPosition="top left"
        ></Box>
        <Box
          gridArea="1/1/2/2"
          bgImage={`url(${page?.content?.roleIntroduction?.bottomRightImage})`}
          bgRepeat="no-repeat"
          bgPosition="bottom right"
        ></Box>
        <Box py="20vh" px={[4, 4, 8, 8]} gridArea="1/1/2/2">
          <Container>
            <Heading mb={1} fontSize={["2xl", "3xl", "4xl"]}>
              {page?.content?.roleIntroduction?.tagline}
            </Heading>
            <Tabs>
              <TabList border={0} as={HStack} spacing={8}>
                {(page?.content?.roleIntroduction?.roles ?? []).map(
                  ({ id, title }) => (
                    <Tab
                      fontSize={["3xl", "4xl", "5xl"]}
                      fontWeight="bold"
                      px={0}
                      _focus={{ outline: "none" }}
                      _selected={{
                        color: "black",
                        borderBottomColor: "#FD5F53",
                      }}
                      borderBottomWidth={3}
                      key={id}
                    >
                      {title}
                    </Tab>
                  )
                )}
              </TabList>
              <TabPanels>
                {(page?.content?.roleIntroduction?.roles ?? []).map(
                  ({ id, description, link, features }) => (
                    <TabPanel px={0} key={id} py={12}>
                      <Text w={["100%", "50%"]}>
                        {(description ?? []).map(
                          ({ _template, content, textcolor, bold }, index) => {
                            switch (_template) {
                              case "textBlock":
                                return (
                                  <Text
                                    d="inline"
                                    key={index}
                                    textColor={textcolor}
                                    {...(bold && { fontWeight: "bold" })}
                                  >
                                    {content}
                                  </Text>
                                );
                              case "lineBreakBlock":
                                return <br key={index} />;
                              default:
                            }
                          }
                        )}
                      </Text>
                      <Grid
                        templateColumns={[
                          "repeat(1, 1fr)",
                          "repeat(1, 1fr)",
                          "repeat(2, 1fr)",
                          "repeat(3, 1fr)",
                        ]}
                        mt={8}
                        spacing={4}
                        gap={[4, 4, 4, 4]}
                      >
                        {(features ?? []).map(
                          ({
                            id,
                            icon,
                            title,
                            link = "/",
                            caption,
                            remark,
                          }) => (
                            <Link height="100%" href={link} key={id}>
                              <GridItem
                                as={VStack}
                                borderWidth={2}
                                height="100%"
                                bg={[
                                  "white",
                                  "white",
                                  "white",
                                  "rgb(250,250,250)",
                                ]}
                                boxShadow={["lg", "lg", "lg", "none"]}
                                borderColor={[
                                  "transparent",
                                  "transparent",
                                  "transparent",
                                  "gray.300",
                                ]}
                                transition="all 0.2s"
                                _hover={{
                                  boxShadow: "lg",
                                  bg: "white",
                                  borderColor: "transparent",
                                }}
                                borderRadius={16}
                                key={id}
                                px={8}
                                pt={12}
                                pb={8}
                                align="center"
                                textAlign="center"
                                cursor="default"
                              >
                                <Image w={16} src={icon}></Image>
                                <Text fontSize={"2xl"} fontWeight="bold">
                                  {title}
                                </Text>
                                <Text fontSize="lg" fontWeight="semibold">
                                  {caption}
                                </Text>
                                <Box flex={1} minH={8} h="100%" />
                                <Text fontSize="md" color="gray.500">
                                  {remark}
                                </Text>
                              </GridItem>
                            </Link>
                          )
                        )}
                      </Grid>
                    </TabPanel>
                  )
                )}
              </TabPanels>
            </Tabs>
          </Container>
        </Box>{" "}
      </Grid>

      <Box
        py={24}
        bgColor="#F6D644"
        bgImage={`url(${page?.content?.quote?.background})`}
        bgSize="cover"
        bgPos="bottom center"
      >
        <Container>
          <Box>
            <VStack align="center" maxW={720} mx="auto" spacing={4}>
              <Text pl={16} alignSelf="flex-start" w="100%" fontSize={["lg"]}>
                {page?.content?.quote?.audience}
              </Text>
              <Box textAlign="center" px={8} pt={8}>
                <ApostropheHeadline>
                  {(page?.content?.quote?.words ?? []).map(
                    ({ _template, content, textcolor, bold }, index) => {
                      switch (_template) {
                        case "textBlock":
                          return (
                            <Text
                              fontSize="2xl"
                              d="inline"
                              key={index}
                              textColor={textcolor}
                              {...(bold && { fontWeight: "bold" })}
                            >
                              {content}
                            </Text>
                          );
                        case "lineBreakBlock":
                          return <br key={index} />;
                        default:
                      }
                    }
                  )}
                </ApostropheHeadline>
              </Box>
              <Box alignSelf="flex-end">
                <Text fontSize={["2xl", "3xl", "3xl"]} px={[2, 16, 16]}>
                  {page?.content?.quote?.reference}
                </Text>
              </Box>
            </VStack>
          </Box>
        </Container>
      </Box>
    </VStack>
  );
};

export default withPageCMS(Home, {
  key: PAGE_KEY,
  fields: [
    {
      name: "banner",
      label: "主頁橫幅 Hero Banner",
      component: "group",
      fields: [
        // {
        //   label: "主頁圖片 Image",
        //   name: "image",
        //   component: "image",
        //   uploadDir: () => "/home",
        //   parse: ({ previewSrc }) => previewSrc,
        //   previewSrc: (src) => src,
        // },
        {
          name: "youtube",
          label: "你管嵌入式鏈接 Youtube embedded link",
          component: "text",
          placeholder: "https://www.youtube.com/embed/....",
        },
        {
          name: "video",
          label: "視頻 Video",
          component: "text",
          placeholder: "https://",
        },
        {
          name: "title",
          label: "主標題 Title",
          component: "blocks",
          templates: metaTextTemplates,
        },
        {
          name: "description",
          label: "副標題  Description",
          component: "textarea",
        },
        {
          name: "buttonText",
          label: "按鈕文字 Button Text",
          component: "text",
        },
        {
          name: "buttonHyperlink",
          label: "按鈕連結 Button Hyperlink",
          component: "text",
        },
      ],
    },
    {
      name: "animation",
      label: "動畫 Animation",
      component: "group",
      fields: [
        {
          name: "startFrame",
          label: "起始幀 Start Frame",
          component: "group",
          fields: [
            {
              name: "headline",
              label: "引子 Headline",
              component: "text",
            },
            {
              name: "title",
              label: "標題 Title",
              component: "blocks",
              templates: metaTextTemplates,
            },
            {
              name: "roles",
              label: "角色  Roles",
              component: "group-list",
              itemProps: ({ id: key, name: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "icon",
                  label: "圖示  Icon",
                  component: "image",
                  uploadDir: () => "/home",
                  parse: ({ previewSrc }) => previewSrc,
                  previewSrc: (src) => src,
                },
                {
                  name: "name",
                  label: "名稱  Name",
                  component: "text",
                },
                {
                  name: "caption",
                  label: "描述  Caption",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "endFrame",
          label: "結束幀 End Frame",
          component: "group",
          fields: [
            {
              name: "image",
              label: "圖片  Image",
              component: "image",
              uploadDir: () => "/home",
              parse: ({ previewSrc }) => previewSrc,
              previewSrc: (src) => src,
            },
            {
              name: "title",
              label: "標題  Title",
              component: "text",
            },
            {
              name: "caption",
              label: "描述 Caption",
              component: "blocks",
              templates: metaTextTemplates,
            },
          ],
        },
      ],
    },

    {
      name: "transitionBanner",
      label: "過渡橫幅 Transition Banner",
      component: "group",
      fields: [
        {
          name: "slides",
          label: "區段 Slides",
          component: "group-list",
          itemProps: ({ id: key, caption: label }) => ({
            key,
            label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              name: "image",
              label: "圖片  Image",
              component: "image",
              uploadDir: () => "/home",
              parse: ({ previewSrc }) => previewSrc,
              previewSrc: (src) => src,
            },
            {
              name: "caption",
              label: "描述 Caption",
              component: "text",
            },
            {
              name: "link",
              label: "網址 URL",
              component: "text",
            },
          ],
        },
      ],
    },

    // {
    //   name: "sharing",
    //   label: "文章分享 Sharing",
    //   component: "group",
    //   fields: [
    //     {
    //       name: "slides",
    //       label: "區段 Slides",
    //       component: "group-list",
    //       itemProps: ({ id: key, caption: label }) => ({
    //         key,
    //         label,
    //       }),
    //       defaultItem: () => ({
    //         id: Math.random().toString(36).substr(2, 9),
    //       }),
    //       fields: [
    //         {
    //           name: "image",
    //           label: "圖片  Image",
    //           component: "image",
    //           uploadDir: () => "/home/sharing",
    //           parse: ({ previewSrc }) => previewSrc,
    //           previewSrc: (src) => src,
    //         },
    //         {
    //           name: "persona",
    //           label: "人物/機構 Person/Organization",
    //           component: "text",
    //         },
    //         {
    //           name: "category",
    //           label: "分類 Category",
    //           component: "text",
    //         },
    //         {
    //           name: "persona",
    //           label: "人物/機構 Person/Organization",
    //           component: "text",
    //         },
    //         {
    //           name: "title",
    //           label: "標題",
    //           component: "textarea",
    //         },
    //         {
    //           name: "excerpt",
    //           label: "描述",
    //           component: "textarea",
    //         },
    //       ],
    //     },
    //   ],
    // },

    {
      label: "角色介紹 Role Introduction",
      name: "roleIntroduction",
      component: "group",

      fields: [
        {
          name: "topLeftImage",
          label: "左上圖片 Top Left Image",
          component: "image",
          uploadDir: () => "/home/roleIntroduction",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "bottomRightImage",
          label: "左上圖片 Bottom Right Image",
          component: "image",
          uploadDir: () => "/home/roleIntroduction",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "tagline",
          component: "text",
          label: "引題 TagLine",
        },
        {
          name: "roles",
          component: "group-list",
          label: "角色 Roles",
          itemProps: ({ id: key, title: label }) => ({
            key,
            label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              name: "title",
              component: "text",
              label: "標題 Title",
            },
            {
              name: "description",
              component: "blocks",
              templates: metaTextTemplates,
              label: "描述 description",
            },

            {
              name: "features",
              component: "group-list",
              label: "特色 Features",
              itemProps: ({ id: key, title: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "icon",
                  label: "圖示 Icon",
                  component: "image",
                  uploadDir: () => "/home/roleIntroduction",
                  parse: ({ previewSrc }) => previewSrc,
                  previewSrc: (src) => src,
                },
                {
                  name: "title",
                  component: "text",
                  label: "標題 Title",
                },
                {
                  name: "link",
                  label: "關聯 Link",
                  component: "text",
                  placeholder: "https://",
                },
                {
                  name: "caption",
                  component: "text",
                  label: "描述 Caption",
                },
                {
                  name: "remark",
                  component: "text",
                  label: "備註 Remark",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "quote",
      label: "引句 Quote",
      component: "group",
      fields: [
        {
          name: "background",
          label: "背景  Background",
          component: "image",
          uploadDir: () => "/home",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "audience",
          component: "text",
          label: "致 To",
        },
        {
          name: "words",
          component: "blocks",
          templates: metaTextTemplates,
          label: "名言 words",
        },
        {
          name: "reference",
          component: "text",
          label: "來源 Reference",
        },
      ],
    },
  ],
});

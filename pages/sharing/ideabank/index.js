import {
  AspectRatio,
  Button,
  chakra,
  GridItem,
  HStack,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Skeleton,
  useBreakpointValue,
  Wrap,
  Link,
  WrapItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { NextSeo } from "next-seo";
import { Text, VStack, Box, Grid, Stack, Flex } from "@chakra-ui/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useCallback, useEffect, useRef } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { getPage } from "../../../utils/page/getPage";
import sharingFieldsForCMS from "../../../utils/tina/sharingFieldsForCMS";
import withPageCMS from "../../../utils/page/withPageCMS";
import { VscQuote } from "react-icons/vsc";
import Anchor from "../../../components/Anchor";
import withPostCreatorCMS from "../../../utils/post/withPostCreatorCMS";
import {
  getPost,
} from "../../../utils/post/getPost";
import { getStockPhoto } from "../../../utils/event/getEvent";
import {
  getProjects,
  getProjectCategories,
} from "../../../utils/project/getProject";
import DividerSimple from "../../../components/DividerSimple";
import HighlightHeadline from "../../../components/HighlightHeadline";
import Container from "../../../components/Container";
import CategoryTag from "../../../components/CategoryTag";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../utils/wordExtractor";

const PAGE_KEY = "ideabank";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      lang: context.locale,
      api: {
        stockPhotos: await getStockPhoto(),
        projectCategories: await getProjectCategories(),
      },
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const IdeaBank = ({
  page,
  setting,
  lang,
  api: { stockPhotos, projectCategories },
}) => {
  const categories = setting?.value?.categories;

  const [latestPosts, setLatestPosts] = React.useState([]);
  const pageRef = useRef(1);
  const totalRef = useRef(0);
  const [featuredArticle, setFeaturedArticle] = React.useState({});
  const skeletonValue = useBreakpointValue({ base: [1], md: [1, 2] });
  const [hottestPosts, setHottestPosts] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState([]);

  const router = useRouter();

  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };

  const getProjectCategoryData = (id) => {
    const getCategory = (projectCategories?.list ?? []).find((c) => c.id === id)
    return {
      ...getCategory,
      textColor: "#FFF",
      bgColor: "#00837F"
    }
    // return (projectCategories?.data?.list ?? []).find((c) => c.id === id);
  };

  const fetchProjects = useCallback(async () => {
    try {
      const { list, total } = await getProjects({
        offset: pageRef.current,
        limit: page?.content?.latestSection?.numOfPostsPerPage,
      });

      totalRef.current = total;
      setLatestPosts((latestPosts) =>
        pageRef.current > 1 ? [...latestPosts, ...list] : list
      );
      pageRef.current++;
    } catch (err) {
      console.error("***** error", err);
    }
  }, [page?.content?.latestSection?.numOfPostsPerPage, router.query.category]);

  useEffect(() => {
    totalRef.current = 0;
    pageRef.current = 1;
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (router.query.category) {
      setTimeout(() => {
        document.querySelector(`[data-tag='sharing-list']`).scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 300);

      const selectedCategory = projectCategories?.list?.find((d)=> lang === "zh" ? d?.chineseName === router.query.category : d?.englishName === router.query.category)

      setSelectedCategory({
        ...selectedCategory,
        label: lang === "zh" ? selectedCategory.chineseName : selectedCategory.englishName,
      })
    }
  }, [router]);

  const fetchFeaturedArticle = useCallback(
    async (slug) => {
      const post = await getPost({
        idOrSlug: slug,
        lang: lang,
      });

      if (!post) {
        const otherLangPost = await getPost({
          idOrSlug: slug,
          lang: lang === "zh" ? "en" : "zh",
        });
        setFeaturedArticle(otherLangPost);
        return;
      }
      setFeaturedArticle(post);
    },
    [lang]
  );

  React.useEffect(() => {
    if (page?.content?.featured) {
      fetchFeaturedArticle(page?.content?.featured);
    }
  }, [fetchFeaturedArticle, hottestPosts, page?.content?.featured]);

  const featuredArticleCategory = getCategoryData(featuredArticle?.category);

  const SkeletonPlaceholder = () => (
    <Grid
      templateColumns={{ base: "292px", md: "276px 276px", lg: "276px 276px" }}
      columnGap="16px"
      justifyContent="center"
      pt="40px"
    >
      {skeletonValue?.map((_, i) => (
        <Box
          key={i}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Skeleton
            w={{ base: "288px", lg: "272px" }}
            h={{ base: "216px", lg: "204px" }}
            borderRadius="16px"
            mt="40px"
            mb="10px"
          />
          <Flex justifyContent="flex-start" mt="8px">
            {[1, 2].map((_, i) => (
              <Skeleton
                key={i}
                w="76px"
                h="17px"
                borderRadius="19px"
                mr="8px"
              />
            ))}
          </Flex>
          <Skeleton w="188px" h="36px" borderRadius="8px" mt="8px" />
          <Skeleton w="272px" h="16px" borderRadius="11.5px" mt="8px" />
          <Skeleton w="115px" h="16px" borderRadius="11.5px" mt="8px" />
        </Box>
      ))}
    </Grid>
  );

  return (
    <VStack w="100%" align="stretch" spacing={0}>
      <NextSeo
        title={
          router.locale === "zh"
            ? `賽馬會共融．知行計劃｜創意思維庫`
            : `Jockey Club Collaborative Project for Inclusive Employment｜Idea Bank`
        }
      />
      {/* Featured Article Section */}
      <Box>
        <Box
          bgColor="#F6D644"
          d={["none", "none", "block"]}
          minH="480px"
          position="relative"
          zIndex={10}
          w="100%"
          pb={!featuredArticle ? 0 : 12}
        >
          <VStack
            align="stretch"
            pt="128px"
            w="100%"
            d={["none", "none", "block"]}
          >
            <Container pb={8}>
              <VStack align="start" w="100%">
                <Box px={[4, 8, 8, 16]}>
                  <Text
                    fontWeight={900}
                    fontSize={["3xl", "4xl", "4xl", "5xl"]}
                  >
                    <HighlightHeadline bgColor="white">
                      {page?.content?.title}
                    </HighlightHeadline>
                  </Text>
                </Box>
              </VStack>
            </Container>
          </VStack>
          <Container position="relative" zIndex={500} w="100%">
            <Stack
              direction={["column", "column", "row"]}
              spacing={8}
              w="100%"
              align="start"
              onClick={() => {
                router.push(`/sharing/${featuredArticle?.slug}`);
              }}
              cursor="pointer"
            >
              <AspectRatio
                w={"40%"}
                ratio={4 / 3}
                borderWidth={3}
                borderRadius={24}
                borderColor="white"
                overflow="hidden"
              >
                <Image
                  alt={featuredArticle?.title}
                  src={featuredArticle?.coverImage}
                />
              </AspectRatio>
              <VStack flex={1} minW={0} w="100%" align="start">
                <Icon
                  as={VscQuote}
                  fontSize={56}
                  color="white"
                  fontWeight="bold"
                />
                <Wrap>
                  <CategoryTag
                    size="sm"
                    category={featuredArticleCategory}
                    withIcon={false}
                  />
                  <Text fontSize="sm">
                    {moment(featuredArticle?.publishDate).format(
                      "D MMM, hh:mm a"
                    )}
                  </Text>
                </Wrap>
                <Box borderRadius={16} pt={1} px={2} color={1} pb={16}>
                  <Text fontSize={("2xl", "4xl", "4xl")} fontWeight="bold">
                    {featuredArticle?.title}
                  </Text>
                  <Text>{featuredArticle?.excerpt}</Text>
                </Box>
              </VStack>
            </Stack>
          </Container>

          <Box
            {...(featuredArticle && {
              position: "absolute",
              left: 0,
              w: "100%",
              bottom: 0,
              zIndex: 300,
            })}
          >
            <DividerSimple flip={true} nextColor="white"></DividerSimple>
          </Box>
        </Box>
        <Box
          cursor="pointer"
          onClick={() => {
            router.push(`/sharing/${featuredArticle?.slug}`);
          }}
          position="relative"
          d={["block", "block", "none"]}
          pb={16}
        >
          <AspectRatio w={"100%"} ratio={4 / 3}>
            <Image
              alt={featuredArticle?.title}
              src={featuredArticle?.coverImage}
            />
          </AspectRatio>
          <DividerSimple flip={true}></DividerSimple>
          <VStack
            spacing={8}
            align="start"
            px={[2, 4]}
            bottom={0}
            position="absolute"
            zIndex={300}
            w="100%"
          >
            <Icon as={VscQuote} fontSize={56} color="white" fontWeight="bold" />
            <VStack
              bg="white"
              borderRadius={16}
              boxShadow="md"
              p={4}
              flex={1}
              minW={0}
              w="100%"
              align="start"
            >
              <Wrap>
                <CategoryTag
                  size="sm"
                  category={featuredArticleCategory}
                  withIcon={false}
                />
                <Text fontSize="sm">
                  {moment(featuredArticle?.publishDate).format(
                    "D MMM, hh:mm a"
                  )}
                </Text>
              </Wrap>
              <Box borderRadius={16} pt={1} px={2} color={1}>
                <Text fontSize={"xl"} fontWeight="bold">
                  {featuredArticle?.title}
                </Text>
                <Text>{featuredArticle?.excerpt}</Text>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Box>
      {/* Posts Section */}
      <Container alignSelf="center" pt={16}>
        <Stack
          direction={["column", "column", "row-reverse"]}
          spacing={4}
          align="start"
          w="100%"
        >
          {/* Right Section of Grid */}
          <Box w={["100%", "100%", "33%"]}>
            <Box d={"block"}>
              <Box mt="70px" mb={4}>
                <Box textAlign="left" fontSize="36px">
                  <Text pos="relative" display="inline-block" pl="8px">
                    <Heading
                      zIndex={1}
                      fontSize="20px"
                      fontWeight="700"
                      pos="relative"
                    >
                      {page?.content?.categorySection?.title}
                    </Heading>
                    <Box
                      w="112px"
                      height="33px"
                      borderRadius="16.5px"
                      background="#EFEFEF"
                      pos="absolute"
                      left="0"
                      bottom="-3px"
                    ></Box>
                    <Box
                      w="0px"
                      height="0px"
                      borderRight="5px solid transparent"
                      borderLeft="5px solid transparent"
                      borderTop="12px solid #EFEFEF"
                      transform="scaleY(-1) rotate(150deg)"
                      pos="absolute"
                      left="0"
                      bottom="-11px"
                    ></Box>
                  </Text>
                </Box>
              </Box>
              <Wrap spacing={2}>
                {(projectCategories?.list ?? []).map((category) =>{
                  return (
                  <WrapItem key={category.id} cursor="pointer">
                    <NextLink
                      passHref
                      href={`/sharing/ideabank?category=${lang === "zh" ? category.chineseName : category.englishName }`}
                    >
                      <Link>
                        <CategoryTag category={{
                          ...category,
                          label: lang === "zh" ? category.chineseName : category.englishName,
                        }}
                        withIcon={false}
                        />
                      </Link>
                    </NextLink>
                  </WrapItem>
                  )
                }
                )}
              </Wrap>
            </Box>
          </Box>

          {/* Latest Articles with scroll */}
          <Anchor id="sharing-list" />
          <Box flex={1} w={"100%"} minW={0}>
            <Box
              d={["none", "block"]}
              mt="10px"
              textAlign="center"
              fontWeight="bold"
              fontSize="24"
              pb="36px"
            >
              <Heading position="relative" display="inline-block">
                {page?.content?.latestSection?.title}
                <Box
                  width="6.15px"
                  height="27.69px"
                  borderRadius="5px"
                  pos="absolute"
                  right={["-6", "-6", "-12"]}
                  bottom="-3"
                  background="#EFEFEF"
                  transform="rotate(30deg)"
                />
                <Box
                  width="6.15px"
                  height="27.69px"
                  borderRadius="5px"
                  pos="absolute"
                  left={["-6", "-6", "-12"]}
                  bottom="-3"
                  background="#EFEFEF"
                  transform="rotate(-30deg)"
                />
              </Heading>
            </Box>

            {router?.query?.category && (
              <HStack align="center" spacing={4} p={1} my={4}>
                <Text fontSize="xl">
                  {wordExtractor(
                    page?.content?.wordings,
                    "selected_category_label"
                  )}
                </Text>
                <CategoryTag
                  size="lg"
                  category={selectedCategory}
                  withIcon={false}
                />
                <Button
                  size="lg"
                  colorScheme="red"
                  variant="link"
                  onClick={() => {
                    router.push(
                      {
                        pathname: "/sharing/ideabank",
                      },
                      undefined,
                      { shallow: true }
                    );
                  }}
                >
                  {wordExtractor(
                    page?.content?.wordings,
                    "cancel_button_label"
                  )}
                </Button>
              </HStack>
            )}

            <InfiniteScroll
              dataLength={latestPosts.length}
              next={fetchProjects}
              hasMore={latestPosts.length < totalRef.current}
              loader={<SkeletonPlaceholder />}
              endMessage={<Box w="100%" h="40px" />}
            >
              <SimpleGrid columns={[1, 2]} spacing={10}>
                {latestPosts.map((post, i) => {
                  const url = post?.banner?.file?.url;
                  const stockPhotoId = post?.banner?.stockPhotoId;

                  let imageUrl = "";
                  if (url !== "undefined" && !!url) {
                    imageUrl = url;
                  } else {
                    const getStockPhoto = stockPhotos?.find(
                      (d) => d?.id === stockPhotoId
                    );
                    imageUrl = getStockPhoto?.url;
                  }

                  return (
                    <Stack
                      key={i}
                      as={GridItem}
                      align="stretch"
                      cursor="pointer"
                    >
                      <NextLink passHref href={`/sharing/ideabank/${post.id}`} key={i}>
                        <Link>
                          <AspectRatio ratio={4 / 3}>
                            <Box
                              bgImage={`url('${imageUrl}')`}
                              bgPos="center center"
                              bgSize="cover"
                              borderRadius={16}
                              borderColor="white"
                              borderWidth={3}
                            ></Box>
                          </AspectRatio>
                          <Box>
                            <Flex>
                              {post.category && (<Box
                                fontSize="12px"
                                color={
                                  getProjectCategoryData(post.category)?.textColor
                                }
                                background={
                                  getProjectCategoryData(post.category)?.bgColor
                                }
                                borderRadius="19px"
                                px="9px"
                                mr="9px"
                                display="inline"
                                fontWeight="700"
                              >
                                {getProjectCategoryData(post.category)?.chineseName}
                              </Box>)}
                              <Text fontSize="12px" display="inline-block">
                                {moment(post.startDate).format(
                                  "D MMM, hh:mm a"
                                )}
                                -{moment(post.endDate).format("D MMM, hh:mm a")}
                              </Text>
                            </Flex>
                            <Text
                              fontSize={{ base: "20px", lg: "24px" }}
                              fontWeight="bold"
                              mb="5px"
                              mt="5px"
                            >
                              {post.name}
                            </Text>
                            <Text
                              fontSize={{ base: "16px", lg: "16px" }}
                              maxH="70px"
                              overflow="hidden"
                              position="relative"
                            >
                              {post.introduction}
                              <Box
                                textAlign="right"
                                position="absolute"
                                bottom="0"
                                right="5px"
                                background="#fff"
                              >
                                ...{" "}
                                <chakra.span
                                  color="#007878"
                                  fontSize="16px"
                                  fontWeight="bold"
                                >
                                  More
                                </chakra.span>
                              </Box>
                            </Text>
                          </Box>
                        </Link>
                      </NextLink>
                    </Stack>
                  );
                })}
              </SimpleGrid>
            </InfiniteScroll>
          </Box>
        </Stack>
      </Container>
    </VStack>
  );
};

export default withPostCreatorCMS(
  withPageCMS(IdeaBank, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

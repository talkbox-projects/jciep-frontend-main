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
import { getPage } from "../../utils/page/getPage";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import withPageCMS from "../../utils/page/withPageCMS";
import { VscQuote } from "react-icons/vsc";
import Anchor from "../../components/Anchor";
import withPostCreatorCMS from "../../utils/post/withPostCreatorCMS";
import {
  getPost,
  getHottestPosts,
  getFilteredPosts,
} from "../../utils/post/getPost";
import DividerSimple from "../../components/DividerSimple";
import HighlightHeadline from "../../components/HighlightHeadline";
import Container from "../../components/Container";
import CategoryTag from "../../components/CategoryTag";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../utils/wordExtractor";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      lang: context.locale,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const Sharing = ({ page, setting, lang }) => {
  const categories = setting?.value?.categories;

  const [latestPosts, setLatestPosts] = React.useState([]);
  const pageRef = useRef(1);
  const totalRef = useRef(0);
  const [featuredArticle, setFeaturedArticle] = React.useState({});
  const skeletonValue = useBreakpointValue({ base: [1], md: [1, 2] });
  const [hottestPosts, setHottestPosts] = React.useState([]);

  const router = useRouter();

  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };

  const fetchPosts = useCallback(async () => {
    try {
      const { data, totalRecords } = await getFilteredPosts({
        page: pageRef.current,
        category: router.query.category ?? undefined,
        limit: page?.content?.latestSection?.numOfPostsPerPage,
      });
      totalRef.current = totalRecords;
      setLatestPosts((latestPosts) =>
        pageRef.current > 1 ? [...latestPosts, ...data] : data
      );
      pageRef.current++;
    } catch (err) {
      console.error("***** error", err);
    }
  }, [page?.content?.latestSection?.numOfPostsPerPage, router.query.category]);

  useEffect(() => {
    totalRef.current = 0;
    pageRef.current = 1;
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (router.query.category) {
      setTimeout(() => {
        document.querySelector(`[data-tag='sharing-list']`).scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 300);
    }
  }, [router]);

  const fetchHottestPosts = useCallback(async () => {
    try {
      const data = await getHottestPosts({
        limit: page?.content?.hotestSection?.numOfPosts,
      });
      setHottestPosts(data);
    } catch (err) {
      console.error("***** error", err);
    }
  }, [page?.content?.hotestSection?.numOfPosts]);

  const fetchFeaturedArticle = useCallback(
    async (slug) => {
      const post = await getPost({
        idOrSlug: slug,
        lang: lang,
      });

      if(!post){
        const otherLangPost = await getPost({
          idOrSlug: slug,
          lang: lang === 'zh' ? 'en' : 'zh',
        });
        setFeaturedArticle(otherLangPost);
        return
      }
      setFeaturedArticle(post);
    },
    [lang]
  );

  React.useEffect(() => {
    fetchHottestPosts();
  }, [fetchHottestPosts]);

  React.useEffect(() => {
    if (page?.content?.featured || hottestPosts.length > 0) {
      fetchFeaturedArticle(page?.content?.featured || hottestPosts[0]?.slug);
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
            ? `賽馬會共融．知行計劃｜共融分享`
            : `Jockey Club Collaborative Project for Inclusive Employment｜Sharings on Inclusion`
        }
      />
      {/* Featured Article Section */}
      <Box zIndex={1}>
        <Box
          bgColor="#F6D644"
          d={["none", "none", "block"]}
          minH="480px"
          position="relative"
          zIndex={10}
          w="100%"
          pb={!featuredArticle?0:12}
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
                <Text fontSize={"xl"} fontWeight="bold" noOfLines={2}>
                  {featuredArticle?.title}
                </Text>
                <Text noOfLines={{base:3, md:4}}>{featuredArticle?.excerpt}</Text>
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
            <Box textAlign="left" fontSize="36px" pb="15px">
              <Text pos="relative" display="inline-block" pl="8px">
                <Heading
                  zIndex={1}
                  fontSize="20px"
                  fontWeight="700"
                  pos="relative"
                >
                  {page?.content?.hotestSection?.title}
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

            <Flex direction="column">
              {hottestPosts.map((post, i) => (
                <Grid
                  templateColumns="45px 1fr"
                  justifyContent={{ base: "center", lg: "unset" }}
                  columnGap="8px"
                  key={i}
                  pt="11px"
                  borderTop="1px solid #666"
                  mb="16px"
                >
                  <Text fontSize="36px" textAlign="left" color="#666">{`0${
                    i + 1
                  }`}</Text>

                  <Box key={i} cursor="pointer">
                    <NextLink passHref href={`/sharing/${post.slug}`} key={i}>
                      <Link w="100%" d="block">
                        <Flex>
                          <Box
                            fontSize="12px"
                            color={getCategoryData(post.category)?.textColor}
                            background={getCategoryData(post.category)?.bgColor}
                            borderRadius="19px"
                            px="9px"
                            mr="9px"
                            display="inline"
                            fontWeight="700"
                          >
                            {getCategoryData(post.category)?.label}
                          </Box>
                          <Text fontSize="12px" display="inline-block">
                            {moment(post.publishDate).format("D MMM, hh:mm a")}
                          </Text>
                        </Flex>
                        <Text
                          fontSize="16px"
                          fontWeight={{ base: "unset", lg: "bold" }}
                          mb="5px"
                          mt="5px"
                        >
                          {post.title}
                        </Text>
                        <Text
                          fontSize={{ base: "16px", lg: "16px" }}
                          h="46px"
                          overflow="hidden"
                          position="relative"
                        >
                          {post.excerpt}
                          <Box
                            textAlign="right"
                            position="absolute"
                            bottom="0"
                            right="5px"
                            background="#fff"
                          >
                            ...{" "}
                            <chakra.span
                              color="#197350"
                              fontSize="16px"
                              fontWeight="bold"
                            >
                              More
                            </chakra.span>
                          </Box>
                        </Text>
                      </Link>
                    </NextLink>
                  </Box>
                </Grid>
              ))}
            </Flex>

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
                {(categories ?? []).map((category) => (
                  <WrapItem key={category.key} cursor="pointer">
                    <NextLink
                      passHref
                      href={`/sharing?category=${category.key}`}
                    >
                      <Link>
                        <CategoryTag category={category} />
                      </Link>
                    </NextLink>
                  </WrapItem>
                ))}
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
                  category={categories?.find(
                    (category) => category.key === router.query.category
                  )}
                />
                <Button
                  size="lg"
                  colorScheme="red"
                  variant="link"
                  onClick={() => {
                    router.push(
                      {
                        pathname: "/sharing",
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
              next={fetchPosts}
              hasMore={latestPosts.length < totalRef.current}
              loader={<SkeletonPlaceholder />}
              endMessage={<Box w="100%" h="40px" />}
            >
              <SimpleGrid columns={[1, 2]} spacing={10}>
                {latestPosts.map((post, i) => (
                  <Stack key={i} as={GridItem} align="stretch" cursor="pointer">
                    <NextLink passHref href={`/sharing/${post.slug}`} key={i}>
                      <Link>
                        <AspectRatio ratio={4 / 3}>
                          <Box
                            bgImage={`url('${post.coverImage}')`}
                            bgPos="center center"
                            bgSize="cover"
                            borderRadius={16}
                            borderColor="white"
                            borderWidth={3}
                          ></Box>
                        </AspectRatio>
                        <Box>
                          <Flex>
                            <Box
                              fontSize="12px"
                              color={getCategoryData(post.category)?.textColor}
                              background={
                                getCategoryData(post.category)?.bgColor
                              }
                              borderRadius="19px"
                              px="9px"
                              mr="9px"
                              display="inline"
                              fontWeight="700"
                            >
                              {getCategoryData(post.category)?.label}
                            </Box>
                            <Text fontSize="12px" display="inline-block">
                              {moment(post.publishDate).format(
                                "D MMM, hh:mm a"
                              )}
                            </Text>
                          </Flex>
                          <Text
                            fontSize={{ base: "20px", lg: "24px" }}
                            fontWeight="bold"
                            mb="5px"
                            mt="5px"
                          >
                            {post.title}
                          </Text>
                          <Text
                            fontSize={{ base: "16px", lg: "16px" }}
                            maxH="70px"
                            overflow="hidden"
                            position="relative"
                          >
                            {post.excerpt}
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
                ))}
              </SimpleGrid>
            </InfiniteScroll>
          </Box>
        </Stack>
      </Container>
    </VStack>
  );
};

export default withPostCreatorCMS(
  withPageCMS(Sharing, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

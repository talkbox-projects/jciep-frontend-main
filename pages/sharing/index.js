import { chakra, Image, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { Text, VStack, Box, Grid , Stack, Flex } from "@chakra-ui/layout";
import InfiniteScroll from 'react-infinite-scroll-component';
import React from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { getPage } from "../../utils/page/getPage";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import withPageCMS from "../../utils/page/withPageCMS";
import withPostCMS from "../../utils/post/withPostCMS";
import withPostCreatorCMS from "../../utils/post/withPostCreatorCMS";
import { getLatestPosts, getPost, getHottestPosts, getFilteredPosts } from "../../utils/post/getPost";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
      lang: context.locale,
    },
  };
};

const Sharing = ({ page, setting, lang }) => {
  const categories = setting?.value?.categories;
  const [latestPosts, setLatestPosts] = React.useState([]);
  const [latestPostsPage, setLatestPostsPage] = React.useState(0);
  const [totalLatest, setTotalLatest] = React.useState(0);
  const [featuredArticle, setFeaturedArticle] = React.useState({});
  const skeletonValue = useBreakpointValue({ base: [1], md: [1, 2] });
  const [hottestPosts, setHottestPosts] = React.useState([]);
  const [activeFilter, setActiveFilter] = React.useState('');

  const router = useRouter();

  const getCategoryData = (key) => {
    if (!key) {
      return {}
    }
    const category = categories.find(c => c.key === key);
    if (category) {
      const data = {};
      data.label = lang === "en" ? category.label.en : category.label.zh;
      data.icon = category.image;
      data.bgColor = category.color;
      data.textColor = category.textColor;
      return data;
    }
    return {};
  }

  React.useEffect(() => {
    fetchData();
    fetchHottestPosts();
  }, [])

  React.useEffect(() => {
    if (page?.content?.featured) {
      fetchFeaturedArticle(page?.content?.featured);
    }
  }, [page?.content])

  const fetchData = async () => {
    try {
      const { data, totalRecords } = await getLatestPosts({page: latestPostsPage, limit: page?.content?.latestSection?.numOfPostsPerPage});
      setTotalLatest(totalRecords);
      setLatestPosts([...latestPosts, ...data]);
      setLatestPostsPage(latestPostsPage + 1);
    } catch (err) {
      console.log("***** error", err);
    }
  }

  const fetchHottestPosts = async () => {
    try {
      const data = await getHottestPosts({limit: page?.content?.hotestSection?.numOfPosts});
      setHottestPosts(data);
    } catch (err) {
      console.log("***** error", err);
    }
  }

  const fetchFeaturedArticle = async (slug) => {
    const post = await getPost({
      idOrSlug: slug,
      lang: lang,
    });
    setFeaturedArticle(post);
  }

  const fetchFilteredPosts = async () => {
    const { data, totalRecords } = await getFilteredPosts({ 
      lang,
      category: activeFilter,
      offset: 1,
      limit: page?.content?.latestSection?.numOfPostsPerPage,
    });
    setTotalLatest(totalRecords);
    setLatestPosts([...latestPosts, ...data]);
    setLatestPostsPage(latestPostsPage + 1);
  }

  const handleFilter = (filter) => {
    setLatestPosts([]);
    setLatestPostsPage(0);
    setActiveFilter(filter);
  }

  const SkeletonPlaceholder = (noDisplay) => (
    <Grid templateColumns={{ base: "292px", lg: "1fr 1fr" }} columnGap="16px" justifyContent="center">
      {skeletonValue?.map(() => (
        <Stack pt={noDisplay? "" : "40px"} opacity={noDisplay? 0 : 1} h={noDisplay? "40px" : "auto"}>
          <Skeleton w={{base: "288px", lg: "272px"}} h={{base: "216px", lg: "204px"}} borderRadius="16px" />
          <Flex justifyContent="flex-start">
            {[1,2].map(() => <Skeleton w="76px" h="17px" borderRadius="19px" mr="8px" />)}
          </Flex>
          <Skeleton w="188px" h="36px" borderRadius="8px" />
          <Skeleton w="272px" h="16px" borderRadius="11.5px" />
          <Skeleton w="115px" h="16px" borderRadius="11.5px" />
        </Stack>
      ))}
    </Grid>
  );

  return (
    <VStack w="100%" align="stretch" spacing={0}>
      {page?.content?.seo?.title && (
        <NextSeo
          title={page?.content?.seo?.title}
          description={page?.content?.seo?.description}
        ></NextSeo>
      )}
      {/* Featured Article Section */}
      <Box
        minH="calc(50vw - 40px)"
        w="100%"
        position="relative"
        background={page?.content?.bannerColor}
        pt={{ base: "0", lg: "159px" }}
        px={{ base: "0", lg: "203px" }}
        pb={{ base: "164px", lg: "120px" }}
      >
        <Box maxW="1200px" mx="auto">
          <chakra.span pos="relative" display={{ base: "none", lg: "block" }}>
            <chakra.span backgroundImage="linear-gradient(#fff, #fff)" textAlign="left" ml="43" fontSize={["0", "0", "36px"]} lineHeight={2} backgroundRepeat="no-repeat" backgroundPosition="0 0.5em" zIndex="2" pos="relative" px="15px" pb="6px">{page?.content?.title}</chakra.span>
          </chakra.span>
          {featuredArticle && (
            <Box mt={{ base: "0", lg: "24px"}} display="flex" flexDirection={{ base: "column", lg: "row" }} cursor="pointer" onClick={() => router.push(`/sharing/${featuredArticle.slug}`)}>
              <Image h={{base: "auto", lg: "330px"}} w={{base: "100%", lg: "429px"}} src={featuredArticle.coverImage} mr={{base: "0", lg: "34px"}} zIndex={{base: 0, lg: 1}} />
              <Box display="flex" flexDir="column" position={{ base: "absolute", lg: "relative" }} top={{ base: "162px", lg: "unset" }} boxShadow={{ base: "12px 12px 24px 0px rgba(30,30,30,0.1)", lg: "none" }}>
                <Image src={getCategoryData(featuredArticle.category).icon} mb="16px" w="48px" h="40px" ml={{ base: "16px", lg: "unset" }} />
                <Box background={{ base: "#fff", lg: "none" }} borderRadius={{ base: "10px", lg: "0px" }} mx={{ base: "16px", lg: "0px" }} zIndex={{ base: 1, lg: "unset" }} p={{ base: "16px", lg: "unset" }}>
                  <Box mb="8px">
                    <Box fontSize="12px" color={getCategoryData(featuredArticle.category).textColor} background={getCategoryData(featuredArticle.category).bgColor} borderRadius="19px" px="9px" mr="9px" display="inline">
                      {getCategoryData(featuredArticle.category).label}
                    </Box>
                    <Text fontSize="12px" display="inline-block">{moment(featuredArticle.publishDate).format("D MMM, hh:mm")}</Text>
                  </Box>
                  <Text fontSize={{base: "24px", lg: "48px"}} fontWeight="bold" mb={{base: "16px", lg: "8px"}}>{featuredArticle.title}</Text>
                  <Text fontSize={{base: "14px", lg: "16px"}} maxH={{base: "60px", lg: "50px"}} overflow="hidden" position="relative"  mb={{lg: "49px", base: "unset"}}>
                    {featuredArticle.excerpt}
                    <Box textAlign="right" position="absolute" bottom="0" right="5px" background={{base: "#fff", lg: page?.content?.bannerColor}}>
                      ... <chakra.span color="#007878" fontSize="16px" fontWeight="bold">More</chakra.span>
                    </Box>
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
          <Image position="absolute" left="0" bottom="0" src={page?.content?.bottomBorderFeatured} width="100%" fit="contain" />
        </Box>
      </Box>

      {/* Posts Section */}
      <Box mt={{ base: "38px", lg: "17px" }} px={{ base: "16px", lg: "203px" }} maxW="1200px" mx="auto">
        <Box mx="auto" maxW="1200px">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 340px" }} gridGap="22px">
            {/* Latest Articles with scroll */}
            <Box order={{ base: 2, lg: 1 }}>
              <Box mt="10px" textAlign="center" fontWeight="bold" fontSize="24" pb="36px">
                <Text position="relative" display="inline-block">
                  {page?.content?.latestSection?.title}
                  <Box width="6.15px" height="27.69px" borderRadius="5px" pos="absolute" right={["-6", "-6", "-12"]} bottom="-3" background="#EFEFEF" transform="rotate(30deg)"/>
                  <Box width="6.15px" height="27.69px" borderRadius="5px" pos="absolute" left={["-6", "-6", "-12"]} bottom="-3" background="#EFEFEF" transform="rotate(-30deg)"/>
                </Text>
              </Box>
              <InfiniteScroll
                dataLength={latestPosts.length}
                next={!activeFilter? fetchData : fetchFilteredPosts}
                hasMore={latestPosts.length <= totalLatest}
                loader={<SkeletonPlaceholder />}
                endMessage={<SkeletonPlaceholder noDisplay />}
                // below props only if you need pull down functionality
                // refreshFunction={this.refresh}
                // pullDownToRefresh
                // pullDownToRefreshThreshold={50}
                // pullDownToRefreshContent={
                //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                // }
                // releaseToRefreshContent={
                //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                // }
              >
                <Grid templateColumns={{base: "repeat(1, 292px)", md: "repeat(1, fr)", lg: "repeat(2, 1fr)"}} justifyContent={{ base: "center", lg: "unset" }} rowGap={{base: "36px", lg: "48px"}} columnGap="16px">
                  {latestPosts.map((post, i) => (
                    <Stack key={i} cursor="pointer" onClick={() => router.push(`/sharing/${post.slug}`)}>
                      <Image objectFit="cover" src={post.coverImage} borderRadius="16px" background="#fff" w={{base: "292px", md: "100%", lg: "276px"}} h={{ base: "220px", lg: "208px" }} mb="6px" />
                      <Flex>
                        <Box fontSize="12px" color={getCategoryData(post.category).textColor} background={getCategoryData(post.category).bgColor} borderRadius="19px" px="9px" mr="9px" display="inline">
                          {getCategoryData(post.category).label}
                        </Box>
                        <Text fontSize="12px" display="inline-block">{moment(post.publishDate).format("D MMM, hh:mm")}</Text>
                      </Flex>
                      <Text fontSize={{base: "20px", lg: "24px"}} fontWeight="bold" mb="5px" mt="5px">{post.title}</Text>
                      <Text fontSize={{base: "16px", lg: "16px"}} h="70px" overflow="hidden" position="relative">
                        {post.excerpt}
                        <Box textAlign="right" position="absolute" bottom="0" right="5px" background="#fff">
                          ... <chakra.span color="#007878" fontSize="16px" fontWeight="bold">More</chakra.span>
                        </Box>
                      </Text>
                    </Stack>
                  ))}
                </Grid>
                
              </InfiniteScroll>
            </Box>

            {/* Right Section of Grid */}
            <Box order={{ base: 1, lg: 2 }} mt={{ base: "36px", lg: "unset" }}>
              <Box textAlign="left" fontSize="36px" pb="15px">
                <Text pos="relative" display="inline-block" pl="8px">
                  <Box zIndex={1} pos="relative">{page?.content?.hotestSection?.title}</Box>
                  <Box w="112px" height="33px" borderRadius="16.5px" background="#EFEFEF" pos="absolute" left="0" bottom="-3px"></Box>
                  <Box w="0px" height="0px" borderRight="5px solid transparent" borderLeft="5px solid transparent" borderTop="12px solid #EFEFEF" transform="scaleY(-1) rotate(150deg)" pos="absolute" left="0" bottom="-11px"></Box>
                </Text>
              </Box>

              <Flex direction="column">
                {hottestPosts.map((post, i) => (
                  <Grid templateColumns="45px 1fr" justifyContent={{ base: "center", lg: "unset" }} columnGap="8px" key={i} pt="11px" borderTop="1px solid #EFEFEF" mb="16px">
                    <Text fontSize="36px" textAlign="left" color="#EFEFEF">{`0${i+1}`}</Text>
                    <Box key={i} cursor="pointer" onClick={() => router.push(`/sharing/${post.slug}`)}>
                      <Flex>
                        <Box fontSize="12px" color={getCategoryData(post.category).textColor} background={getCategoryData(post.category).bgColor} borderRadius="19px" px="9px" mr="9px" display="inline">
                          {getCategoryData(post.category).label}
                        </Box>
                        <Text fontSize="12px" display="inline-block">{moment(post.publishDate).format("D MMM, hh:mm")}</Text>
                      </Flex>
                      <Text fontSize="16px" fontWeight={{base: "unset", lg: "bold"}} mb="5px" mt="5px">{post.title}</Text>
                      <Text fontSize={{base: "16px", lg: "16px"}} h="46px" overflow="hidden" position="relative">
                        {post.excerpt}
                        <Box textAlign="right" position="absolute" bottom="0" right="5px" background="#fff">
                          ... <chakra.span color="#197350" fontSize="16px" fontWeight="bold">More</chakra.span>
                        </Box>
                      </Text>
                    </Box>
                  </Grid>
                ))}
              </Flex>

              <Box mt="170px" display={{ base: "none", lg: "block" }}>
                <Box textAlign="left" fontSize="36px">
                  <Text pos="relative" display="inline-block" pl="8px">
                    <Box zIndex={1} pos="relative">{page?.content?.categorySection?.title}</Box>
                    <Box w="112px" height="33px" borderRadius="16.5px" background="#EFEFEF" pos="absolute" left="0" bottom="-3px"></Box>
                    <Box w="0px" height="0px" borderRight="5px solid transparent" borderLeft="5px solid transparent" borderTop="12px solid #EFEFEF" transform="scaleY(-1) rotate(150deg)" pos="absolute" left="0" bottom="-11px"></Box>
                  </Text>
                </Box>
              </Box>
              <Flex flexWrap="wrap" display={{ base: "none", lg: "flex" }}>
                {(categories ?? []).map((category, i) => (
                  <Box key={i} display="flex" fontSize="16px" color={category.textColor} background={category.color} borderRadius="20px" px="16px" py="9px" mr="16px" mt="16px" cursor="pointer" onClick={() => handleFilter(category.key)}>
                    <Image pr="12px" w="auto" maxH="20px" src={category.image} />
                    <chakra.span>{lang === "en" ? category.label.en : category.label.zh}</chakra.span>
                  </Box>
                ))}
              </Flex>
              
            </Box>
          </Grid>

        </Box>
      </Box>
      {/* <Text>{JSON.stringify(page)}</Text> */}
      {/* <Text>{JSON.stringify(categories)}</Text> */}
    </VStack>
  );
};

export default withPostCreatorCMS(
  withPageCMS(Sharing, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

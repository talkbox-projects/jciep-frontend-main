import { chakra, Image } from "@chakra-ui/react";
import { Text, VStack, Box, Grid } from "@chakra-ui/layout";
import InfiniteScroll from 'react-infinite-scroll-component';
import React from "react";
import moment from "moment";
import { getPage } from "../../utils/page/getPage";
import { NextSeo } from "next-seo";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import withPageCMS from "../../utils/page/withPageCMS";
import withPostCMS from "../../utils/post/withPostCMS";
import withPostCreatorCMS from "../../utils/post/withPostCreatorCMS";
import { getLatestPosts, getPost } from "../../utils/post/getPost";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
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
  const [latestPostsPage, setLatestPostsPage] = React.useState(1);
  const [featuredArticle, setFeaturedArticle] = React.useState({});
  const getCategoryData = (key) => {
    const category = categories.find(c => c.key === key);
    const data = {};
    data.label = lang === "en" ? category.label.en : category.label.zh;
    data.icon = category.image;
    data.bgColor = category.color;
    return data;
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  React.useEffect(() => {
    if (page?.content?.featured) {
      fetchFeaturedArticle(page?.content?.featured);
    }
  }, [page?.content])

  const fetchData = async () => {
    console.log("$$$$ Fetching Data")
    try {
      const data = await getLatestPosts({page: latestPostsPage, limit: 3});
      console.log("&&&&&& data: ", data);
      setLatestPosts([...latestPosts, ...data]);
      setLatestPostsPage(latestPostsPage + 1);
    } catch (err) {
      console.log("***** error", err);
    }
  }

  const fetchFeaturedArticle = async (slug) => {
    const post = await getPost({
      idOrSlug: slug,
      lang: lang,
    });
    console.log("&&&&& featured: ", post);
    setFeaturedArticle(post);
  }

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
        <chakra.span pos="relative" display={{ base: "none", lg: "block" }}>
          <chakra.span backgroundImage="linear-gradient(#fff, #fff)" textAlign="left" ml="43" fontSize={["0", "0", "36px"]} lineHeight={2} backgroundRepeat="no-repeat" backgroundPosition="0 0.5em" zIndex="2" pos="relative" px="15px" pb="6px">{page?.content?.title}</chakra.span>
        </chakra.span>
        {featuredArticle && (
          <Box mt={{ base: "0", lg: "24px"}} display="flex" flexDirection={{ base: "column", lg: "row" }}>
            <Image h={{base: "auto", lg: "330px"}} w={{base: "100%", lg: "429px"}} src={featuredArticle.coverImage} mr={{base: "0", lg: "34px"}} zIndex={{base: 0, lg: 1}} />
            <Box display="flex" flexDir="column" position={{ base: "absolute", lg: "relative" }} top={{ base: "162px", lg: "unset" }} boxShadow={{ base: "12px 12px 24px 0px rgba(30,30,30,0.1)", lg: "none" }}>
              <Image src={getCategoryData(featuredArticle.category).icon} mb="16px" w="48px" h="40px" ml={{ base: "16px", lg: "unset" }} />
              <Box background={{ base: "#fff", lg: "none" }} borderRadius={{ base: "10px", lg: "0px" }} mx={{ base: "16px", lg: "0px" }} zIndex={{ base: 1, lg: "unset" }} p={{ base: "16px", lg: "unset" }}>
                <Box mb="8px">
                  <Box fontSize="12px" background={getCategoryData(featuredArticle.category).bgColor} borderRadius="19px" px="9px" mr="9px" display="inline">
                    {getCategoryData(featuredArticle.category).label}
                  </Box>
                  <Text fontSize="12px" display="inline-block">{moment(featuredArticle.publishDate).format("D MMM, hh:mm")}</Text>
                </Box>
                <Text fontSize={{base: "24px", lg: "48px"}} fontWeight="bold" mb={{base: "16px", lg: "8px"}}>{featuredArticle.title}</Text>
                <Text fontSize={{base: "14px", lg: "16px"}} mb={{base: "49px", lg: "unset"}}>{featuredArticle.excerpt}</Text>
              </Box>
            </Box>
          </Box>
        )}
        <Image position="absolute" left="0" bottom="0" src={page?.content?.bottomBorderFeatured} width="100%" fit="contain" />
      </Box>

      {/* Posts Section */}
      <Box mt={{ base: "38px", lg: "17px" }} px={{ base: "16px", lg: "203px" }}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 340px" }} gridGap="22px">
          <Box>
            <Box mt="10px" textAlign="center" fontWeight="bold" fontSize="24">
              <Text position="relative" display="inline-block">
                {page?.content?.latestSection?.title}
                <Box width="6.15px" height="27.69px" borderRadius="5px" pos="absolute" right={["-6", "-6", "-12"]} bottom="-3" background="#EFEFEF" transform="rotate(30deg)"/>
                <Box width="6.15px" height="27.69px" borderRadius="5px" pos="absolute" left={["", "-6", "-12"]} bottom="-3" background="#EFEFEF" transform="rotate(-30deg)"/>
              </Text>
            </Box>
          </Box>
          <Box>
            <Box textAlign="left" fontSize="36px">
              <Text pos="relative" display="inline-block" pl="8px">
                <Box zIndex={1} pos="relative">{page?.content?.hotestSection?.title}</Box>
                <Box w="112px" height="33px" borderRadius="16.5px" background="#EFEFEF" pos="absolute" left="0" bottom="-3px"></Box>
                <Box w="0px" height="0px" borderRight="5px solid transparent" borderLeft="5px solid transparent" borderTop="12px solid #EFEFEF" transform="scaleY(-1) rotate(150deg)" pos="absolute" left="0" bottom="-11px"></Box>
              </Text>
            </Box>
          </Box>
        </Grid>
        
      </Box>

      <InfiniteScroll
        dataLength={latestPosts.length}
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
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
        {latestPosts.map((post, i) => (
          <Text key={i} pt="250px">{JSON.stringify(post)}</Text>
        ))}
        
      </InfiniteScroll>
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

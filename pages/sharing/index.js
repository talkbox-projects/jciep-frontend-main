import { chakra, Image } from "@chakra-ui/react";
import { Text, VStack, Box } from "@chakra-ui/layout";
import InfiniteScroll from 'react-infinite-scroll-component';
import React from "react";
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
    const post=  await getPost({
      idOrSlug: slug,
      lang: lang,
    });
    console.log("&&&&&", post);
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
        h="calc(50vw - 40px)"
        w="100%"
        position="relative"
        overflowY="hidden"
        background={page?.content?.bannerColor}
        pt={["0", "0", "159px"]}
        px={["0", "0", "203px"]}
        pb={["164px","164px", "120px"]}
      >
        <chakra.span pos="relative">
          <chakra.span backgroundImage="linear-gradient(#fff, #fff)" textAlign="left" ml="43" fontSize={["0", "0", "36px"]} lineHeight={2} backgroundRepeat="no-repeat" backgroundPosition="0 0.5em" zIndex="2" pos="relative" px="15px" pb="6px">{page?.content?.title}</chakra.span>
        </chakra.span>
        {featuredArticle && (
          <Box mt={["0", "0", "24px"]}>
            <Image h="330px" w="429px" background={featuredArticle.coverImage} mr="34px" />
          </Box>
        )}
        <Image position="absolute" left="0" bottom="0" src={page?.content?.bottomBorderFeatured} width="100%" fit="contain" />
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

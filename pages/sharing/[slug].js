import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPost, getRelatedPosts } from "../../utils/post/getPost";
import { updateReadCount } from "../../utils/post/mutatePost";
import withPostCMS from "../../utils/post/withPostCMS";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import {
  chakra,
  Heading,
  Text,
  Image,
  Tag,
  AspectRatio,
  Divider,
} from "@chakra-ui/react";
import { Box, VStack, Grid, GridItem, HStack, Flex } from "@chakra-ui/layout";
import moment from "moment";
import wordExtractor from "../../utils/wordExtractor";
import marked from "marked";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  return {
    props: {
      post: await getPost({
        idOrSlug: context.params.slug,
        lang: context.locale,
      }),
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
    },
  };
};

const PostDetail = ({ post, setting, page, lang }) => {
  const categories = setting?.value?.categories;
  const postBg = page?.content?.postSection;
  const [relatedArticles, setRelatedArticles] = useState([]);

  const router = useRouter();

  useEffect(() => {
    updateReadCount(post.id);
    fetchRelatedPosts();
  }, []);

  const getCategoryData = (key) => {
    const category = (categories ?? []).find((c) => c.key === key);
    if (category) {
      const data = {};
      data.label = lang === "en" ? category.label.en : category.label.zh;
      data.icon = category.image;
      data.bgColor = category.color;
      return data;
    }
    return {};
  };

  const fetchRelatedPosts = async () => {
    if (post?.id) {
      const posts = await getRelatedPosts({
        limit: 3,
        category: post.category,
        id: post.id,
      });
      setRelatedArticles(posts);
    }
  };

  return (
    <VStack overflowY="visible" w="100%" spacing={0} align="stretch">
      {/* Banner Section */}

      <Box
        bg={["", "", postBg?.bgColor]}
        w="100%"
        position="relative"
        display="flex"
        overflowY="visible"
        alignItems="center"
        flexDirection="column"
        zIndex="0"
        pb="-5%"
      >
        <Box
          zIndex="10"
          pt={["0px", "0px", "160px"]}
          w={["100%", "100%", "600px"]}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image src={post?.coverImage} w="100%" />
        </Box>

        <Image
          pos="absolute"
          bottom="-1"
          zIndex={["10", "10", "1"]}
          src={postBg?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* post Detail Section */}
      <Box pos="relative" w="100%">
        <Box
          pb="10%"
          px={["16px", "16px", "16px", "204px"]}
          pt={["", "", "14px"]}
        >
          <Grid
            templateColumns={{ lg: "160px 1fr", base: "1fr" }}
            gap={["0px", "0px", "42px"]}
            maxW="1200px"
            mx="auto"
          >
            <GridItem display={["none", "none", "none", "block"]}>
              <VStack display={["none", "none", "none", "block"]} pt="600px">
                <Box w="200px" position="relative" mb="34px">
                  <Text
                    pt={8}
                    textAlign="center"
                    fontWeight="semibold"
                    fontSize={["lg", "1xl", "2xl"]}
                  >
                    {wordExtractor(page?.content?.wordings, "furthurReading")}
                  </Text>
                  <Box
                    width="6.15px"
                    height="27.69px"
                    borderRadius="5px"
                    pos="absolute"
                    right={["0", "0", "3"]}
                    bottom="-3"
                    background="#EFEFEF"
                    transform="rotate(30deg)"
                  />
                  <Box
                    width="6.15px"
                    height="27.69px"
                    borderRadius="5px"
                    pos="absolute"
                    left={["0", "0", "3"]}
                    bottom="-3"
                    background="#EFEFEF"
                    transform="rotate(-30deg)"
                  />
                </Box>
                {relatedArticles.map(
                  ({ category, title, excerpt, slug }, index) => {
                    return (
                      <Box
                        key={index}
                        pb="40px"
                        cursor="pointer"
                        onClick={() => router.push(`/sharing/${slug}`)}
                      >
                        <Tag
                          color={getCategoryData(category).textColor}
                          bg={getCategoryData(category).bgColor}
                          fontSize="12px"
                          borderRadius="19px"
                        >
                          {getCategoryData(category).label}
                        </Tag>
                        <Text fontSize="22px" color="#1E1E1E">
                          {title}
                        </Text>
                        <Text fontSize="18px" noOfLines={3} color="#1E1E1E">
                          {excerpt}
                        </Text>
                        <br />
                        <Divider />
                      </Box>
                    );
                  }
                )}
              </VStack>
            </GridItem>
            <GridItem>
              <VStack pl={["", "", "20px"]} pr={["0px", "0px", "0px", "150px"]}>
                <Box w="100%">
                  <Image
                    src={getCategoryData(post?.category).icon}
                    w="auto"
                    maxH={["16px", "16px", "32px"]}
                  />
                </Box>
                <HStack pt={["8px"]} w="100%" justify="space-between">
                  <Flex>
                    <Box
                      color={getCategoryData(post?.category).textColor}
                      background={getCategoryData(post?.category).bgColor}
                      fontSize="12px"
                      borderRadius="19px"
                      px="5px"
                    >
                      {getCategoryData(post?.category).label}
                    </Box>
                    <Text ml="8px" fontSize="12px" color="#1E1E1E">
                      {moment(post?.publishDate).format("D MMM, hh:mm")}
                    </Text>
                  </Flex>
                  <Flex>
                    {(postBg?.socialIcons ?? []).map(
                      ({ image, url }, index) => {
                        return (
                          <Image
                            cursor="pointer"
                            w={["24px", "32px"]}
                            h={["24px", "32px"]}
                            src={image}
                            key={index}
                          />
                        );
                      }
                    )}
                  </Flex>
                </HStack>
                <VStack w="100%">
                  <Heading
                    fontWeight="normal"
                    maxW="100%"
                    color="#1e1e1e"
                    fontSize={["24px", "24px", "52px"]}
                  >
                    {post?.title}
                  </Heading>
                  <Heading
                    pt="24px"
                    maxW="100%"
                    fontWeight="normal"
                    color="#1e1e1e"
                    fontSize={["14px", "14p", "16px"]}
                  >
                    {post?.excerpt}
                  </Heading>
                </VStack>
                <VStack>
                  {(post?.content?.blocks ?? []).map(
                    ({ _template, content, caption, image, link }, index) => {
                      console.log(content);
                      switch (_template) {
                        case "content-block":
                          return (
                            <chakra.div
                              pt="40px"
                              dangerouslySetInnerHTML={{
                                __html: marked(content),
                              }}
                              color="#1E1E1E"
                              key={index}
                              fontSize={["14px", "14px", "16px", "16px"]}
                            />
                          );
                        case "image-block":
                          return (
                            <VStack pt="40px" w="100%">
                              <AspectRatio w={["100%", "100%", "512px"]}>
                                <Image
                                  title="postImage"
                                  src={image}
                                  allowFullScreen
                                />
                              </AspectRatio>
                            </VStack>
                          );
                        case "video-block":
                          return (
                            <VStack pt="40px" w="100%">
                              <AspectRatio
                                w={["100%", "100%", "512px"]}
                                h={["160px", "160px", "285px"]}
                              >
                                <iframe
                                  title="post"
                                  src={link}
                                  allowFullScreen
                                />
                              </AspectRatio>
                            </VStack>
                          );

                        default:
                      }
                    }
                  )}
                </VStack>

                <Box w="100%" alignItems="start" pt="40px">
                  <Divider opacity="1" />
                  <Text
                    pt="40px"
                    textAlign="left"
                    fontSize={["14px", "14px", "16px"]}
                    w="100%"
                    color="#1E1E1E"
                  >
                    {wordExtractor(page?.content?.wordings, "tagsHeading")}
                  </Text>
                  <HStack pt="10px" wrap="wrap">
                    {(post?.tags ?? []).map((d, i) => {
                      return (
                        <Tag
                          pt="8px"
                          pr="16px"
                          fontSize="16px"
                          borderRadius="19px"
                          bg="#FAFAFA"
                          key={i}
                        >
                          {d}
                        </Tag>
                      );
                    })}
                  </HStack>
                </Box>
                <VStack w="100%" alignItems="start" pt="40px">
                  <Divider opacity="1" />
                  <Text
                    pt="40px"
                    textAlign="left"
                    fontSize={["14px", "14px", "16px"]}
                    w="100%"
                    color="#1E1E1E"
                  >
                    {wordExtractor(page?.content?.wordings, "referenceHeading")}
                  </Text>
                  {(post?.references ?? []).map(({ label, url }, index) => {
                    return (
                      <Text
                        cursor="pointer"
                        textAlign="left"
                        w={["288px", "288px", "536px"]}
                        fontSize={["12px", "12px", "14px"]}
                        w="100%"
                        color="#1E1E1E"
                      >
                        {label}
                      </Text>
                    );
                  })}
                </VStack>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
        <Image
          pos="absolute"
          bottom="-1"
          src={postBg?.postBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Second Post Section */}
      <Box
        bg={["", "", postBg?.bgColor]}
        w="100%"
        position="relative"
        display="flex"
        overflowY="visible"
        alignItems="center"
        flexDirection="column"
        zIndex="0"
        pb="-5%"
      >
        <Box
          zIndex="10"
          pt={["1", "1", "160px"]}
          w={["100%", "100%", "600px"]}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image src={relatedArticles[0]?.coverImage} w="100%" />
        </Box>

        <Image
          pos="absolute"
          bottom="-1"
          zIndex={["10", "10", "1"]}
          src={postBg?.secondPostBottom}
          width="100%"
          fit="auto"
        />
      </Box>
      {relatedArticles && relatedArticles[0] && (
        <Box
          pos="relative"
          w="100%"
          cursor="pointer"
          onClick={() => router.push(`/sharing/${relatedArticles[0].slug}`)}
        >
          <Box
            pb="10%"
            px={["16px", "16px", "25%", "31%"]}
            pt={["", "", "14px"]}
          >
            <VStack w="100%">
              <Box w="100%">
                <Image
                  src={getCategoryData(relatedArticles[0]?.category).icon}
                  w={["20px", "20px", "40px"]}
                  h={["16px", "16px", "32px"]}
                />
              </Box>
              <HStack pt={["8px"]} w="100%" justify="space-between">
                <Flex>
                  <Tag
                    color={
                      getCategoryData(relatedArticles[0]?.category).textColor
                    }
                    background={
                      getCategoryData(relatedArticles[0]?.category).bgColor
                    }
                    fontSize="12px"
                    borderRadius="19px"
                    px="5px"
                  >
                    {getCategoryData(relatedArticles[0]?.category).label}
                  </Tag>
                  <Text ml="8px" fontSize="12px" color="#1E1E1E">
                    {moment(relatedArticles[0]?.publishDate).format(
                      "D MMM, hh:mm"
                    )}
                  </Text>
                </Flex>
                <Flex>
                  {(postBg?.socialIcons ?? []).map(({ image, url }, index) => {
                    return (
                      <Image
                        cursor="pointer"
                        w={["24px", "32px"]}
                        h={["24px", "32px"]}
                        src={image}
                        key={index}
                      />
                    );
                  })}
                </Flex>
              </HStack>
              <VStack w="100%">
                <Heading
                  fontWeight="normal"
                  maxW="100%"
                  color="#1e1e1e"
                  fontSize={["24px", "24px", "52px"]}
                >
                  {relatedArticles[0]?.title}
                </Heading>
                <Heading
                  pt="24px"
                  maxW="100%"
                  fontWeight="normal"
                  color="#1e1e1e"
                  fontSize={["14px", "14p", "16px"]}
                >
                  {relatedArticles[0]?.excerpt}
                </Heading>
              </VStack>
            </VStack>
          </Box>
        </Box>
      )}
    </VStack>
  );
};

export default withPostCMS(
  withPageCMS(PostDetail, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

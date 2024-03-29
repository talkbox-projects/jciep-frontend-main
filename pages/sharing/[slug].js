import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPost, getRelatedPosts } from "../../utils/post/getPost";
import { updateReadCount } from "../../utils/post/mutatePost";
import withPostCMS from "../../utils/post/withPostCMS";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import NextLink from "next/link";
import {
  Link,
  Heading,
  HStack,
  Text,
  Image,
  Icon,
  Tag,
  AspectRatio,
  Divider,
  Button,
  chakra,
} from "@chakra-ui/react";
import { ImShare } from "react-icons/im";
import { Box, VStack, Wrap, WrapItem } from "@chakra-ui/layout";
import moment from "moment";
import wordExtractor from "../../utils/wordExtractor";
import DividerSimple from "../../components/DividerSimple";
import DividerTriple from "../../components/DividerTriple";
import Container from "../../components/Container";
import CategoryTag from "../../components/CategoryTag";
import { VscQuote } from "react-icons/vsc";
import HighlightHeadline from "../../components/HighlightHeadline";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { getYoutubeLink } from "../../utils/general";
import HoverCard from "../../components/HoverCard";
const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const post = await getPost({
    idOrSlug: context.params.slug,
    lang: context.locale,
  });

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      post: post
        ? post
        : (await getPost({
            idOrSlug: context.params.slug,
            lang: context.locale === "zh" ? "en" : "zh",
          })) ?? {},
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const PostHeader = ({ headerTitle, categories, post }) => {
  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };
  return (
    <Box w="100%">
      <Box
        d={["none", "none", "block"]}
        pb={[72, 72, 72, 72, 56, 56]}
        w="100%"
        position="relative"
      >
        <Box position="absolute" bottom={0} zIndex={50} w="100%">
          <AspectRatio
            borderWidth={8}
            borderColor="#FFF"
            borderRadius={16}
            maxW="600px"
            mx="auto"
            w={"100%"}
            ratio={4 / 3}
            overflow="hidden"
          >
            <Image alt={post?.title} src={post.coverImage} />
          </AspectRatio>
        </Box>
        <HStack
          alignContent="flex-end"
          paddingBottom={8}
          justifyContent="center"
          bgColor="#f6d644"
          minH="320px"
        >
          {headerTitle && (
            <ApostropheHeadline>{headerTitle}</ApostropheHeadline>
          )}
        </HStack>
        <Box bgColor="#f6d644">
          <DividerSimple flip={true} primaryColor="#f6d644"></DividerSimple>
        </Box>
      </Box>
      <Box d={["block", "block", "none"]} position="relative">
        {headerTitle && (
          <HStack
            alignContent="flex-end"
            paddingBottom={8}
            justifyContent="center"
            bgColor="#f6d644"
          >
            <ApostropheHeadline>{headerTitle}</ApostropheHeadline>
          </HStack>
        )}
        <AspectRatio w="100%" ratio={4 / 3}>
          <Image alt={post?.title} src={post.coverImage} />
        </AspectRatio>
        <Box w="100%" position="absolute" bottom={0}>
          <DividerSimple flip={true} primaryColor="#f6d644"></DividerSimple>
        </Box>
      </Box>
      <Container maxW={["100%", "100%", 600, 600, 600]}>
        <VStack align="start" w="100%">
          <Icon
            my={2}
            as={VscQuote}
            fontSize={56}
            color="#eee"
            fontWeight="bold"
          />
          <Wrap>
            <CategoryTag
              size="sm"
              category={getCategoryData(post?.category)}
              withIcon={false}
            />
            <Text fontSize="sm">
              {moment(post?.publishDate).format("D MMM, hh:mm a")}
            </Text>
          </Wrap>
          <Heading
            fontSize={["3xl", "3xl", "5xl", "5xl"]}
            maxW="100%"
            color="#1e1e1e"
          >
            {post?.title}
          </Heading>
        </VStack>
      </Container>
    </Box>
  );
};

const PostDetail = ({ post, setting, page }) => {
  const [relatedArticles, setRelatedArticles] = useState([]);

  const router = useRouter();

  const fetchRelatedPosts = useCallback(async () => {
    if (post?.id) {
      const posts = await getRelatedPosts({
        limit: 3,
        category: post?.category,
        id: post.id,
      });
      setRelatedArticles(posts);
    }
  }, [post?.category, post.id]);

  useEffect(() => {
    updateReadCount(post.id);
    fetchRelatedPosts();
  }, [fetchRelatedPosts, post.id]);

  const categories = setting?.value?.categories;
  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };

  const nextPost = useMemo(() => relatedArticles?.[0], [relatedArticles]);

  return (
    <VStack w="100%" spacing={0} align="center" pb={16} bgColor="#fafafa">
      <NextSeo
        title={
          router.locale === "zh"
            ? `賽馬會共融．知行計劃｜共融分享｜${post?.title}`
            : `Jockey Club Collaborative Project for Inclusive Employment｜Sharings on Inclusion｜${post?.title}`
        }
      />
      {/* Banner Section */}
      {post && <PostHeader categories={categories} post={post} />}

      <Container
        pt={16}
        pb={32}
        maxW={["100%", "100%", 600, 576, 600]}
        d="flex"
        position="relative"
      >
        <Box position="absolute" left={-56} bottom={32} height="100%">
          <HoverCard
            desktopProps={{
              top: "160px",
              left: "0px",
              mr: 12,
            }}
            isMobileBreakPointValue={[true, true, true, false]}
          >
            {({ isMobile }) =>
              isMobile ? null : (
                <VStack w={48}>
                  <Box position="relative" mb={4}>
                    <ApostropheHeadline color="#eee">
                      <Text fontSize="lg">
                        {wordExtractor(
                          page?.content?.wordings,
                          "furthurReading"
                        )}
                      </Text>
                    </ApostropheHeadline>
                  </Box>
                  {relatedArticles.map(
                    ({ category, title, excerpt, slug }, index) => {
                      return (
                        <VStack
                          width="100%"
                          align="start"
                          key={index}
                          cursor="pointer"
                          onClick={() => router.push(`/sharing/${slug}`)}
                        >
                          <CategoryTag
                            size="sm"
                            withIcon={false}
                            category={getCategoryData(category)}
                          />
                          <Text fontSize="lg" fontWeight="bold" color="#1E1E1E">
                            {title}
                          </Text>
                          {excerpt && (
                            <Text fontSize="md" noOfLines={3} color="#1E1E1E">
                              {excerpt}
                            </Text>
                          )}
                          <br />
                          <Divider />
                        </VStack>
                      );
                    }
                  )}
                </VStack>
              )
            }
          </HoverCard>
        </Box>

        <VStack align="stretch" textAlign="left" spacing={2} w="100%">
          {post?.excerpt && (
            <Text
              bgColor="gray.50"
              borderLeftWidth={3}
              borderLeftColor="gray.500"
              p={2.5}
              fontWeight="normal"
              color="#1e1e1e"
            >
              {post?.excerpt}
            </Text>
          )}
          <VStack align="stretch" spacing={4} w="100%">
            {(post?.content?.blocks ?? []).map(
              ({ _template, content, caption, image, link, video }, index) => {
                const imageName = image?.substring(
                  image.lastIndexOf("images/") + 7
                );
                switch (_template) {
                  case "content-block":
                    return (
                      <Box className="content-block-wrap" key={index}>
                        <Box
                          sx={{
                            a: {
                              color: "green.700",
                              textDecor: "underline",
                            },
                            table: {
                              w: "100%",
                              th: {
                                borderWidth: "1px",
                                borderColor: "gray.500",
                                bg: "gray.100",
                                padding: "6px"
                              },
                              td: {
                                borderWidth: "1px",
                                borderColor: "gray.500",
                                padding: "6px"
                              },
                            },
                            p: {
                              py: "5px"
                            }
                          }}
                          w="100%"
                          pt="40px"
                          dangerouslySetInnerHTML={{
                            __html: content.html ?? content,
                          }}
                          fontSize={"lg"}
                        />
                      </Box>
                    );
                  case "image-block":
                    return (
                      <VStack align="stretch" key={index}>
                        <Image
                          alt={caption ?? imageName}
                          w="100%"
                          src={image}
                          allowFullScreen
                        />
                        <Text color="gray.800" fontSize={"lg"}>{caption}</Text>
                      </VStack>
                    );
                  case "video-block": {
                    const youtubeLink = getYoutubeLink(video ?? link);
                    return (
                      <VStack align="stretch" key={index}>
                        <AspectRatio w="100%" ratio={16 / 9}>
                          <iframe
                            title="post"
                            src={youtubeLink}
                            allowFullScreen
                          />
                        </AspectRatio>
                        <Text color="gray.800" fontSize={"lg"}>{caption}</Text>
                      </VStack>
                    );
                  }
                  default:
                }
              }
            )}
          </VStack>
        </VStack>
      </Container>

      <Container maxW={["100%", "100%", 600, 576, 600]} position="relative">
        {/* {post?.tags?.length > 0 && (
          <VStack align="start" pt={12}>
            <Divider />
            <Text pt={8} textAlign="left">
              {wordExtractor(page?.content?.wordings, "tagsHeading")}
            </Text>
            <Wrap mt={6} spacing={8}>
              {(post?.tags ?? []).map((tag, i) => {
                return (
                  <WrapItem key={i}>
                    <Tag
                      p={3}
                      size="lg"
                      fontSize="lg"
                      borderRadius={16}
                      bg="gray.50"
                      key={i}
                    >
                      {tag}
                    </Tag>
                  </WrapItem>
                );
              })}
            </Wrap>
          </VStack>
        )} */}

        <VStack align="center" py={8}>
          <NextLink href="/sharing">
            <Button
              color="black"
              mx="auto"
              fontWeight="bold"
              lineHeight={3}
              borderRadius="3xl"
              colorScheme="primary"
              bgColor="primary.400"
            >
              {wordExtractor(page?.content?.wordings, "backToHome")}
            </Button>
          </NextLink>
        </VStack>

        {post?.references?.length > 0 && (
          <VStack align="start" pt={8}>
            <Divider />
            <Text pt={8} textAlign="left">
              {wordExtractor(page?.content?.wordings, "referenceHeading")}
            </Text>
            {(post?.references ?? []).map(({ label, url = "#" }, index) => {
              return (
                <chakra.a href={url} target="_blank" key={index}>
                  <Button
                    rightIcon={<ImShare />}
                    fontWeight="normal"
                    variant="link"
                    size="sm"
                    color="#1E1E1E"
                  >
                    {label}
                  </Button>
                </chakra.a>
              );
            })}
          </VStack>
        )}
      </Container>

      <Box w="100%">
        <DividerTriple
          nextColor="#f6d644"
          primaryColor="#00BAB4"
          secondaryColor="#fff"
        />
      </Box>

      {nextPost && (
        <>
          <Box w="100%" cursor="pointer">
            <NextLink passHref href={`/sharing/${nextPost?.slug}`}>
              <Link d="block">
                <PostHeader
                  headerTitle={wordExtractor(
                    page?.content?.wordings,
                    "nextPostHeading"
                  )}
                  categories={categories}
                  post={nextPost}
                />
              </Link>
            </NextLink>
          </Box>
        </>
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

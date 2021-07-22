import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPost, getRelatedPosts } from "../../utils/post/getPost";
import { updateReadCount } from "../../utils/post/mutatePost";
import withPostCMS from "../../utils/post/withPostCMS";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import {
  Heading,
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
import { Box, VStack, Wrap, HStack, WrapItem, Link } from "@chakra-ui/layout";
import moment from "moment";
import wordExtractor from "../../utils/wordExtractor";
import DividerSimple from "../../components/DividerSimple";
import DividerTriple from "../../components/DividerTriple";
import Container from "../../components/Container";
import CategoryTag from "../../components/CategoryTag";
import { VscQuote } from "react-icons/vsc";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import NextLink from "next/link";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { getYoutubeLink } from "../../utils/general";
const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      post: await getPost({
        idOrSlug: context.params.slug,
        lang: context.locale,
      }),
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const PostHeader = ({ categories, post }) => {
  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };
  return (
    <Box w="100%">
      <Box d={["none", "none", "block"]} pb={32} w="100%" position="relative">
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
            <Image src={post.coverImage} objectFit="fill !important"/>
          </AspectRatio>
        </Box>
        <Box bgColor="#f6d644" minH="320px"></Box>
        <Box bgColor="#f6d644">
          <DividerSimple flip={true} primaryColor="#f6d644"></DividerSimple>
        </Box>
      </Box>
      <Box mt={16} d={["block", "block", "none"]} position="relative">
        <AspectRatio w="100%" ratio={4 / 3}>
          <Image src={post.coverImage}/>
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
        category: post.category,
        id: post.id,
      });
      setRelatedArticles(posts);
    }
  }, [post?.id]);

  useEffect(() => {
    updateReadCount(post.id);
    fetchRelatedPosts();
  }, [fetchRelatedPosts]);

  const categories = setting?.value?.categories;
  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };

  const nextPost = useMemo(() => relatedArticles?.[0], [relatedArticles]);

  return (
    <VStack w="100%" spacing={0} align="center" pb={16} bgColor="#fafafa">
      {/* Banner Section */}
      {post && <PostHeader categories={categories} post={post} />}
      <Container
        pt={16}
        pb={32}
        maxW={["100%", "100%", 600, 576, 600]}
        position="relative"
      >
        <VStack
          position="absolute"
          left={-56}
          bottom={32}
          display={["none", "none", "none", "block"]}
          w={48}
        >
          <Box pl={8} position="relative" mb={4}>
            <ApostropheHeadline color="#eee">
              <Text fontSize="lg">
                {wordExtractor(page?.content?.wordings, "furthurReading")}
              </Text>
            </ApostropheHeadline>
          </Box>
          {relatedArticles.map(({ category, title, excerpt, slug }, index) => {
            return (
              <VStack
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
          })}
        </VStack>
        <VStack align="stretch" textAlign="left" spacing={2}>
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
          <VStack align="stretch" spacing={4}>
            {(post?.content?.blocks ?? []).map(
              ({ _template, content, caption, image, link }, index) => {
                switch (_template) {
                  case "content-block":
                    return (
                      <Box
                        w="100%"
                        pt="40px"
                        dangerouslySetInnerHTML={{
                          __html: content,
                        }}
                        key={index}
                        fontSize={"lg"}
                      />
                    );
                  case "image-block":
                    return (
                      <VStack align="stretch">
                        <AspectRatio ratio={1}>
                          <Image
                            fit="contain"
                            title="postImage"
                            src={image}
                            allowFullScreen
                          />
                        </AspectRatio>
                        <Text color="gray.500">{caption}</Text>
                      </VStack>
                    );
                  case "video-block":
                    const youtubeLink = getYoutubeLink(link);
                    return (
                      <VStack align="stretch">
                        <AspectRatio ratio={5 / 3}>
                          <iframe
                            title="post"
                            src={youtubeLink}
                            allowFullScreen
                          />
                        </AspectRatio>
                        <Text color="gray.500">{caption}</Text>
                      </VStack>
                    );

                  default:
                }
              }
            )}
          </VStack>
          {post?.tags?.length > 0 && (
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
          )}

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
        </VStack>
      </Container>

      <Box w="100%">
        <DividerTriple
          nextColor="#f6d644"
          primaryColor="#00BAB4"
          secondaryColor="#fff"
        />
      </Box>

      {nextPost && (
        <Box w="100%" cursor="pointer">
          <chakra.a href={`/sharing/${nextPost?.slug}`}>
            <PostHeader categories={categories} post={nextPost} />
          </chakra.a>
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

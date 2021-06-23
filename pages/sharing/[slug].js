import { useRouter } from "next/router";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPost } from "../../utils/post/getPost";
import withPostCMS from "../../utils/post/withPostCMS";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";
import { chakra, Heading, Text, Image, Tag, AspectRatio, Divider } from "@chakra-ui/react";
import { Box, VStack, Grid, GridItem, HStack, Flex } from "@chakra-ui/layout";
import moment from "moment";
import wordExtractor from "../../utils/wordExtractor";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  return {
    props: {
      post: await getPost({
        idOrSlug: context.params.slug,
        lang: context.locale,
      }),
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
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

const data = [
  {
    title: "我不是弱者，我是快樂的唐寶寶",
    excerpt: "在家中，我是媽媽的開心果 在舞台，我是一個藝術表演 在家中，我是媽媽的開心果 在舞台，我是一個藝術表演",
    category: "我們的故事",
    color: "#FEB534",
  },
  {
    title: "我不是弱者，我是快樂的唐寶寶",
    excerpt: "在家中，我是媽媽的開心果 在舞台，我是一個藝術表演 在家中，我是媽媽的開心果 在舞台，我是一個藝術表演",
    category: "我們的故事",
    color: "#08A3A3",
  },
  {
    title: "我不是弱者，我是快樂的唐寶寶",
    excerpt: "在家中，我是媽媽的開心果 在舞台，我是一個藝術表演 在家中，我是媽媽的開心果 在舞台，我是一個藝術表演",
    category: "我們的故事",
    color: "#F6D644",
  },
];

const PostDetail = ({ post, setting, page }) => {
  const categories = setting?.value?.categories;
  const postBg = page?.content?.postSection;

  const router = useRouter();

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
        <Box pb="10%" px={["16px", "16px", "16px", "204px"]} pt={["", "", "14px"]}>
          <Grid templateColumns="repeat(12, 1fr)" gap={["0px", "0px", "42px"]}>
            <GridItem display={["none", "none", "none", "block"]} colSpan={[0, 0, 0, 3]}>
              <VStack display={["none", "none", "none", "block"]} pt="600px">
                <Box w="200px" position="relative" mb="34px">
                  <Text pt={8} textAlign="center" fontWeight="semibold" fontSize={["lg", "1xl", "2xl"]}>
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
                {(data ?? []).map(({ category, title, color, excerpt }, index) => {
                  return (
                    <Box key={index} pb="40px" w="70%">
                      <Tag bg={color} fontSize="12px" borderRadius="19px">
                        {category}
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
                })}
              </VStack>
            </GridItem>
            <GridItem colSpan={[12, 12, 12, 7]}>
              <VStack pl={["", "", "20px"]} pr={["0px", "0px", "0px", "150px"]}>
                <Box w="100%">
                  <Image src={postBg?.doubleQuoteImage} w={["20px", "20px", "40px"]} h={["16px", "16px", "32px"]} />
                </Box>
                <HStack pt={["8px"]} w="100%" justify="space-between">
                  <Flex>
                    <Tag color="#FEB534" fontSize="12px" borderRadius="19px">
                      {post?.category}
                    </Tag>
                    <Text ml="8px" fontSize="12px" color="#1E1E1E">
                      {moment(post?.publishDate).format("D MMM, hh:mm")}
                    </Text>
                  </Flex>
                  <Flex>
                    {(postBg?.socialIcons ?? []).map(({ image, url }, index) => {
                      return (
                        <Image cursor="pointer" w={["24px", "32px"]} h={["24px", "32px"]} src={image} key={index} />
                      );
                    })}
                  </Flex>
                </HStack>
                <VStack w="100%">
                  <Heading fontWeight="normal" maxW="100%" color="#1e1e1e" fontSize={["24px", "24px", "52px"]}>
                    {post?.title}
                  </Heading>
                  <Heading pt="24px" maxW="100%" fontWeight="normal" color="#1e1e1e" fontSize={["14px", "14p", "16px"]}>
                    {post?.excerpt}
                  </Heading>
                </VStack>
                <VStack>
                  {(post?.content?.blocks ?? []).map(({ _template, content, caption, image, link }, index) => {
                    console.log(content);
                    switch (_template) {
                      case "content-block":
                        return (
                          <chakra.div
                            pt="40px"
                            dangerouslySetInnerHTML={{ __html: content }}
                            color="#1E1E1E"
                            key={index}
                            fontSize={["14px", "14px", "16px", "16px"]}
                          />
                        );
                      case "image-block":
                        return (
                          <VStack pt="40px" w="100%">
                            <AspectRatio w={["100%", "100%", "512px"]}>
                              <Image title="postImage" src={image} allowFullScreen />
                            </AspectRatio>
                          </VStack>
                        );
                      case "video-block":
                        return (
                          <VStack pt="40px" w="100%">
                            <AspectRatio w={["100%", "100%", "512px"]} h={["160px", "160px", "285px"]}>
                              <iframe title="post" src={link} allowFullScreen />
                            </AspectRatio>
                          </VStack>
                        );

                      default:
                    }
                  })}
                </VStack>

                <Box w="100%" alignItems="start" pt="40px">
                  <Divider opacity="1" />
                  <Text pt="40px" textAlign="left" fontSize={["14px", "14px", "16px"]} w="100%" color="#1E1E1E">
                    {wordExtractor(page?.content?.wordings, "tagsHeading")}
                  </Text>
                  <HStack pt="10px" wrap="wrap">
                    {(post?.tags).map((d, i) => {
                      return (
                        <Tag pt="8px" pr="16px" fontSize="16px" borderRadius="19px" bg="#FAFAFA" key={i}>
                          {d}
                        </Tag>
                      );
                    })}
                  </HStack>
                </Box>
                <VStack w="100%" alignItems="start" pt="40px">
                  <Divider opacity="1" />
                  <Text pt="40px" textAlign="left" fontSize={["14px", "14px", "16px"]} w="100%" color="#1E1E1E">
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
        <Image pos="absolute" bottom="-1" src={postBg?.postBottom} width="100%" fit="contain" />
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
          <Image src={post?.coverImage} w="100%" />
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
      <Box pos="relative" w="100%">
        <Box pb="10%" px={["16px", "16px", "25%", "31%"]} pt={["", "", "14px"]}>
          <VStack w="100%">
            <Box w="100%">
              <Image src={postBg?.doubleQuoteImage} w={["20px", "20px", "40px"]} h={["16px", "16px", "32px"]} />
            </Box>
            <HStack pt={["8px"]} w="100%" justify="space-between">
              <Flex>
                <Tag color="#FEB534" fontSize="12px" borderRadius="19px">
                  {post?.category}
                </Tag>
                <Text ml="8px" fontSize="12px" color="#1E1E1E">
                  {moment(post?.publishDate).format("D MMM, hh:mm")}
                </Text>
              </Flex>
              <Flex>
                {(postBg?.socialIcons ?? []).map(({ image, url }, index) => {
                  return <Image cursor="pointer" w={["24px", "32px"]} h={["24px", "32px"]} src={image} key={index} />;
                })}
              </Flex>
            </HStack>
            <VStack w="100%">
              <Heading fontWeight="normal" maxW="100%" color="#1e1e1e" fontSize={["24px", "24px", "52px"]}>
                {post?.title}
              </Heading>
              <Heading pt="24px" maxW="100%" fontWeight="normal" color="#1e1e1e" fontSize={["14px", "14p", "16px"]}>
                {post?.excerpt}
              </Heading>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
};

export default withPostCMS(
  withPageCMS(PostDetail, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

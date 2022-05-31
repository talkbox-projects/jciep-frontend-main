import React, { useCallback, useState } from "react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Divider,
  VStack,
  Grid,
  GridItem,
  Box,
  Text,
  Link,
  Button,
  Stack,
  Flex,
  Image
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import moment from "moment";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";

import { TimeIcon } from "@chakra-ui/icons";
import { IoLocationSharp } from "react-icons/io5";
import { HiDownload } from "react-icons/hi";
import { AiOutlineLink } from "react-icons/ai";
import EVENT from "../../utils/mock/api_event_id.json";

const PAGE_KEY = "events";

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

const JobOpportunities = ({ page }) => {
  const router = useRouter();
  const EVENT_ID = EVENT?.data;

  return (
    <>
      <VStack spacing={0} align="stretch" w="100%">
        <Box
          bgColor="#F6D644"
          position="relative"
        >
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Box minHeight={{ base: "240px", md: "480px" }} />
          </Container>
        </Box>

        <Box bg="#fafafa" pb={12}>
          <Container position={"relative"} mt={{ base: "-140px", md: "-280px" }} pb={8}>
            <Flex direction={{ base: "column", md: "row" }} gap={{ base: 6 }}>
              <Box flex={1}>
                <Box
                  bgImage={`url(${EVENT_ID?.banner?.url})`}
                  h={{ base: "325px" }}
                  w={"100%"}
                  bgSize={{base: "cover"}}
                  bgPosition={"center center"}
                  borderRadius={"15px"}
                  mb={{ base: 4 }}
                  d={{base: "none", md: "block" }}
                />
                <Image src={EVENT_ID?.banner?.url} alt={EVENT_ID.name} w={'100%'} h={'auto'} d={{base: "block", md: "none"}}  borderRadius={"15px"} mb={6}/>
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                  }}
                  gap={6}
                >
                  <GridItem
                    flex={1}
                    bgColor={"#FFF"}
                    borderRadius={"10px"}
                    overflow={"hidden"}
                    boxShadow="xl"
                  >
                    <Box p={"16px"} fontSize={"14px"}>
                      <Stack>
                        <Text fontSize={"xl"} fontWeight="bold">
                          {EVENT_ID.name}
                        </Text>
                        <Flex align="center" gap={2}>
                          <Box w={"20px"}>
                            <TimeIcon color="gray.500" fontSize={18} />
                          </Box>
                          <Box>
                            <b>{EVENT_ID.startDate}</b>- {EVENT_ID.startTime} -{" "}
                            {EVENT_ID.endTime}
                          </Box>
                        </Flex>
                        <Flex align="center" gap={2}>
                          <Box w={"20px"}>
                            <IoLocationSharp color="gray.500" fontSize={18} />
                          </Box>
                          <Box>
                            <b>{EVENT_ID.location}</b>
                          </Box>
                        </Flex>
                      </Stack>
                      <Divider my={4} />
                      <Flex gap={4} direction="column">
                        <Box>關於活動</Box>
                        <Box>活動類別</Box>
                        <Text as="p">{EVENT_ID.description}</Text>
                        <Flex color="#0D8282" align="center" fontWeight={700}>
                          <Box>
                            <HiDownload />
                          </Box>
                          <Text>下載更多活動詳情</Text>
                        </Flex>

                        {EVENT_ID.otherUrl?.map((d) => (
                          <Flex key={d} color="#0D8282" align="center" fontWeight={700}>
                            <Box>
                              <AiOutlineLink />
                            </Box>
                            <Link to={d} target="_blank">{d}</Link>
                          </Flex>
                        ))}
                      </Flex>
                      <Divider my={4} />
                      {EVENT_ID.remark && (<Flex gap={4} direction="column">
                        <Box>備註</Box>
                        <Text as="p">{EVENT_ID.remark}</Text>
                      </Flex>)}
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
              <Box w={{ base: "100%", md: "310px" }}>
                <Box bgColor={"#FFF"} borderRadius={"15px"} py={6} px={4}>
                  <Box>
                    <Text fontWeight={700} mb={2}>
                      關於活動
                    </Text>
                    <Text as="p" fontSize={"14px"}>
                      {EVENT_ID.description}
                    </Text>
                  </Box>
                  <Divider my={6} />
                  <Box fontSize={"14px"}>
                    <Text fontWeight={700} mb={2}>
                      活動登記
                    </Text>
                    <Flex
                      direction={"row"}
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Text>活動負責人</Text>
                      <Text fontWeight={700}>{EVENT_ID.eventManager}</Text>
                    </Flex>
                    <Flex direction={"row"} justifyContent="space-between">
                      <Text>截止登記日子</Text>
                      <Text fontWeight={700}>{EVENT_ID.startDate}</Text>
                    </Flex>
                    <Text mt={6} color="#0D8282" fontWeight={700}>
                      {EVENT_ID.liked
                        ? `你及其他${EVENT_ID.bookmarkCount}人關注中`
                        : `${EVENT_ID.bookmarkCount}關注中`}
                    </Text>
                  </Box>

                  <Flex gap={2} direction={"column"} mt={10}>
                    <Button borderRadius="20px" w={"100%"}>
                      登記
                    </Button>
                    <Button borderRadius="20px" w={"100%"}>
                      網上登記
                    </Button>
                    <Button borderRadius="20px" w={"100%"}>
                      聯絡活動籌辦人
                    </Button>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Container>
        </Box>
      </VStack>
    </>
  );
};

export default withPageCMS(JobOpportunities, {
  key: PAGE_KEY,
  fields: [
    {
      name: "banner",
      label: "頁面橫幅 Hero Banner",
      component: "group",
      fields: [
        {
          label: "右下圖片 Image Right",
          name: "bgImageRight",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
    {
      name: "icon",
      label: "圖示 Icon",
      component: "group",
      fields: [
        {
          label: "工作類型圖標 Employment mode icon",
          name: "modeIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "經驗圖標 Experience icon",
          name: "expIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "地區圖標 Location icon",
          name: "locationIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "時間圖標 Publish Date icon",
          name: "timeIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "申請方法圖標 Apply Methods icon",
          name: "applyMethodsIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "filter",
          label: "篩選 Filter Label",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
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
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

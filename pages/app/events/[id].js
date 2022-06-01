import React, { useCallback, useState } from "react";
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
  Image,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import DividerSimple from "../../../components/DividerSimple";
import wordExtractor from "../../../utils/wordExtractor";
import Container from "../../../components/Container";
import moment from "moment";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";

import { TimeIcon } from "@chakra-ui/icons";
import { IoLocationSharp, IoImageOutline } from "react-icons/io5";
import { HiDownload, HiBookmark } from "react-icons/hi";
import { AiOutlineLink, AiFillBank } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import EVENT from "../../../utils/mock/api_event_id.json";

const PAGE_KEY = "event";

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

const Event = ({ page }) => {
  const router = useRouter();
  const EVENT_ID = EVENT?.data;

  return (
    <Box pt={{ base: "64px" }}>
      <Box bg="#FFF" pb={12}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box flex={1}>
            <Box
              bgImage={`url(${EVENT_ID?.banner?.url})`}
              h={{ base: "280px" }}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              borderRadius={"15px"}
              position={"relative"}
            >
              <Box position={"absolute"} bottom={15} left={2} right={2}>
                <Container>
                  {EVENT_ID.type && (
                    <Box
                      bgColor="#FFF"
                      color="#0D8282"
                      px={2}
                      py={1}
                      borderRadius={"50px"}
                      fontSize={"12px"}
                      d={"inline-block"}
                    >
                      #{EVENT_ID.type}
                    </Box>
                  )}
                  <Text fontSize={"20px"} fontWeight="bold" color="#FFF">
                    {EVENT_ID.name}
                  </Text>
                </Container>
              </Box>
            </Box>
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
              >
                <Box p={"16px"} fontSize={"14px"}>
                  <Stack>
                    <Flex align="center" gap={2}>
                      <Box w={"20px"}>
                        <GoCalendar color="gray.500" fontSize={18} />
                      </Box>
                      <Box>
                        <b>
                          由{EVENT_ID.startDate} 至 {EVENT_ID.endDate}{" "}
                        </b>
                      </Box>
                    </Flex>

                    <Flex align="center" gap={2}>
                      <Box w={"20px"}>
                        <TimeIcon color="gray.500" fontSize={18} />
                      </Box>
                      <Box>
                        <b>
                          {EVENT_ID.startTime} - {EVENT_ID.endTime}{" "}
                        </b>
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

                    <Flex align="center" gap={2}>
                      <Box w={"20px"}>
                        <BiUserCircle color="gray.500" fontSize={18} />
                      </Box>
                      <Box>
                        <b>\</b>
                      </Box>
                    </Flex>
                  </Stack>
                  <Divider my={4} />
                  <Flex gap={4} direction="column">
                    <Flex align="center" gap={2}>
                      <Box w={"20px"}>
                        <AiFillBank color="gray.500" fontSize={18} />
                      </Box>
                      <Box fontWeight={700}>關於活動</Box>
                    </Flex>
                    <Box>
                      <Flex direction={"row"} gap={2}>
                        <Text>活動類別</Text>
                        <Text fontWeight={700}>{EVENT_ID.type}</Text>
                      </Flex>
                    </Box>
                    <Text as="p">{EVENT_ID.description}</Text>
                    <Flex color="#0D8282" align="center" fontWeight={700}>
                      <Box>
                        <HiDownload />
                      </Box>
                      <Text>下載更多活動詳情</Text>
                    </Flex>

                    {EVENT_ID.otherUrl?.map((d) => (
                      <Flex
                        key={d}
                        color="#0D8282"
                        align="center"
                        fontWeight={700}
                      >
                        <Box>
                          <AiOutlineLink />
                        </Box>
                        <Link to={d} target="_blank">
                          {d}
                        </Link>
                      </Flex>
                    ))}
                  </Flex>
                  <Divider my={4} />

                  <Flex align="center" gap={2}>
                    <Box w={"20px"}>
                      <IoImageOutline color="gray.500" fontSize={18} />
                    </Box>
                    <Box fontWeight={700}>活動圖像</Box>
                  </Flex>

                  <Grid
                    templateColumns={{
                      base: "repeat(3, 1fr)",
                    }}
                    gap={2}
                    py={4}
                  >
                    {EVENT_ID.additionalInformation?.map((d) => (
                      <GridItem
                        key={d.id}
                        flex={1}
                        bgColor={"#FFF"}
                        overflow={"hidden"}
                      >
                        <Box
                          bgImage={`url(${d?.url})`}
                          h={"110px"}
                          w={"100%"}
                          bgSize={{ base: "cover" }}
                          bgPosition={"center center"}
                          position={"relative"}
                        />
                      </GridItem>
                    ))}
                  </Grid>

                  <Divider my={4} />
                  {EVENT_ID.remark && (
                    <Flex gap={4} direction="column">
                      <Box>備註</Box>
                      <Text as="p">{EVENT_ID.remark}</Text>
                    </Flex>
                  )}

                  <Flex align="center" gap={2}>
                    <Box w={"20px"}>
                      <GoCalendar color="gray.500" fontSize={18} />
                    </Box>
                    <Box fontWeight={700}>活動登記</Box>
                  </Flex>

                  <Stack direction={"column"} spacing={2} py={4}>
                    <Flex direction="row" gap={2}>
                      <Text>截止登記日子</Text>
                      <Text fontWeight={700}>
                        {EVENT_ID.submissionDeadline}
                      </Text>
                    </Flex>
                    <Flex direction="row" gap={2}>
                      <Text>活動負責人</Text>
                      <Text fontWeight={700}>{EVENT_ID.eventManager}</Text>
                    </Flex>
                    <Flex direction="row" gap={2}>
                      <Text>備註</Text>
                      <Text fontWeight={700}>
                        {EVENT_ID.remark ? EVENT_ID.remark : "N/A"}
                      </Text>
                    </Flex>
                  </Stack>
                </Box>

                <Box>
                  <Box
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
                      marginTop: "60px",
                    }}
                    h={"16px"}
                    w={"100%"}
                    opacity={0.2}
                  />
                  <Box px={"15px"} py={"12px"} w="100%">
                    <Flex direction="row" gap={4}>
                      <Button
                        backgroundColor="#F6D644"
                        borderRadius="22px"
                        height="44px"
                        width="100%"
                        flex={1}
                      >
                        登記
                      </Button>
                      <Box border="1px solid #EFEFEF" borderRadius="50%" p={2} minW={'30px'}>
                        <HiBookmark color="#0D8282" fontSize={24} />
                      </Box>
                    </Flex>
                  </Box>

                  {/* <Box fontSize={"14px"}>
                <Text fontWeight={700} mb={2}>
                  活動登記
                </Text>
                <Flex direction={"row"} justifyContent="space-between" mb={2}>
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
              </Box> */}

                  {/* <Flex gap={2} direction={"column"} mt={10} pb={6}>
                <Button borderRadius="20px" w={"100%"}>
                  登記
                </Button>
                <Button borderRadius="20px" w={"100%"}>
                  網上登記
                </Button>
                <Button borderRadius="20px" w={"100%"}>
                  聯絡活動籌辦人
                </Button>
              </Flex> */}
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default withPageCMS(Event, {
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

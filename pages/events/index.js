import React, { useCallback, useState } from "react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Divider,
  Image,
  VStack,
  Grid,
  GridItem,
  Tag,
  Box,
  Text,
  Link,
  Button,
  Stack,
  Input,
  Flex,
  InputGroup,
  InputLeftElement,
  Select
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import moment from "moment";
import { ArrowBackIcon } from "@chakra-ui/icons";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";

import { SearchIcon, TimeIcon } from "@chakra-ui/icons";
import { IoLocationSharp } from "react-icons/io5";
import { RiFilter2Fill } from "react-icons/ri";
import EVENTS from "../../utils/mock/api_event_list.json";

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
  const EVENTS_LIST = EVENTS?.data;

  const generateUrlParameter = useCallback(
    ({ identityId, organizationId }) => {
      let query = "";
      if (identityId ?? router.query.identityId) {
        query += `identityId=${identityId ?? router.query.identityId}&`;
      }
      if (organizationId ?? router.query.organizationId) {
        query += `organizationId=${
          organizationId ?? router.query.organizationId
        }&`;
      }
      return `/talants/individuals?${query}`;
    },
    [router]
  );

  return (
    <>
      <VStack spacing={0} align="stretch" w="100%">
        <Box
          d={!router.query.jobId ? "block" : ["none", "none", "block"]}
          bgColor="#F6D644"
          position="relative"
        >
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Box pb={48} pt={[36, 36, 36, 48]}>
              <Text fontSize="5xl" fontWeight="bold" pb={4}>
                {wordExtractor(page?.content?.wordings, "page_title")}
              </Text>
              <Flex direction={["column", "column", "row"]} maxWidth={"xl"} align="center" gap={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" left={2}>
                    <SearchIcon color="gray.500" />
                  </InputLeftElement>
                  <Input
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "page_search"
                    )}
                    bgColor={"#FFF"}
                    borderRadius={"20px"}
                    border={"none"}
                    px={10}
                  />
                </InputGroup>
                <Flex w={{md: '140px'}} gap={1}>
                    <RiFilter2Fill fontSize={18} pt={2}/>
                    <Text textDecoration={"underline"} fontSize={'14px'}>進階篩選</Text>
                </Flex>
              </Flex>
            </Box>
            <Image
              alt=""
              position="absolute"
              bottom={2}
              right={2}
              w={["300px", "300px", "400px", "400px", "400px"]}
              src={page?.content?.banner?.bgImageRight}
            />
          </Container>
        </Box>

        <Box d={["none", "none", "block"]} bg="#fafafa" py={16}>
          <Container>
            <Flex direction={{ base: "column", md: "row" }} pb={8} gap={{md: 12}}>
              <Box w={{base: '100%', md: '180px'}}>
              <Select
                value={router.query.organizationId ?? ""}
                onChange={(e) =>
                  router.push(
                    generateUrlParameter({
                      identityId: "",
                      organizationId: e.target.value,
                    })
                  )
                }
                variant="flushed"
                _placeholder={{color: "gray.200"}}
              >
                <option key="" value="">
                  {wordExtractor(page?.content?.wordings, "designated_day")}
                </option>
                {/* {(organizations ?? []).map(({ id, chineseCompanyName }) => (
                  <option key={id} value={id}>
                    {chineseCompanyName}
                  </option>
                ))} */}
              </Select>
              </Box>
              <Box flex={1}>
                <FilterSection page={page} />
              </Box>
            </Flex>
            <Flex direction={{ base: "column", md: "row" }} gap={{md: 12}}>
              <Box w={{base: '100%', md: '180px'}} fontSize={{base: 24, md: 36}}><Text as="span" fontWeight={700}>JAN</Text> <Text as="span">2022</Text></Box>
              <Box flex={1}>
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                  }}
                  gap={6}
                >
                  {(EVENTS_LIST?.list || []).map((d) => (
                    <GridItem
                      key={d.id}
                      flex={1}
                      bgColor={"#FFF"}
                      borderRadius={"10px"}
                      overflow={"hidden"}
                      boxShadow="xl"
                    >
                      <Box
                        bgImage={`url(${d?.banner?.url})`}
                        h={{ base: "170px" }}
                        w={"100%"}
                        bgSize="cover"
                        bgPosition={"center center"}
                      />
                      <Box p={"16px"} fontSize={'14px'}>
                        <Stack>
                          <Text fontSize={"xl"} fontWeight="bold">
                            {d.name}
                          </Text>
                          <Flex align="center" gap={2}>
                            <Box w={'20px'}>
                              <TimeIcon color="gray.500" fontSize={18} />
                            </Box>
                            <Box>
                              <b>{d.startDate}</b>- {d.startTime} - {d.endTime}
                            </Box>
                          </Flex>
                          <Flex align="center" gap={2}>
                            <Box w={'20px'}>
                              <IoLocationSharp color="gray.500" fontSize={18} />
                            </Box>
                            <Box>
                              <b>{d.location}</b>
                            </Box>
                          </Flex>
                          <Text fontSize={"sm"} fontWeight={400} color="gray.400">{`由 ${d.organizationName} 主辦`}</Text>
                        </Stack>
                        <Divider mt={6} my={4}/>
                        <Flex justifyContent="space-between" align="center" pb={4} fontSize={'14px'}>
                          <Box>
                            <Button
                              backgroundColor="#F6D644"
                              borderRadius="22px"
                            >
                              我想參加
                            </Button>
                          </Box>
                          <Box>
                            {d.liked
                              ? `你及其他${d.bookmarkCount}人關注中`
                              : `${d.bookmarkCount}關注中`}
                          </Box>
                        </Flex>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </Flex>
          </Container>
        </Box>
      </VStack>
    </>
  );
};

const FilterSection = ({ page }) => {
  const [selected, setSelected] = useState("latest");
  const selectedStyles = {
    border: "none",
    color: "#FFF",
    bgColor: "#1E1E1E",
  };
  const stylesProps = {
    boxShadow: "0px 0px 0px 1px #1E1E1E inset",
    color: "#1E1E1E",
  };
  return (
    <Stack direction={{ base: "row" }} spacing={4}>
      {page?.content?.form?.filter?.options.map((d) => {
        const renderStyle = d.value === selected ? selectedStyles : stylesProps;
        return (
          <Box
            {...renderStyle}
            borderRadius={"50px"}
            px={"16px"}
            py={"8px"}
            cursor="pointer"
            key={d.label}
            onClick={() => setSelected(d.value)}
          >
            {d.label}
          </Box>
        );
      })}
    </Stack>
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

import React, { useState, useEffect, useRef } from "react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import {
  Divider,
  Image,
  VStack,
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Stack,
  Input,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormHelperText,
  CheckboxGroup,
  Checkbox,
  SimpleGrid,
} from "@chakra-ui/react";
import moment from "moment";
import _ from "lodash";
import { useForm, Controller } from "react-hook-form";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { SearchIcon } from "@chakra-ui/icons";
import { RiFilter2Fill } from "react-icons/ri";
import { getEvents, getStockPhoto } from "../../utils/event/getEvent";

const PAGE_KEY = "event";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const { req } = context;
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      hostname: req?.headers?.host,
      lang: context.locale,
      api: {
        stockPhotos: await getStockPhoto(),
      },
    },
  };
};

const Event = ({ page, hostname, lang, api: {stockPhotos} }) => {
  const router = useRouter();
  const { query } = router;
  const [filteredEvents, setFiltered] = useState([]);
  const [keyword, setKeyword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const designatedDayRef = useRef();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const { asPath } = router;

    let getURLParameter = asPath.replace("/event", "");

    if (!getURLParameter) {
      getURLParameter = "?orderBy=startDate&orderByAsc=true&ended=false";
    }

    async function fetchData() {
      const data = (await getEvents(getURLParameter)) ?? [];
      const getData = await getDateArr(data.list);
      setFiltered(getData);
    }
    fetchData();
  }, [router]);

  const onFormSubmit = async ({ searchText, fromDate, toDate, type }) => {
    const submitData = {
      searchText,
      fromDate,
      toDate,
      type: !_.isEmpty(type) ? JSON.stringify(type) : null,
    };
    router.replace({
      query: _.omitBy(
        submitData,
        (v) => _.isUndefined(v) || _.isNull(v) || v === ""
      ),
    });
    setTimeout(() => {
      onClose();
    }, 500);
  };

  function getDateArr(arr) {
    const { query } = router;
    if (_.isEmpty(arr)) {
      return;
    }
    let new_arr = [];
    let sorted;

    for (let i = 0, len = arr.length; i < len; i++) {
      let Month_index = arr[i].startDate.lastIndexOf("-");
      let startDate = arr[i].startDate.substr(0, Month_index);
      if (!new_arr[startDate]) {
        new_arr[startDate] = [];
        new_arr[startDate].push(arr[i]);
      } else {
        new_arr[startDate].push(arr[i]);
      }
    }

    if (query?.orderBy === "bookmarkCount") {
      sorted = new_arr;
    } else {
      sorted = Object.keys(new_arr)
        .sort((a, b) => moment(b) - moment(a))
        .reduce((accumulator, key) => {
          accumulator[key] = new_arr[key];

          return accumulator;
        }, []);
    }

    return sorted ?? [];
  }

  const renderEventTime = (startTime, endTime) => {
    const isStartTimeValid = moment(startTime, "HH:mm", true).isValid();
    const isEndTimeValid = moment(endTime, "HH:mm", true).isValid();

    if (!isStartTimeValid && !isEndTimeValid) {
      return lang == "zh" ? "全日" : "full day";
    } else if (isStartTimeValid && !isEndTimeValid) {
      return `${startTime}`;
    } else if (!isStartTimeValid && isEndTimeValid) {
      return `${endTime}`;
    } else {
      return `${startTime} - ${endTime}`;
    }
  };

  return (
    <>
      <VStack spacing={0} align="stretch" w="100%">
      <NextSeo
        title={
          router.locale === "zh"
            ? `賽馬會共融．知行計劃｜最新活動`
            : `Jockey Club Collaborative Project for Inclusive Employment｜Events`
        }
      />
        <Box bgColor="#F6D644" position="relative">
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Box pb={48} pt={[36, 36, 36, 48]}>
              <Text as="h2" fontSize="5xl" fontWeight="bold" pb={4}>
                {wordExtractor(page?.content?.wordings, "page_title")}
              </Text>
              <Flex
                direction={["column", "column", "row"]}
                maxWidth={"xl"}
                align="center"
                gap={4}
              >
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    left={"4px"}
                    top={"3px"}
                    cursor="pointer"
                  >
                    <SearchIcon color="gray.500" />
                  </InputLeftElement>
                  <Input
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "page_search"
                    )}
                    _placeholder={{ color: "gray.700" }}
                    bgColor={"#FFF"}
                    borderRadius={"25px"}
                    border={"none"}
                    px={4}
                    minHeight={"45px"}
                    onChange={(e) => setKeyword(e.target.value)}
                    defaultValue={query.searchText}
                    aria-label={lang == "zh" ? "文字搜尋" : "keyword search"}
                  />
                  <InputRightElement width="4.5rem" mt={"2px"} mr={2}>
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() =>
                        router.replace({
                          query: { ...router.query, searchText: keyword },
                        })
                      }
                      aria-label={lang == "zh" ? "搜尋" : "Search"}
                    >
                      {wordExtractor(page?.content?.wordings, "search_label")}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Flex
                  w={{ md: "140px" }}
                  gap={1}
                  onClick={() => onOpen()}
                  cursor="pointer"
                  as={Button}
                  variant="ghost"
                  style={{
                    minWidth: "auto",
                    padding: 0,
                  }}
                  _hover={{
                    backgroundColor: "transparent",
                  }}
                >
                  <RiFilter2Fill fontSize={18} pt={2} />
                  <Text textDecoration={"underline"} fontSize={"14px"}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "advanced_search_label"
                    )}
                  </Text>
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

        <Box bg="#fafafa" py={16}>
          <Container>
            <Flex
              direction={{ base: "column", md: "row" }}
              pb={8}
              gap={{ md: 12 }}
            >
              <Box w={{ base: "100%", md: "180px" }}>
                <Input
                  type="text"
                  variant="flushed"
                  placeholder={wordExtractor(
                    page?.content?.wordings,
                    "designated_day_placeholder"
                  )}
                  _placeholder={{ color: "gray.700" }}
                  onFocus={() => (designatedDayRef.current.type = "date")}
                  onBlur={(e) => {
                    designatedDayRef.current.type = "text";
                    if (e.target.value) {
                      router.replace({
                        query: { formDate: e.target.value },
                      });
                    }
                  }}
                  ref={designatedDayRef}
                  aria-label={lang == "zh" ? "指定日子" : "Designated day"}
                />
              </Box>
              <Box flex={1}>
                <FilterSection page={page} tabIndex={2} />
              </Box>
            </Flex>
            {filteredEvents &&
              Object.keys(filteredEvents).map((detail) => (
                <Box key={detail}>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={{ md: 12 }}
                  >
                    <Box
                      w={{ base: "100%", md: "180px" }}
                      fontSize={{ base: 24, md: 36 }}
                      pb={{ base: 4, md: 0 }}
                    >
                      <Text as="span" fontWeight={700} whiteSpace="nowrap">
                        {moment(detail).format("MMMM")}
                      </Text>{" "}
                      <Text as="span">{moment(detail).format("YYYY")}</Text>
                    </Box>
                    <Box flex={1}>
                      <Grid
                        templateColumns={{
                          base: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                        }}
                        gap={6}
                      >
                        {(filteredEvents[detail] || []).map((d, i) => {
                          const url = d?.banner?.file?.url
                          const stockPhotoId = d?.banner?.stockPhotoId

                          let imageUrl = "";
                          if (url !== "undefined" && !_.isEmpty(url)) {
                            imageUrl = url;
                          } else {
                            const getStockPhoto = stockPhotos?.find((d)=>d?.id == stockPhotoId)
                            imageUrl = getStockPhoto?.url
                          }
                          return (
                            <GridItem
                              key={`${d.id}${i}`}
                              flex={1}
                              bgColor={"#FFF"}
                              borderRadius={"10px"}
                              overflow={"hidden"}
                              boxShadow="xl"
                            >
                              <Box
                                bgImage={`url(${imageUrl})`}
                                h={{ base: "170px" }}
                                w={"100%"}
                                bgSize="cover"
                                bgPosition={"center center"}
                              />
                              <Box p={"16px"} fontSize={"14px"}>
                                <Stack>
                                  <Text fontSize={"xl"} fontWeight="bold">
                                    {d.name}
                                  </Text>
                                  <Flex align="center" gap={2}>
                                    <Box w={"20px"}>
                                      <Image
                                        src={`/images/app/time.svg`}
                                        alt={""}
                                        color="gray.500"
                                        fontSize={18}
                                      />
                                    </Box>
                                    <Box>
                                      <b>{d.startDate}</b> -{" "}
                                      {renderEventTime(d?.startTime, d?.endTime)}
                                    </Box>
                                  </Flex>
                                  <Flex align="center" gap={2}>
                                    <Box w={"20px"}>
                                      <Image
                                        src={`/images/app/location-pin.svg`}
                                        alt={""}
                                        color="gray.500"
                                        fontSize={18}
                                        mx={"auto"}
                                      />
                                    </Box>
                                    <Box>{d.venue}</Box>
                                  </Flex>
                                </Stack>
                                <Divider mt={6} my={4} />
                                <Flex
                                  justifyContent="space-between"
                                  align="center"
                                  pb={4}
                                >
                                  <Box>
                                    <Button
                                      backgroundColor="#F6D644"
                                      borderRadius="22px"
                                      onClick={() =>
                                        router.push(`/event/${d.id}`)
                                      }
                                    >
                                      {wordExtractor(
                                        page?.content?.wordings,
                                        "join_label"
                                      )}{" "}
                                    </Button>
                                  </Box>

                                  <Flex
                                    direction={"row"}
                                    align="center"
                                    gap={2}
                                  >
                                    <Box>
                                      {d.bookmarked
                                        ? wordExtractor(
                                            page?.content?.wordings,
                                            "bookmarked_label"
                                          ).replace("$", d.bookmarkCount)
                                        : wordExtractor(
                                            page?.content?.wordings,
                                            "bookmarked_count_label"
                                          ).replace("$", d.bookmarkCount)}
                                    </Box>
                                  </Flex>
                                </Flex>
                              </Box>
                            </GridItem>
                          );
                        })}
                      </Grid>
                    </Box>
                  </Flex>
                  <Divider my={6} />
                </Box>
              ))}
          </Container>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} autoFocus={true} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <VStack
                py={"15px"}
                as="form"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"20px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "form_generic_search"
                        )}
                      </FormLabel>
                      <Input
                        type="text"
                        variant="flushed"
                        {...register("searchText")}
                        borderColor={"1px solid gray.500"}
                      />
                      <FormHelperText>
                        {errors?.name?.type === "required" && (
                          <Text color="red">
                            {wordExtractor(
                              page?.content?.wordings,
                              "input_required"
                            )}
                          </Text>
                        )}
                      </FormHelperText>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "form_filter_form_date"
                        )}
                      </FormLabel>
                      <Input
                        type="date"
                        variant="flushed"
                        placeholder=""
                        {...register("fromDate")}
                        borderColor={"1px solid gray.500"}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "form_filter_to_date"
                        )}
                      </FormLabel>
                      <Input
                        type="date"
                        variant="flushed"
                        placeholder=""
                        {...register("toDate")}
                        borderColor={"1px solid gray.500"}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel>
                        {wordExtractor(
                          page?.content?.wordings,
                          "form_filter_type"
                        )}
                      </FormLabel>

                      <Controller
                        name="type"
                        isClearable
                        control={control}
                        render={({ field }) => (
                          <CheckboxGroup colorScheme="yellow" {...field}>
                            <SimpleGrid columns={3} spacing={10}>
                              {page?.content?.form?.type?.options.map(
                                ({ label, value }) => {
                                  return (
                                    <Checkbox
                                      colorScheme="green"
                                      key={label}
                                      value={value}
                                      borderColor={"gray.500"}
                                    >
                                      {label}
                                    </Checkbox>
                                  );
                                }
                              )}
                            </SimpleGrid>
                          </CheckboxGroup>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                {wordExtractor(page?.content?.wordings, "cancel_label")}
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSubmit(onFormSubmit)}
              >
                {wordExtractor(page?.content?.wordings, "submit_label")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </>
  );
};

const FilterSection = ({ page }) => {
  const router = useRouter();
  const { query } = router;
  const [selected, setSelected] = useState("");
  const selectedStyles = {
    border: "none",
    color: "#FFF",
    bgColor: "#1E1E1E",
    _hover: {
      backgroundColor: "#000",
    },
    _active: {
      backgroundColor: "#000",
    },
  };
  const stylesProps = {
    boxShadow: "0px 0px 0px 1px #1E1E1E inset",
    color: "#1E1E1E",
  };

  useEffect(() => {
    switch (query?.orderBy) {
      case "bookmarkCount":
        setSelected("hot");
        break;

      case "endDate":
        setSelected("outdated");
        break;

      default:
        setSelected("latest");
        break;
    }
  }, [query]);

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={4}
      pt={{ base: 4, md: 0 }}
    >
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
            textAlign="center"
            as={Button}
            variant="ghost"
            onClick={() => {
              const filterObj = {
                latest: {
                  orderBy: "createdAt",
                  orderByAsc: false,
                  ended: false,
                },
                hot: {
                  orderBy: "bookmarkCount",
                  orderByAsc: false,
                  ended: false,
                },
                outdated: {
                  orderBy: "endDate",
                  orderByAsc: false,
                  ended: true,
                },
              };

              router.replace({
                query: filterObj[d.value],
              });
              setSelected(d.value);
            }}
            tabIndex={0}
            aria-selected={d.value === selected ? "true" : "false"}
            role="tab"
          >
            {d.label}
          </Box>
        );
      })}
    </Stack>
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
        {
          name: "type",
          label: "活動類別 Type Label",
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

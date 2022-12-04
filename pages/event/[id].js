import React, { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
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
  Button,
  Stack,
  Flex,
  Image,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import moment from "moment";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { HiDownload } from "react-icons/hi";
import { AiOutlineLink } from "react-icons/ai";
import { getEventDetail } from "../../utils/event/getEvent";
import { bookmarkEvent } from "../../utils/event/eventAction";
import organizationGet from "../../utils/api/OrganizationGet";
import { AiOutlineFilePdf, AiOutlinePlayCircle } from "react-icons/ai";

import eventTypes from "../api/graphql/enum/eventTypes";
import charge from "../api/graphql/enum/freeOrCharge";

const PAGE_KEY = "event";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const event = (await getEventDetail(context?.query?.id, true)) ?? {};

  const { req } = context;
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      hostname: req?.headers?.host,
      event,
      lang: context.locale,
    },
  };
};

const Event = ({ page, hostname, lang, event }) => {
  const router = useRouter();
  const [detail, setDetail] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    const { query } = router;
    async function fetchData() {
      const data = (await getEventDetail(query?.id)) ?? {};
      setDetail(data);
    }
    fetchData();

    if (bookmarkActive) {
      fetchData();
    }
  }, [bookmarkActive]);

  useEffect(() => {
    async function fetchOrganization() {
      const organization = await organizationGet({
        id: detail?.organizationId,
      });
      setOrganization(organization);
    }
    if (detail?.organizationId) {
      fetchOrganization();
    }
  }, [detail]);

  const RegistrationRow = ({ title, value }) => {
    return (
      <Flex
        direction="row"
        gap={2}
        justifyContent="space-between"
        fontSize="14px"
      >
        <Box minW={"100px"}>
          <Text>{title}</Text>
        </Box>
        <Text fontWeight={700}>{value}</Text>
      </Flex>
    );
  };

  const RenderAdditionalContent = ({ data }) => {
    if (!data) {
      return <></>;
    }

    switch (data?.contentType) {
      case "application/pdf":
        return (
          <GridItem flex={1} bgColor={"#FFF"} overflow={"hidden"}>
            <Box
              bgColor="#F2F2F2"
              h={"110px"}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              position={"relative"}
            >
              <a href={data.url} target="_blank" rel="noreferrer">
                <Center h={"100%"}>
                  <AiOutlineFilePdf style={{ width: "30px", height: "30px" }} />
                </Center>
              </a>
            </Box>
          </GridItem>
        );

      case "video/mp4":
        return (
          <GridItem flex={1} bgColor={"#FFF"} overflow={"hidden"}>
            <Box
              bgColor="#F2F2F2"
              h={"110px"}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              position={"relative"}
            >
              <a href={data.url} target="_blank" rel="noreferrer">
                <Center h={"100%"}>
                  <AiOutlinePlayCircle
                    style={{ width: "30px", height: "30px" }}
                  />
                </Center>
              </a>
            </Box>
          </GridItem>
        );

      default:
        return (
          <GridItem
            flex={1}
            bgColor={"#FFF"}
            overflow={"hidden"}
            cursor="pointer"
            onClick={() => {
              if (data.url) {
                onOpen();
                setPopupImage(data.url);
              }
            }}
          >
            <Box
              bgImage={`url(${data?.url})`}
              h={"110px"}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              position={"relative"}
            />
          </GridItem>
        );
    }
  };

  const handleBookmark = async (id) => {
    const result = await bookmarkEvent(id);
    if (result) {
      setBookmarkActive(true);
    }
  };

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
              ? `賽馬會共融．知行計劃｜最新活動｜${event?.name}`
              : `Jockey Club Collaborative Project for Inclusive Employment｜Events｜${event?.name}`
          }
        />
        <Box bgColor="#F6D644" position="relative">
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Box minHeight={{ base: "240px", md: "480px" }} />
          </Container>
        </Box>

        <Box bg="#fafafa" pb={12}>
          <Container
            position={"relative"}
            mt={{ base: "-140px", md: "-280px" }}
            pb={8}
          >
            <Flex direction={{ base: "column", md: "row" }} gap={{ base: 6 }}>
              <Box flex={1}>
                <BannerSection
                  hostname={hostname}
                  name={detail?.name}
                  tags={detail?.tags}
                  url={`${detail?.banner?.file?.url}`}
                  stockPhotoId={`${detail?.banner?.stockPhotoId}`}
                />
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
                      <Stack spacing={4} direction="column">
                        <Flex align="center" gap={2}>
                          <Box w={"20px"}>
                            <Image
                              src={"/images/app/calendar.svg"}
                              alt={""}
                              color="gray.500"
                              fontSize={18}
                              minW={"18px"}
                            />
                          </Box>
                          <Box>
                            <b>
                              {wordExtractor(
                                page?.content?.wordings,
                                "from_label"
                              )}{" "}
                              {moment(detail?.startDate).format("YYYY-MM-DD")}{" "}
                              {wordExtractor(
                                page?.content?.wordings,
                                "to_label"
                              )}{" "}
                              {moment(detail?.endDate).format("YYYY-MM-DD")}{" "}
                            </b>
                          </Box>
                        </Flex>

                        <Flex align="center" gap={2}>
                          <Box w={"20px"}>
                            <Image
                              src={"/images/app/time.svg"}
                              alt={""}
                              color="gray.500"
                              fontSize={18}
                              minW={"18px"}
                            />
                          </Box>
                          <Box>
                            <b>
                              {renderEventTime(
                                detail?.startTime,
                                detail?.endTime
                              )}

                              {detail?.datetimeRemark &&
                                `(${detail?.datetimeRemark})`}
                            </b>
                          </Box>
                        </Flex>

                        <Flex align="center" gap={2}>
                          <Box w={"20px"} textAlign="center">
                            <Image
                              src={"/images/app/location-pin.svg"}
                              alt={""}
                              color="gray.500"
                              fontSize={18}
                              minW={"12px"}
                              mx={"auto"}
                            />
                          </Box>
                          <Box>
                            <b>{detail?.venue}</b>
                          </Box>
                        </Flex>

                        {organization && (
                          <Flex align="center" gap={2}>
                            <Box>
                              {wordExtractor(
                                page?.content?.wordings,
                                "organize_by_label"
                              )}
                              <b>
                                {" "}
                                {lang === "zh"
                                  ? organization?.chineseCompanyName
                                  : organization?.englishCompanyName ??
                                    organization?.chineseCompanyName}
                              </b>{" "}
                              {wordExtractor(
                                page?.content?.wordings,
                                "hold_label"
                              )}
                            </Box>
                          </Flex>
                        )}
                      </Stack>
                      <Divider my={4} />
                      <Flex gap={4} direction="column">
                        <Flex gap={4} direction="column">
                          <Flex align="center" gap={2}>
                            <Box w={"20px"}>
                              <Image
                                src={"/images/app/gov.svg"}
                                alt={""}
                                color="gray.500"
                                fontSize={18}
                                mx={"auto"}
                              />
                            </Box>
                            <Box fontWeight={700}>
                              {wordExtractor(
                                page?.content?.wordings,
                                "about_label"
                              )}
                            </Box>
                          </Flex>
                          <Box>
                            <Flex direction={"row"} gap={2}>
                              <Text>
                                {wordExtractor(
                                  page?.content?.wordings,
                                  "event_type_label"
                                )}
                              </Text>
                              <Text fontWeight={700}>
                                {detail?.type
                                  ? detail?.typeOther ??
                                    eventTypes?.[detail?.type][page?.lang]
                                  : ""}
                              </Text>
                            </Flex>
                          </Box>
                        </Flex>

                        <Flex gap={4} direction="column">
                          <Text as="p" style={{ whiteSpace: "pre-line" }}>
                            {detail?.description}
                          </Text>
                        </Flex>

                        <Flex color="#0D8282" align="center" fontWeight={700}>
                          <Box>
                            <HiDownload />
                          </Box>
                          <Text>
                            {wordExtractor(
                              page?.content?.wordings,
                              "download_more_information"
                            )}
                          </Text>
                        </Flex>

                        {detail?.otherUrls?.map((d) => (
                          <Flex
                            key={d}
                            color="#0D8282"
                            align="center"
                            fontWeight={700}
                            alignItems="baseline"
                          >
                            <Box>
                              <AiOutlineLink />
                            </Box>
                            <a
                              href={d}
                              target="_blank"
                              rel="noreferrer"
                              style={{ wordBreak: "break-all" }}
                            >
                              {d}
                            </a>
                          </Flex>
                        ))}
                      </Flex>
                      <Divider my={4} />
                      <Flex gap={4} direction="column">
                        <Box>
                          {wordExtractor(
                            page?.content?.wordings,
                            "remark_label"
                          )}
                        </Box>
                        <Text as="p" style={{ whiteSpace: "pre-line" }}>
                          {detail?.remark}
                        </Text>
                      </Flex>
                      <Divider my={4} />

                      <Flex gap={4} direction="column">
                        <Flex align="center" gap={2}>
                          <Box w={"20px"}>
                            <Image
                              src={"/images/app/pic.svg"}
                              alt={""}
                              fontSize={18}
                              mx={"auto"}
                            />
                          </Box>
                          <Box fontWeight={700}>
                            {wordExtractor(
                              page?.content?.wordings,
                              "information_label"
                            )}
                          </Box>
                        </Flex>

                        <Grid
                          templateColumns={{
                            base: "repeat(3, 1fr)",
                          }}
                          gap={2}
                        >
                          {detail?.additionalInformation?.map((d) => (
                            <RenderAdditionalContent key={d?.id} data={d} />
                          ))}
                        </Grid>
                      </Flex>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
              <Box w={{ base: "100%", md: "310px" }}>
                <Box bgColor={"#FFF"} borderRadius={"15px"} py={6} px={4}>
                  <Box>
                    <Text fontWeight={700} mb={2}>
                      {wordExtractor(
                        page?.content?.wordings,
                        "about_event_label"
                      )}
                    </Text>
                    <Text
                      as="p"
                      fontSize={"14px"}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {detail?.description}
                    </Text>
                  </Box>
                  <Divider my={6} />
                  <Stack
                    direction={"column"}
                    spacing={2}
                    py={4}
                    fontSize="14px"
                  >
                    <Text fontWeight={700} mb={2}>
                      {wordExtractor(
                        page?.content?.wordings,
                        "event_registration_label"
                      )}
                    </Text>
                    <Flex
                      direction="row"
                      gap={2}
                      justifyContent="space-between"
                      fontSize="14px"
                    >
                      <Box minW={"100px"}>
                        <Text>
                          {wordExtractor(
                            page?.content?.wordings,
                            "quota_label"
                          )}
                        </Text>
                      </Box>
                      <Text fontWeight={700}>
                        {detail?.quota === 0
                          ? wordExtractor(
                              page?.content?.wordings,
                              "quota_unlimited"
                            )
                          : detail?.quota}
                      </Text>
                    </Flex>

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "free_or_charge_label"
                      )}
                      value={
                        detail?.freeOrCharge
                          ? charge?.[detail?.freeOrCharge][page?.lang]
                          : ""
                      }
                    />

                    {detail?.freeOrCharge !== "free" && (
                      <RegistrationRow
                        title={wordExtractor(
                          page?.content?.wordings,
                          "price_label"
                        )}
                        value={detail?.price}
                      />
                    )}

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "submission_deadline_label"
                      )}
                      value={
                        moment(detail?.submissionDeadline).format(
                          "YYYY-MM-DD"
                        ) ?? ""
                      }
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "event_manager_label"
                      )}
                      value={detail?.eventManager}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "contact_method_label"
                      )}
                      value={detail?.contactNumber}
                    />
                    <Stack
                      direction="row"
                      spacing={1}
                      mt={4}
                      cursor="pointer"
                      onClick={() => handleBookmark(detail?.id)}
                    >
                      <Text mt={6} color="#0D8282" fontWeight={700}>
                        {detail?.liked
                          ? wordExtractor(
                              page?.content?.wordings,
                              "you_and_other_liked"
                            ).replace("$", detail?.bookmarkCount || 0)
                          : wordExtractor(
                              page?.content?.wordings,
                              "other_liked"
                            ).replace("$", detail?.bookmarkCount || 0)}
                      </Text>
                    </Stack>
                  </Stack>

                  <Flex gap={2} direction={"column"} mt={10}>
                    {detail?.registerUrl && (
                      <a
                        href={`${detail?.registerUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          borderRadius="20px"
                          w={"100%"}
                          variant="outline"
                          borderColor={"gray.200"}
                          _hover={{
                            borderColor: "#F6D644",
                            bgColor: "#F6D644",
                          }}
                        >
                          {wordExtractor(
                            page?.content?.wordings,
                            "online_registration_label"
                          )}
                        </Button>
                      </a>
                    )}

                    {!isNaN(detail?.contactNumber) && (
                      <a href={`tel:${detail?.contactNumber}`}>
                        <Button
                          borderRadius="20px"
                          w={"100%"}
                          variant="outline"
                          borderColor={"gray.200"}
                          _hover={{
                            borderColor: "#F6D644",
                            bgColor: "#F6D644",
                          }}
                        >
                          {wordExtractor(
                            page?.content?.wordings,
                            "contact_event_manager_label"
                          )}
                        </Button>
                      </a>
                    )}
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Container>
        </Box>
      </VStack>
      <InformationModal
        onClose={onClose}
        isOpen={isOpen}
        popupSrc={popupImage}
      />
    </>
  );
};

const BannerSection = ({ tags, url, name, stockPhotoId, hostname }) => {
  const imageUrl =
    url !== "undefined" && url !== null
      ? url
      : `https://${hostname}/api/app/static/file/stockPhotos/${stockPhotoId}.png`;
  return (
    <Box
      bgImage={`url(${imageUrl})`}
      h={{ base: "360px" }}
      w={"100%"}
      bgSize={{ base: "cover" }}
      bgPosition={"center center"}
      position={"relative"}
      borderRadius={"15px"}
      mb={"15px"}
      overflow={"hidden"}
    >
      <Box position={"absolute"} bottom={"30px"} left={"15px"} zIndex={2}>
        <Container>
          {tags?.map((d) => (
            <Box
              key={d}
              bgColor="#FFF"
              color="#0D8282"
              px={2}
              py={1}
              mb={2}
              minW={"40px"}
              textAlign="center"
              borderRadius={"50px"}
              fontSize={"12px"}
              d={"inline-block"}
              fontWeight={700}
              mr={2}
            >
              {d}
            </Box>
          ))}
          <Text fontSize={"24px"} fontWeight={700} color="#FFF">
            {name}
          </Text>
        </Container>
      </Box>
      <Box
        style={{
          background:
            "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
          marginTop: "60px",
        }}
        h={"50%"}
        w={"100%"}
        opacity={1}
        position={"absolute"}
        zIndex={1}
        bottom={0}
      />
    </Box>
  );
};

const InformationModal = ({ onClose, size = "full", isOpen, popupSrc }) => {
  return (
    <Modal
      blockScrollOnMount={true}
      onClose={onClose}
      size={size}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay
        bgColor="rgba(51, 51, 51, 0.9)"
        backdropFilter={"blur(20px)"}
      />
      <ModalContent bgColor="transparent" boxShadow={"none"}>
        <ModalCloseButton color="white" />
        <ModalBody p={0}>
          <Flex h={"100vh"} direction="column" pb={"40px"}>
            <Box h={"60px"}></Box>
            <Box flex={1}>
              <Center h={"100%"}>
                <Box>
                  <Image src={popupSrc} width="100%" />
                </Box>
              </Center>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
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

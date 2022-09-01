import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Divider,
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Center,
} from "@chakra-ui/react";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import wordExtractor from "../../../utils/wordExtractor";
import Container from "../../../components/Container";
import moment from "moment";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import { useAppContext } from "../../../store/AppStore";
import { CloseIcon } from "@chakra-ui/icons";
import { getEventDetail } from "../../../utils/event/getEvent";
import { HiDownload } from "react-icons/hi";
import { getYoutubeLink } from "../../../utils/general";
import organizationSearch from "../../../utils/api/OrganizationSearch";
import { AiOutlineFilePdf, AiOutlinePlayCircle } from "react-icons/ai";
import {
  bookmarkEvent,
  unBookmarkEvent,
} from "../../../utils/event/eventAction";

import eventTypes from "../../api/graphql/enum/eventTypes";
import charge from "../../api/graphql/enum/freeOrCharge";

const PAGE_KEY = "event";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const { req } = context;
  return {
    props: {
      page,
      isApp: true,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      hostname: req?.headers?.host,
      api: {
        organizations: await organizationSearch({
          status: ["approved"],
          published: true,
        }),
        eventDetail: await getEventDetail(context?.query?.id),
      },
      lang: context.locale,
    },
  };
};

const Event = ({
  page,
  hostname,
  api: { organizations, eventDetail },
  lang,
}) => {
  const router = useRouter();
  const [detail, setDetail] = useState([]);
  const [bookmarked, setBookmarked] = useState(detail?.bookmarked);
  const [organizeBy, setOrganizeBy] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRegistrationModal,
    onOpen: onOpenRegistrationModal,
    onClose: onCloseRegistrationModal,
  } = useDisclosure();

  const {
    isOpen: isOpenVideoModal,
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
  } = useDisclosure();

  const [popupImage, setPopupImage] = useState(null);
  const [popupVideo, setPopupVideo] = useState(null);

  const { identityId: currentIdentityId } = useAppContext();

  const fetchEventSingle = async () => {
    const { query } = router;
    const data = (await getEventDetail(query?.id)) ?? {};
    setDetail(data);
  };

  useEffect(() => {
    fetchEventSingle();
  }, [router]);

  useEffect(() => {
    setBookmarked(detail?.bookmarked);
  }, [detail?.bookmarked]);

  useEffect(() => {
    if (detail?.organizationId) {
      const organization = organizations?.find(
        (d) => d.id === detail?.organizationId
      );
      setOrganizeBy(organization);
    }
  }, [detail?.organizationId, organizations]);

  const handleBookmark = async (id) => {
    const result = await bookmarkEvent(id);
    if (result) {
      fetchEventSingle();
    }
    setBookmarked(true);
  };

  const handleUnBookmark = async (id) => {
    const result = await unBookmarkEvent(id);
    if (result) {
      fetchEventSingle();
    }
    setBookmarked(false);
  };

  const handleOpenWebView = (url) => {
    const json = {
      name: "openWebView",
      options: {
        callback: "openWebViewHandler",
        params: {
          value: url.replace(" ", ""),
          type: "external",
          isRedirect: false,
        },
      },
    };

    window.WebContext = {};
    window.WebContext.openWebViewHandler = (response) => {
      if (!response) {
        alert("response.result null");
      }
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

  const RenderAdditionalContent = ({ data }) => {
    if (!data) {
      return <></>;
    }

    switch (data?.contentType) {
      case "application/pdf":
        return (
          <GridItem
            flex={1}
            bgColor={"#FFF"}
            overflow={"hidden"}
            onClick={() => {
              if (data.url) {
                handleOpenWebView(data.url);
              }
            }}
          >
            <Box
              bgColor="#F2F2F2"
              h={"110px"}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              position={"relative"}
            >
              <Center h={"100%"}>
                <AiOutlineFilePdf style={{ width: "30px", height: "30px" }} />
              </Center>
            </Box>
          </GridItem>
        );

      case "video/mp4":
        return (
          <GridItem
            flex={1}
            bgColor={"#FFF"}
            overflow={"hidden"}
            onClick={() => {
              if (data.url) {
                onOpenVideoModal();
                setPopupVideo(`${data.url}`);
              }
            }}
          >
            <Box
              bgColor="#F2F2F2"
              h={"110px"}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              position={"relative"}
            >
              <Center h={"100%"}>
                <AiOutlinePlayCircle
                  style={{ width: "30px", height: "30px" }}
                />
              </Center>
            </Box>
          </GridItem>
        );

      default:
        return (
          <GridItem
            flex={1}
            bgColor={"#FFF"}
            overflow={"hidden"}
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

  return (
    <Box pt={{ base: "64px" }}>
      <Box bg="#FFF" pb={12}>
        <Flex direction={{ base: "column", md: "row" }}>
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
              >
                <Box p={"16px"} pb={"32px"} fontSize={"14px"}>
                  <Stack>
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
                          {detail?.startDate &&
                            wordExtractor(
                              page?.content?.wordings,
                              "from_label"
                            )}{" "}
                          {detail?.startDate &&
                            moment(detail?.startDate).format("YYYY-MM-DD")}{" "}
                          {detail?.endDate &&
                            wordExtractor(
                              page?.content?.wordings,
                              "to_label"
                            )}{" "}
                          {detail?.endDate &&
                            moment(detail?.endDate).format("YYYY-MM-DD")}{" "}
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
                          {moment(detail?.startTime, "HH:mm", true).isValid()
                            ? moment(detail?.startTime, ["HH.mm"]).format(
                                "hh:mm a"
                              )
                            : ""}{" "}
                          -{" "}
                          {moment(detail?.endTime, "HH:mm", true).isValid()
                            ? moment(detail?.endTime, ["HH.mm"]).format(
                                "hh:mm a"
                              )
                            : ""}{" "}
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
                    {organizeBy && (
                      <Flex align="center" gap={2}>
                        <Box>
                          {wordExtractor(
                            page?.content?.wordings,
                            "organize_by_label"
                          )}
                          <b>
                            {" "}
                            {lang === "zh"
                              ? organizeBy?.chineseCompanyName
                              : organizeBy?.englishCompanyName ??
                                organizeBy?.chineseCompanyName}
                          </b>{" "}
                          {wordExtractor(page?.content?.wordings, "hold_label")}
                        </Box>
                      </Flex>
                    )}

                    <Flex align="center" gap={2}>
                      {currentIdentityId ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          mt={2}
                          cursor="pointer"
                          onClick={() =>
                            bookmarked
                              ? handleUnBookmark(detail?.id)
                              : handleBookmark(detail?.id)
                          }
                        >
                          <Image
                            src={
                              bookmarked
                                ? "/images/app/bookmark-active.svg"
                                : "/images/app/bookmark-off.svg"
                            }
                            alt={""}
                            fontSize={18}
                          />
                          <Text mt={2} color="#0D8282" fontWeight={700}>
                            {bookmarked
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
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          mt={2}
                          cursor="pointer"
                          onClick={() => handleBookmark(detail?.id)}
                        >
                          <Text mt={2} color="#0D8282" fontWeight={700}>
                            {wordExtractor(
                              page?.content?.wordings,
                              "other_liked"
                            ).replace("$", detail?.bookmarkCount || 0)}
                          </Text>
                        </Stack>
                      )}
                    </Flex>
                  </Stack>
                  <Divider my={4} />

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
                        {wordExtractor(page?.content?.wordings, "about_label")}
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

                  <Flex gap={4} direction="column" mb={4}>
                    <Text as="p">{detail?.description}</Text>
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

                  <Flex direction="column">
                    {detail?.otherUrls?.map((d) => (
                      <Flex
                        key={d}
                        color="#0D8282"
                        align="center"
                        fontWeight={700}
                        gap={1}
                        onClick={() => handleOpenWebView(d)}
                        pt={1}
                        alignItems="normal"
                      >
                        <Box w={"20px"} minWidth={"20px"} alignSelf="baseline" pt={"2px"}>
                          <Image
                            src={"/images/app/link.svg"}
                            alt={""}
                            fontSize={18}
                            mx={"auto"}
                            minW={"20px"}
                          />
                        </Box>
                        <Box style={{ wordBreak: "break-all", lineBreak: "anywhere" }}>{d}</Box>
                      </Flex>
                    ))}
                  </Flex>
                  <Divider my={4} />

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
                    py={4}
                  >
                    {detail?.additionalInformation?.map((d) => (
                      <RenderAdditionalContent key={d?.id} data={d} />
                    ))}
                  </Grid>

                  <Divider my={4} />

                  <Flex align="center" gap={2}>
                    <Box w={"20px"}>
                      <Image
                        src={"/images/app/notes.svg"}
                        alt={""}
                        fontSize={18}
                        mx={"auto"}
                      />
                    </Box>
                    <Box fontWeight={700}>
                      {wordExtractor(
                        page?.content?.wordings,
                        "event_registration_label"
                      )}
                    </Box>
                  </Flex>

                  <Stack direction={"column"} spacing={2} py={4}>
                    <Flex direction="row" gap={2}>
                      <Box minW={"100px"} width={"100px"}>
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
                      lang={lang}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "price_label"
                      )}
                      value={detail?.price}
                      lang={lang}
                    />

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
                      lang={lang}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "event_manager_label"
                      )}
                      value={detail?.eventManager}
                      lang={lang}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "contact_number_label"
                      )}
                      value={detail?.contactNumber}
                      lang={lang}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "remark_label"
                      )}
                      value={detail?.remark}
                      lang={lang}
                    />

                    <Flex direction="row" gap={2}>
                      <Box minW={"100px"} width={"100px"}>
                        <Text>
                          {wordExtractor(
                            page?.content?.wordings,
                            "register_url_label"
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <Flex
                          color="#0D8282"
                          align="center"
                          fontWeight={700}
                          gap={2}
                        >
                          <Box w={"20px"} textAlign="center" minWidth={"20px"} alignSelf="baseline" pt={"2px"}>
                            <Image
                              src={"/images/app/link.svg"}
                              alt={""}
                              fontSize={18}
                              mx={"auto"}
                            />
                          </Box>
                          <Box
                            color="#0D8282"
                            onClick={() =>
                              handleOpenWebView(detail?.registerUrl)
                            }
                            style={{ wordBreak: "break-all", lineBreak: "anywhere" }}
                          >
                            {detail?.registerUrl}
                          </Box>
                        </Flex>
                      </Box>
                    </Flex>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    position: "fixed",
                    bottom: "0",
                    width: "100%",
                    backgroundColor: "#FFF",
                  }}
                >
                  <Box
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
                    }}
                    h={"10px"}
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
                        onClick={() => onOpenRegistrationModal()}
                      >
                        {wordExtractor(
                          page?.content?.wordings,
                          "registration_label"
                        )}
                      </Button>
                      {currentIdentityId && (
                        <Box
                          border="1px solid #EFEFEF"
                          borderRadius="50%"
                          p={2}
                          minW={"45px"}
                        >
                          <Center h={"100%"}>
                            <Image
                              src={
                                bookmarked
                                  ? "/images/app/bookmark-active.svg"
                                  : "/images/app/bookmark-off.svg"
                              }
                              alt={""}
                              fontSize={18}
                              mx={"auto"}
                              onClick={() =>
                                bookmarked
                                  ? handleUnBookmark(detail?.id)
                                  : handleBookmark(detail?.id)
                              }
                            />
                          </Center>
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Box>
      <InformationModal
        onClose={onClose}
        isOpen={isOpen}
        popupSrc={popupImage}
      />

      <VideoModal
        onClose={onCloseVideoModal}
        isOpen={isOpenVideoModal}
        popupSrc={popupVideo}
      />

      <RegistrationModal
        onClose={onCloseRegistrationModal}
        isOpen={isOpenRegistrationModal}
        cancelLabel={wordExtractor(page?.content?.wordings, "cancel_label")}
        registrationLabel={wordExtractor(
          page?.content?.wordings,
          "online_registration_label"
        )}
        contactEventManager={wordExtractor(
          page?.content?.wordings,
          "contact_event_manager_label"
        )}
        registerUrl={detail?.registerUrl}
        contactNumber={detail?.contactNumber}
      />
    </Box>
  );
};

const RegistrationModal = ({
  onClose,
  size = "full",
  isOpen,
  cancelLabel,
  registrationLabel,
  contactEventManager,
  registerUrl,
  contactNumber,
}) => {
  const handleOpenWebView = (url) => {
    const json = {
      name: "openWebView",
      options: {
        callback: "openWebViewHandler",
        params: {
          value: url.replace(" ", ""),
          type: "external",
          isRedirect: false,
        },
      },
    };

    window.WebContext = {};
    window.WebContext.openWebViewHandler = (response) => {
      if (!response) {
        alert("response.result null");
      }
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

  return (
    <Modal
      blockScrollOnMount={true}
      onClose={onClose}
      size={size}
      isOpen={isOpen}
      autoFocus={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bgColor="transparent" boxShadow={"none"}>
        <ModalBody p={0}>
          <Flex h={"100vh"} direction="column" pb={"40px"}>
            <Box h={"60px"}></Box>
            <Box flex={1} />
            <Box m={"15px"}>
              <Box bgColor={"#FFF"} borderRadius={"15px"} p={6}>
                <Box onClick={() => handleOpenWebView(registerUrl)}>
                  <Flex direction="row" gap={2} align="center">
                    <Box w={"20px"}>
                      <Image
                        src={"/images/app/notes.svg"}
                        alt={""}
                        fontSize={18}
                        mx={"auto"}
                      />
                    </Box>
                    <Text fontWeight={700}>{registrationLabel}</Text>
                  </Flex>
                </Box>

                <Divider my={4} />

                <Flex
                  direction="row"
                  gap={2}
                  align="center"
                  onClick={() => handleOpenWebView(`tel:${contactNumber}`)}
                >
                  <Box w={"20px"}>
                    <Image
                      src={"/images/app/phone-call.svg"}
                      alt={""}
                      fontSize={18}
                      mx={"auto"}
                    />
                  </Box>
                  <Text fontWeight={700}>{contactEventManager}</Text>
                </Flex>
              </Box>

              <Box borderRadius={"50%"} h={"50px"} mt={6}>
                <Button
                  backgroundColor="#FFF"
                  borderRadius="22px"
                  height="44px"
                  width="100%"
                  flex={1}
                  onClick={() => onClose()}
                >
                  {cancelLabel}
                </Button>
              </Box>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
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
            <Box
              bgColor="#FFF"
              borderRadius={"50%"}
              w={"50px"}
              h={"50px"}
              mx={"auto"}
            >
              <Center h={"100%"} onClick={() => onClose()}>
                <CloseIcon color="#1E1E1E" w={"20px"} h={"20px"} />
              </Center>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const VideoModal = ({ onClose, size = "full", isOpen, popupSrc }) => {
  if (!popupSrc) {
    return <></>;
  }
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
        <ModalBody p={0}>
          <Flex h={"100vh"} direction="column" pb={"40px"}>
            <Box h={"60px"}></Box>
            <Box flex={1}>
              <Center h={"100%"} w={"100%"}>
                <video width="100%" controls>
                  <source src={popupSrc} type="video/mp4" />
                </video>
              </Center>
            </Box>
            <Box
              bgColor="#FFF"
              borderRadius={"50%"}
              w={"50px"}
              h={"50px"}
              mx={"auto"}
            >
              <Center h={"100%"} onClick={() => onClose()}>
                <CloseIcon color="#1E1E1E" w={"20px"} h={"20px"} />
              </Center>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const BannerSection = ({ tags, url, name, stockPhotoId, hostname }) => {
  const imageUrl =
    url ??
    `https://${hostname}/api/app/static/file/stockPhotos/${stockPhotoId}.jpg`;
  return (
    <Box
      bgImage={`url(${imageUrl})`}
      h={{ base: "280px" }}
      w={"100%"}
      bgSize={{ base: "cover" }}
      bgPosition={"center center"}
      position={"relative"}
    >
      <Box position={"absolute"} bottom={15} left={2} right={2} zIndex={2}>
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
          <Text fontSize={"20px"} fontWeight={700} color="#FFF">
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

const RegistrationRow = ({ title, value }) => {
  return (
    <Flex direction="row" gap={2}>
      <Box minW={"100px"} width={"100px"}>
        <Text>{title}</Text>
      </Box>
      <Text fontWeight={700}>{value}</Text>
    </Flex>
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

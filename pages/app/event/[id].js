import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Divider,
  Grid,
  GridItem,
  Box,
  Text,
  Link,
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
import { CloseIcon } from "@chakra-ui/icons";
import EVENT from "../../../utils/mock/api_event_id.json";
import { getEventDetail } from "../../../utils/event/getEvent";
import { useAppContext } from "../../../store/AppStore";
import { bookmarkEvent } from "../../../utils/event/eventAction";

const PAGE_KEY = "event";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props
    },
  };
};

const Event = ({ page }) => {
  const router = useRouter();
  const [detail, setDetail] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRegistrationModal,
    onOpen: onOpenRegistrationModal,
    onClose: onCloseRegistrationModal,
  } = useDisclosure();
  const [popupImage, setPopupImage] = useState(null);
  const {
    name,
    type,
    banner,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    likeCount,
    description,
    registerUrl,
    otherUrl,
    additionalInformation,
    submissionDeadline,
    eventManager,
    remark,
    freeOrCharge,
    price,
    contactNumber,
    bookmarked,
  } = EVENT?.data;

  useEffect(() => {
    const { query } = router;
    async function fetchData() {
      const data = (await getEventDetail(query?.id)) ?? {};
      setDetail(data);
    }
    fetchData();
  }, [router]);

  return (
    <Box pt={{ base: "64px" }}>
      <Box bg="#FFF" pb={12}>
        <Flex direction={{ base: "column", md: "row" }}>
          <Box flex={1}>
            <BannerSection
              name={detail?.name}
              tags={detail?.tags}
              url={`${detail?.banner?.file?.url}`}
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
                <Box p={"16px"} fontSize={"14px"}>
                  <Stack>
                    {/* <Box color={"#0D8282"}>#tag(API)</Box> */}
                    <Flex align="center" gap={2}>
                      <Box w={"20px"}>
                        <Image
                          src={"/images/app/calendar.svg"}
                          alt={""}
                          color="gray.500"
                          fontSize={18}
                        />
                      </Box>
                      <Box>
                        <b>
                          {wordExtractor(page?.content?.wordings, "from_label")}{" "}
                          {moment(detail?.startDate).format("YYYY-MM-DD")}{" "}
                          {wordExtractor(page?.content?.wordings, "to_label")}{" "}
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
                        />
                      </Box>
                      <Box>
                        <b>
                          {moment(detail?.startTime, ["HH.mm"]).format("hh:mm a")} -{" "}
                          {moment(detail?.endTime, ["HH.mm"]).format("hh:mm a")}{" "}
                          ({`${detail.datetimeRemark}`})
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
                          mx={"auto"}
                        />
                      </Box>
                      <Box>
                        <b>{detail?.venue}</b>
                      </Box>
                    </Flex>

                    <Flex align="center" gap={2}>
                      <Box w={"20px"} textAlign="center">
                        <Image
                          src={"/images/app/bookmark-off.svg"}
                          alt={""}
                          fontSize={18}
                          mx={"auto"}
                        />
                      </Box>
                      <Box fontWeight={700} color={"#0D8282"}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "bookmark_label"
                        ).replace("$", detail?.bookmarkCount)}
                      </Box>
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
                        <Text fontWeight={700}>{detail?.type}</Text>
                      </Flex>
                    </Box>
                  </Flex>

                  <Flex gap={4} direction="column" mb={4}>
                    <Text as="p">{detail?.description}</Text>
                    {/* <Flex
                      color="#0D8282"
                      align="center"
                      fontWeight={700}
                      gap={2}
                    >
                      <Box w={"20px"} textAlign="center">
                        <Image
                          src={"/images/app/link.svg"}
                          alt={""}
                          fontSize={18}
                          mx={"auto"}
                        />
                      </Box>
                      <Link target="_blank" href={registerUrl}>
                        {registerUrl}
                      </Link>
                    </Flex> */}
                  </Flex>

                  <Flex direction="column">
                    {detail?.otherUrls?.map((d) => (
                      <Flex
                        key={d}
                        color="#0D8282"
                        align="center"
                        fontWeight={700}
                        gap={2}
                      >
                        <Box w={"20px"}>
                          <Image
                            src={"/images/app/link.svg"}
                            alt={""}
                            fontSize={18}
                            mx={"auto"}
                          />
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
                      <GridItem
                        key={d.id}
                        flex={1}
                        bgColor={"#FFF"}
                        overflow={"hidden"}
                        onClick={() => {
                          if (d.url) {
                            onOpen();
                            setPopupImage(d.url);
                          }
                        }}
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
                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "quota_label"
                      )}
                      value={detail?.venue}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "free_or_charge_label"
                      )}
                      value={detail?.freeOrCharge}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "price_label"
                      )}
                      value={detail?.price}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "submission_deadline_label"
                      )}
                      value={moment(detail?.submissionDeadline).format(
                          "YYYY-MM-DD"
                        ) ?? ""}
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
                        "contact_number_label"
                      )}
                      value={detail?.contactNumber}
                    />

                    <RegistrationRow
                      title={wordExtractor(
                        page?.content?.wordings,
                        "remark_label"
                      )}
                      value={detail?.remark}
                    />

                    <Flex direction="row" gap={2}>
                      <Box minW={"100px"}>
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
                          <Box w={"20px"} textAlign="center">
                            <Image
                              src={"/images/app/link.svg"}
                              alt={""}
                              fontSize={18}
                              mx={"auto"}
                            />
                          </Box>
                          <Link target="_blank" href={detail?.registerUrl}>
                            {detail?.registerUrl}
                          </Link>
                        </Flex>
                      </Box>
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
                        onClick={() => onOpenRegistrationModal()}
                      >
                        {wordExtractor(
                          page?.content?.wordings,
                          "registration_label"
                        )}
                      </Button>
                      <Box
                        border="1px solid #EFEFEF"
                        borderRadius="50%"
                        p={2}
                        minW={"45px"}
                      >
                        <Center h={"100%"}>
                          <Image
                            src={
                              detail?.bookmarked
                                ? "/images/app/bookmark-active.svg"
                                : "/images/app/bookmark-off.svg"
                            }
                            alt={""}
                            fontSize={18}
                            mx={"auto"}
                            onClick={() => bookmarkEvent(detail?.id)}
                          />
                        </Center>
                      </Box>
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
  const { postMessage } = useAppContext();

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
                <Link target="_blank" href={registerUrl}>
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
                </Link>

                <Divider my={4} />

                <Flex
                  direction="row"
                  gap={2}
                  align="center"
                  onClick={() => {
                    let json = {
                      name: "openWebView",
                      options: {
                        callback: "openWebViewHandler",
                        params: {
                          value: `${`tel:${contactNumber}`}`,
                          type: "external",
                          isRedirect: false,
                        },
                      },
                    };
                    postMessage(json);
                  }}
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
                  <Text p={2} color="#FFF">
                    內容....(API)
                  </Text>
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

const BannerSection = ({ tags, url, name }) => {
  return (
    <Box
      bgImage={`url(${url})`}
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
      <Box minW={"100px"}>
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

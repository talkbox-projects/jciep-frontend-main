import React, { useState, useEffect, useCallback } from "react";
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
} from "@chakra-ui/react";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import organizationSearch from "../../utils/api/OrganizationSearch";
import { AiOutlineLink } from "react-icons/ai";
import { getProjectDetail } from "../../utils/project/getProject";
import { AiOutlineFilePdf, AiOutlinePlayCircle } from "react-icons/ai";
import { options } from "../../utils/project/resourceObj";

const PAGE_KEY = "project";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      api: {
        organizations: await organizationSearch({
          status: ["approved"],
          published: true,
        }),
      },
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const Project = ({ page, api: { organizations } }) => {
  const router = useRouter();
  const [detail, setDetail] = useState([]);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const { query } = router;
    async function fetchData() {
      const data = (await getProjectDetail(query?.id)) ?? {};
      setDetail(data);
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    if (!detail?.organizationId) {
      setOrganization(null);
      return;
    }
    const result = organizations?.find((d) => d.id === detail?.organizationId);
    setOrganization(result);
  }, [detail, organizations]);

  const RenderResourceListDetail = useCallback(({ data }) => {
    if (!data?.type) {
      return <></>;
    }

    if (data?.type === "venue") {
      return (
        <Box>
          <Flex color="#08A3A3" gap={2}>
            <Box>#{options["district"][data?.district]}</Box>
          </Flex>

          <Text
            as="h2"
            color="#1E1E1E"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight={700}
            pb={2}
          >
            {data?.title}
          </Text>
          <Stack spacing={2} direction="column">
            {data?.maxCapacity && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.maxCapacity}</Box>
              </Flex>
            )}
            {data?.maxCapacity && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.maxCapacity}</Box>
              </Flex>
            )}
            {data?.size && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.size}</Box>
              </Flex>
            )}
            {data?.openingHours && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.openingHours}</Box>
              </Flex>
            )}
            {data?.accessibilityRequirement && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>
                  {data?.accessibilityRequirement}
                </Box>
              </Flex>
            )}
          </Stack>
        </Box>
      );
    }

    if (data?.type === "manpower") {
      const tags = tags;
      return (
        <Box>
          <Box>
            {data?.tags?.map((d, i) => (
              <Box color="#08A3A3" key={`${d}-${i}`} d={"inline-block"} pr={1}>
                #{d}
              </Box>
            ))}
          </Box>
          <Text
            as="h2"
            color="#1E1E1E"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight={700}
            pb={2}
          >
            {data?.tasks}
          </Text>
          <Stack spacing={2} direction="column">
            {data?.tasksDescripwtion && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.tasksDescription}</Box>
              </Flex>
            )}
            {data?.skills && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>
                  {/* {data?.skills?.map((d) => (
                    <Box key={d} pr={1}>
                      {d}
                    </Box>
                  ))} */}
                  {data?.skills?.map((d, i) => (
                    <Box key={`${d}-${i}`} d={"inline-block"} pr={1}>
                      {d}
                    </Box>
                  ))}
                </Box>
              </Flex>
            )}
            {data?.serviceNature && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>
                  {options["serviceNature"][data?.serviceNature]}
                </Box>
              </Flex>
            )}
          </Stack>
        </Box>
      );
    }

    if (data?.type === "expertise") {
      return (
        <Box>
          <Text
            as="h2"
            color="#1E1E1E"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight={700}
            pb={2}
          >
            {data?.expertiseType &&
              options["expertiseType"][data?.expertiseType]}
          </Text>
          <Stack spacing={2} direction="column">
            {data?.description && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.description}</Box>
              </Flex>
            )}
          </Stack>
        </Box>
      );
    }

    if (data?.type === "network") {
      return (
        <Box>
          <Text
            as="h2"
            color="#1E1E1E"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight={700}
            pb={2}
          >
            {data?.networkType && options["networkType"][data?.networkType]}
          </Text>
          <Stack spacing={2} direction="column">
            {data?.description && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>{data?.description}</Box>
              </Flex>
            )}
          </Stack>
        </Box>
      );
    }

    if (data?.type === "other") {
      return (
        <Box>
          <Text
            as="h2"
            color="#1E1E1E"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight={700}
            pb={2}
          >
            任何支援
          </Text>
          <Stack spacing={2} direction="column">
            {data?.otherResourcesNeeded && (
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image src={"/images/app/resource_click.svg"} alt={""} />
                </Box>
                <Box fontSize={{ base: "sm" }}>
                  {data?.otherResourcesNeeded}
                </Box>
              </Flex>
            )}
          </Stack>
        </Box>
      );
    }

    if (data?.type === "funding") {
      return (
        <Box>
          <Text
            as="h2"
            color="#1E1E1E"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight={700}
            pb={2}
          >
            需要資金
          </Text>
          <Stack spacing={2} direction="column">
            <Flex gap={2} alignItems="center">
              <Box>
                <Image src={"/images/app/resource_click.svg"} alt={""} />
              </Box>
              <Box fontSize={{ base: "sm" }}>
                {data?.hasCurrentFunding ? "已有資金" : "沒有資金"}
              </Box>
            </Flex>

            <Flex gap={2} alignItems="center">
              <Box>
                <Image src={"/images/app/resource_click.svg"} alt={""} />
              </Box>
              <Box fontSize={{ base: "sm" }}>
                {data?.hasReceiveAnyFunding ? "沒有資金援助" : "有一些資金援助"}
              </Box>
            </Flex>
            <Flex gap={2} alignItems="center">
              <Box>總數(HKD)</Box>
              <Box fontSize={{ base: "sm" }}>
                <Box>
                  <b>{`${new Intl.NumberFormat("zh-HK").format(
                    data?.items?.reduce(function (acc, obj) {
                      return acc + obj.amount;
                    }, 0)
                  )}`}</b>
                </Box>
              </Box>
            </Flex>
          </Stack>
        </Box>
      );
    }

    return <></>;
  }, []);

  const resourceData = {
    venue: {
      color: "#97CB8D",
      icon: "/images/app/venue.svg",
      typeName: "場地",
    },
    manpower: {
      color: "#00BFBA",
      icon: "/images/app/manpower.svg",
      typeName: "人力資源",
    },
    expertise: {
      color: "#FEB534",
      icon: "/images/app/expertise.svg",
      typeName: "專業",
    },
    funding: {
      color: "#F6D644",
      icon: "/images/app/funding.svg",
      typeName: "資金",
    },
    network: {
      color: "#D094FF",
      icon: "/images/app/network.svg",
      typeName: "人際網絡",
    },
    other: {
      color: "#C6C6C6",
      icon: "/images/app/resource_other.svg",
      typeName: "其他",
    },
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
          <GridItem flex={1} bgColor={"#FFF"} overflow={"hidden"}>
            {/* <Box
              bgImage={`url(${data?.url})`}
              h={"110px"}
              w={"100%"}
              bgSize={{ base: "cover" }}
              bgPosition={"center center"}
              position={"relative"}
            /> */}
            <Image src={data?.url} width="100%" />
          </GridItem>
        );
    }
  };

  // const printIframe = (id) => {
  //   const iframe = document.frames
  //     ? document.frames[id]
  //     : document.getElementById(id);
  //   const iframeWindow = iframe.contentWindow || iframe;

  //   iframe.focus();
  //   iframeWindow.print();

  //   return false;
  // };

  return (
    <>
      <Box id="section-to-print">
        <VStack spacing={0} align="stretch" w="100%">
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
              mt={{ base: "-192px", md: "-360px", lg: "-280px" }}
              pb={8}
              px={{ base: 0, md: "15px" }}
            >
              <Flex direction={{ base: "column", md: "row" }} gap={{ base: 6 }}>
                <Box flex={1} px={{ base: "10px", md: 0 }}>
                  <Box mx={{ base: "-10px", md: 0 }} className="print-banner-wrap">
                    <BannerSection
                      name={detail?.name}
                      tags={detail?.tags}
                      url={`${detail?.banner?.file?.url}`}
                      stockPhotoId={`${detail?.banner?.stockPhotoId}`}
                    />
                  </Box>
                  <Grid
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                    }}
                    gap={6}
                  >
                    <GridItem flex={1}>
                      <Stack spacing={4} direction="column">
                        <Box
                          p={"16px"}
                          fontSize={"14px"}
                          bgColor={"#FFF"}
                          borderRadius={"10px"}
                          overflow={"hidden"}
                          boxShadow="xl"
                        >
                          <Stack spacing={4} direction="column">
                            <Flex gap={2} direction="column">
                              <Box
                                fontWeight={700}
                                fontSize={{ base: "md", md: "lg" }}
                              >
                                詳細
                              </Box>
                              <Box
                                dangerouslySetInnerHTML={{
                                  __html: detail?.introduction,
                                }}
                              />

                              {detail?.websites?.map((d) => (
                                <Flex
                                  key={d}
                                  color="#0D8282"
                                  align="center"
                                  fontWeight={700}
                                  alignItems="center"
                                >
                                  <Box pr={1}>
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

                            <Flex gap={2} direction="column">
                              <Box fontWeight={700}>發起機構</Box>
                              {organization ? (
                                <Flex gap={2} alignItems="center">
                                  <Box maxW={"180px"}>
                                    <Image
                                      src={organization?.logo?.url}
                                      alt={organization?.chineseCompanyName}
                                    />
                                  </Box>
                                  <Box>{organization?.name}</Box>
                                </Flex>
                              ) : (
                                "-"
                              )}
                            </Flex>
                          </Stack>
                        </Box>

                        <Box
                          p={"16px"}
                          pb={"32px"}
                          fontSize={"14px"}
                          bgColor={"#FFF"}
                          borderRadius={"10px"}
                          overflow={"hidden"}
                          boxShadow="xl"
                        >
                          <Stack spacing={4} direction="column">
                            <Flex gap={2} direction="column">
                              <Box
                                fontWeight={700}
                                fontSize={{ base: "md", md: "lg" }}
                              >
                                欠缺資源
                              </Box>
                            </Flex>

                            <Grid
                              templateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                              }}
                              gap={6}
                            >
                              {detail?.requireResources?.map((d, i) => {
                                return (
                                  <GridItem
                                    colSpan={1}
                                    flex={1}
                                    key={`${d?.type}-${i}`}
                                  >
                                    <Box
                                      boxShadow="lg"
                                      fontSize={"14px"}
                                      bgColor={"#FFF"}
                                      borderRadius={"10px"}
                                      overflow="hidden"
                                    >
                                      <Box
                                        h={2}
                                        bgColor={resourceData[d.type]?.color}
                                      />
                                      <Box
                                        d={"inline-block"}
                                        borderBottomRightRadius={"10px"}
                                        bgColor={resourceData[d.type]?.color}
                                        px={"12px"}
                                        py={"6px"}
                                      >
                                        <Flex
                                          justifyContent="flex-start"
                                          gap={2}
                                          alignItems="center"
                                        >
                                          <Box>
                                            <Image
                                              src={resourceData[d.type]?.icon}
                                              alt={""}
                                              color="gray.500"
                                              minW={"18px"}
                                            />
                                          </Box>
                                          <Box fontSize={"12px"}>
                                            {resourceData[d.type]?.typeName}
                                          </Box>
                                        </Flex>
                                      </Box>

                                      <Box py={"10px"} px={"15px"}>
                                        {d?.type && (
                                          <RenderResourceListDetail data={d} />
                                        )}

                                        <Divider my={4} />

                                        <Flex gap={3} alignItems="center">
                                          <Box>
                                            <Image
                                              src={
                                                "/images/app/resource_bookmark_off.svg"
                                              }
                                              alt={""}
                                            />
                                          </Box>
                                          <Box
                                            fontSize={{ base: "sm", lg: "sm" }}
                                          >
                                            {d?.bookmarkCount ?? "0"}人關注中
                                          </Box>
                                        </Flex>
                                      </Box>
                                    </Box>
                                  </GridItem>
                                );
                              })}
                            </Grid>
                          </Stack>
                        </Box>

                        <Box
                          p={"16px"}
                          pb={"32px"}
                          fontSize={"14px"}
                          bgColor={"#FFF"}
                          borderRadius={"10px"}
                          overflow={"hidden"}
                          boxShadow="xl"
                        >
                          <Stack spacing={4} direction="column">
                            <Flex gap={2} direction="column">
                              <Box
                                fontWeight={700}
                                fontSize={{ base: "md", md: "lg" }}
                              >
                                媒體及影片
                              </Box>
                            </Flex>

                            <Grid
                              templateColumns={{
                                base: "repeat(2, 1fr)",
                              }}
                              gap={2}
                            >
                              {detail?.files?.map((d) => (
                                <RenderAdditionalContent key={d?.id} data={d} />
                              ))}
                            </Grid>
                          </Stack>
                        </Box>
                      </Stack>
                    </GridItem>
                  </Grid>
                </Box>
                <Box
                  w={{ base: "100%", md: "310px" }}
                  px={{ base: "10px", md: 0 }}
                >
                  <Box bgColor={"#FFF"} borderRadius={"15px"} py={6} px={4}>
                    <Box>
                      <Text fontWeight={700} mb={2}>
                        描述
                      </Text>
                      <Text as="p" fontSize={"14px"}>
                        {detail?.remark}
                      </Text>
                    </Box>
                    <Divider my={4} />
                    <Stack direction={"column"} spacing={4} fontSize="14px">
                      <Flex align="center" gap={2} alignItems="flex-start">
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
                          <Box fontWeight={700}>計劃期限</Box>
                          {detail?.startDate} - {detail?.endDate}{" "}
                        </Box>
                      </Flex>

                      <Flex align="center" gap={2}>
                        <Box w={"20px"} pl={"4px"}>
                          <Image
                            src={"/images/app/bookmark-active.svg"}
                            alt={""}
                            fontSize={18}
                            maxW={"12px"}
                          />
                        </Box>
                        <Box>
                          <Box fontWeight={700} color="#0D8282">
                            {detail?.bookmarkCount}人關注中
                          </Box>
                        </Box>
                      </Flex>

                      <Flex
                        align="center"
                        gap={2}
                        d={{ base: "none", lg: "flex" }}
                      >
                        <Box w={"20px"} pl={"4px"}>
                          <Image
                            src={"/images/app/print.svg"}
                            alt={""}
                            fontSize={18}
                            maxW={"13px"}
                          />
                        </Box>
                        <Box>
                          <Box
                            fontWeight={700}
                            color="#0D8282"
                            cursor="pointer"
                            onClick={() => {
                              window.print();
                            }}
                          >
                            列印此頁
                          </Box>
                        </Box>
                      </Flex>
                    </Stack>
                  </Box>
                </Box>
              </Flex>
            </Container>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

const BannerSection = ({ tags, url, name, stockPhotoId }) => {
  const imageUrl =
    url ??
    `https://${window?.location?.hostname}/api/app/static/file/stockPhotos/${stockPhotoId}`;
  return (
    <Box
      h={{ base: "320px", md: "360px" }}
      w={"100%"}
      position={"relative"}
      borderRadius={{ base: "0px", md: "15px" }}
      mb={"15px"}
      overflow={"hidden"}
      className="print-banner"
    >
      <Image
        src={imageUrl}
        width="100%"
        height="100%"
        borderRadius={{ base: "0px", md: "15px" }}
      />
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
        className="print-hidden"
      />
    </Box>
  );
};

export default withPageCMS(Project, {
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

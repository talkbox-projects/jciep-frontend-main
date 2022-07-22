import React, { useState, useMemo } from "react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Stack,
  Divider,
  HStack,
  Image,
  VStack,
  Tag,
  Box,
  Text,
  Wrap,
  Link,
  Button,
  Avatar,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Portal,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useCallback } from "react";
import talantIdentitySearch from "../../utils/api/TalantIdentitySearch";
import IdentityProfileStore from "../../store/IdentityProfileStore";
import PwdSection from "../../components/profile/sections/PwdSection";
import IdentityPortfolioSection from "../../components/profile/sections/IdentityPortfolioSection";
import IdentityBiographySection from "../../components/profile/sections/IdentityBiographySection";
import ExperienceSection from "../../components/profile/sections/ExperienceSection";
import ActivitySection from "../../components/profile/sections/ActivitySection";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import organizationSearch from "../../utils/api/OrganizationSearch";
import ConnectedOrganization from "../../components/profile/sections/ConnectedOrganization";
import { NextSeo } from "next-seo";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { set } from "react-hook-form";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      api: {
        organizations: await organizationSearch({
          status: ["approved"],
          published: true,
          type: ["ngo"],
        }),
        identities: await talantIdentitySearch({
          published: true,
          identityType: ["pwd"],
          organizationId: context.query.organizationId,
          jobType: context.query.jobType,
          jobInterested: context.query.jobInterested,
          limit: 100,
          page: 1,
        }),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const SearchFilter = ({
  label,
  value = [],
  onChange = () => undefined,
  list = [],
}) => (
  <Menu>
    <MenuButton
      flex={1}
      as={Button}
      variant="ghost"
      rightIcon={<ChevronDownIcon />}
      borderBottomWidth="2px"
      size="lg"
      textAlign="left"
      borderRadius={0}
      w="100%"
    >
      <Text w="100%">
        {value.length > 0 ? `已篩選 ${value.length} 個` : ""}
        {label}
      </Text>
    </MenuButton>
    <Portal>
      <MenuList
        maxW="100vw"
        minWidth="240px"
        maxHeight={"300px"}
        overflowY={"scroll"}
      >
        <MenuOptionGroup value={value} onChange={onChange} type="checkbox">
          {list?.map((target, i) => (
            <MenuItemOption key={i} value={target.value}>
              {target.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Portal>
  </Menu>
);

const IdentityOpportunities = ({
  api: { organizations, identities },
  page,
  enums,
}) => {
  const router = useRouter();

  const [jobType, setJobType] = useState(router?.query?.jobType?.split(',')??[]);
  const [jobInterested, setJobInterested] = useState(router?.query?.jobInterested?.split(',')??[]);

  const jobTypeList = useMemo(
    () =>
      enums?.EnumEmploymentModeList?.map((target) => ({
        value: target.key,
        label: target.value[router.locale],
      })),
    [enums?.EnumEmploymentModeList, router.locale]
  );

  const jobInterestedList = useMemo(
    () =>
      enums?.EnumInterestedIndustryList?.map((target) => ({
        value: target.key,
        label: target.value[router.locale],
      })),
    [enums?.EnumInterestedIndustryList, router.locale]
  );

  const identityId = router.query.identityId ?? identities?.[0]?.id;

  const identity = identities?.find((x) => x.id === identityId);

  const generateUrlParameter = useCallback(
    ({ identityId, organizationId, jobType, jobInterested }) => {
      let query = "";
      if (identityId ?? router.query.identityId) {
        query += `identityId=${identityId ?? router.query.identityId}&`;
      }
      // if (organizationId ?? router.query.organizationId) {
      //   query += `organizationId=${
      //     organizationId ?? router.query.organizationId
      //   }&`;
      // }

      if (jobType ?? router.query.jobType) {
        query += `jobType=${jobType ?? router.query.jobType}&`;
      }

      if (jobInterested ?? router.query.jobInterested) {
        query += `jobInterested=${
          jobInterested ?? router.query.jobInterested
        }&`;
      }

      return `/talants/individuals?${query}`;
    },
    [router]
  );

  const details = (
    <IdentityProfileStore.Provider
      userFieldVisible={false}
      identity={identity}
      enums={enums}
      page={page}
      editable={false}
    >
      <VStack align="stretch" flex={1} minW={0} w="100%">
        <ConnectedOrganization />
        <PwdSection />
        <IdentityPortfolioSection />
        <IdentityBiographySection />
        <ExperienceSection />
        <ActivitySection />
      </VStack>
    </IdentityProfileStore.Provider>
  );

  const identityList = (
    <VStack
      d={
        !router.query.identityId ? "block" : ["none", "none", "block", "block"]
      }
      overflow="auto"
      align="stretch"
      spacing={4}
      w={["100%", "100%", "33%", "33%"]}
      cursor="pointer"
    >
      {" "}
      {(identities ?? []).map((identity) => (
        <NextLink
          href={generateUrlParameter({
            identityId: identity?.id,
            organizationId: router?.query?.organizationId,
          })}
          key={identity?.id}
        >
          <VStack
            borderColor="#eee"
            bgColor="white"
            borderWidth={1}
            p={2}
            px={6}
            spacing={3}
            align="stretch"
            key={identity?.id}
            _hover={{
              boxShadow: "md",
            }}
            {...(identity?.id === identityId && {
              borderColor: "#F6D644",
              borderWidth: 2,
              borderTopWidth: 8,
            })}
            borderRadius={10}
            paddingBottom="20px"
          >
            <VStack spacing={0} align="start">
              {identity?.profilePic?.url && (
                <Avatar src={identity?.profilePic?.url} size="lg" />
              )}
              <Text pt={2} color="#000">
                {identity?.chineseName}
              </Text>
              <Text color="#757575">{identity?.caption}</Text>
            </VStack>
            {identity?.interestedIndustry?.length > 0 && (
              <Wrap>
                {(enums?.EnumInterestedIndustryList ?? [])
                  .filter((x) =>
                    (identity?.interestedIndustry ?? []).includes(x.key)
                  )
                  .map(({ key: value, value: { [router.locale]: label } }) => (
                    <Tag key={value}>{label}</Tag>
                  ))}
              </Wrap>
            )}
            <Divider borderColor="gray.200" />
            <VStack align="stretch">
              <HStack>
                <Image
                  alt=""
                  src={page?.content?.icon?.degreeIcon}
                  w={6}
                  h={6}
                />
                <Text>
                  {
                    (enums?.EnumDegreeList ?? []).find(
                      (x) => identity?.educationLevel === x.key
                    )?.value?.[router?.locale]
                  }
                </Text>
              </HStack>
              {identity?.yearOfExperience && (
                <HStack>
                  <Image
                    alt=""
                    src={page?.content?.icon?.expIcon}
                    w={6}
                    h={6}
                  />
                  <Text>
                    {(enums?.EnumYearOfExperienceList ?? [])
                      .filter((x) =>
                        (identity?.yearOfExperience ?? []).includes(x.key)
                      )
                      .map(({ value: { [router.locale]: label } }) => label)}
                  </Text>
                </HStack>
              )}
              {identity?.interestedEmploymentMode?.length > 0 && (
                <HStack>
                  <Image
                    alt=""
                    src={page?.content?.icon?.modeIcon}
                    w={6}
                    h={6}
                  />
                  <Text>
                    {(enums?.EnumEmploymentModeList ?? [])
                      .filter((x) =>
                        (identity?.interestedEmploymentMode ?? []).includes(
                          x.key
                        )
                      )
                      .map(({ value: { [router.locale]: label } }) => label)}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </NextLink>
      ))}
    </VStack>
  );

  const seo = (
    <NextSeo
      title={`${page?.content?.seo?.title ?? "賽馬會共融．知行計劃"}${
        identity?.chineseName
          ? `| ${identity?.chineseName}`
          : identity?.chineseName
      }`}
      description={page?.content?.seo?.description}
    />
  );

  return (
    <>
      {seo}
      <VStack spacing={0} align="stretch" w="100%">
        <Box
          d={!router.query.identityId ? "block" : ["none", "none", "block"]}
          bgColor="#F6D644"
          position="relative"
        >
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Stack
              direction={["column", "column", "row", "row"]}
              w="100%"
              align={["start", "start", "center"]}
              pb={[48, 48, 48, 36]}
              pt={[36, 36, 36, 48]}
            >
              <Box flex={1}>
                <Text fontSize="5xl" fontWeight="bold">
                  {wordExtractor(page?.content?.wordings, "page_title")}
                </Text>
                <Text fontSize="xl">
                  {wordExtractor(page?.content?.wordings, "page_subtitle_1")}
                  <Link
                    href={wordExtractor(
                      page?.content?.wordings,
                      "page_subtitle_url"
                    )}
                  >
                    <Text d="inline" decoration="underline">
                      {wordExtractor(
                        page?.content?.wordings,
                        "page_subtitle_link"
                      )}
                    </Text>
                  </Link>
                </Text>
              </Box>
              <Button
                mt={3}
                as={Link}
                target="_blank"
                href="https://drive.google.com/file/d/1yeuAoCZug-1pEc92u1Vf09lIS-7ZN9j8/view"
                borderRadius="full"
                color="#000"
                bg="transparent"
                variant="outline"
                _hover={{
                  bg: "rgba(255,255,255, 0.3)",
                }}
                borderColor="#000"
              >
                {wordExtractor(
                  page?.content?.wordings,
                  "page_tutorial_individual_link"
                )}
              </Button>
            </Stack>
          </Container>
        </Box>

        <Box d={["none", "none", "block"]} bg="#fafafa" py={16}>
          <Container>
            <Grid
              templateRows="repeat(1, 1fr)"
              templateColumns="repeat(4, 1fr)"
              gap={4}
            >
              <GridItem colSpan={1}>
                <SearchFilter
                  label="工作類型"
                  value={jobType}
                  onChange={(value) => {
                    setJobType(value);
                    router.push(
                      generateUrlParameter({
                        identityId: "",
                        jobType: encodeURIComponent(value),
                      })
                    );
                  }}
                  list={jobTypeList}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <SearchFilter
                  label="工作類別"
                  value={jobInterested}
                  onChange={(value) => {
                    setJobInterested(value);
                    router.push(
                      generateUrlParameter({
                        identityId: "",
                        jobInterested: encodeURIComponent(value),
                      })
                    );
                  }}
                  list={jobInterestedList}
                />
              </GridItem>
            </Grid>

            {/* <Box w={["100%", "100%", "250px", "330px"]} marginBottom="15px">

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
              >
                <option key="" value="">
                  {wordExtractor(page?.content?.wordings, "organization_text")}
                </option>
                {(organizations ?? []).map(({ id, chineseCompanyName }) => (
                  <option key={id} value={id}>
                    {chineseCompanyName}
                  </option>
                ))}
              </Select>
            </Box> */}
            <HStack mt={4} align="stretch" spacing={4}>
              {identityList}
              {/* desktop detail page */}
              {identity && details}
            </HStack>
          </Container>
        </Box>
      </VStack>
      {/* mobile detail page */}
      <Box bg="#fafafa" pt={24} d={["block", "block", "none"]}>
        {router.query.identityId ? (
          <Box px={1}>
            <NextLink href="/talants/individuals">
              <Button
                alignSelf="start"
                mb={8}
                leftIcon={<ArrowBackIcon />}
                variant="link"
              >
                {wordExtractor(page?.content?.wordings, "back_button_label")}
              </Button>
            </NextLink>
            {details}
          </Box>
        ) : (
          <Box p={4}>
            <Box w={["100%", "100%", "250px", "330px"]} marginBottom="15px">
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
              >
                <option key="" value="">
                  {wordExtractor(page?.content?.wordings, "organization_text")}
                </option>
                {(organizations ?? []).map(
                  ({ id, chineseCompanyName, enghlishCompanyName }) => (
                    <option key={id} value={id}>
                      {router.locale === "zh"
                        ? chineseCompanyName
                        : enghlishCompanyName}
                    </option>
                  )
                )}
              </Select>
            </Box>
            {identityList}
          </Box>
        )}
      </Box>
    </>
  );
};

export default withPageCMS(IdentityOpportunities, {
  key: PAGE_KEY,

  fields: [
    {
      name: "icon",
      label: "圖示 Icon",
      component: "group",
      fields: [
        {
          label: "學歷圖標 Publish Date icon",
          name: "degreeIcon",
          component: "image",
          uploadDir: () => "/talants",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "經驗圖標 Experience icon",
          name: "expIcon",
          component: "image",
          uploadDir: () => "/talants",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "地區圖標 Location icon",
          name: "locationIcon",
          component: "image",
          uploadDir: () => "/talants",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "工作類型圖標 Employment mode icon",
          name: "modeIcon",
          component: "image",
          uploadDir: () => "/talants",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "專才圖標 User icon",
          name: "userIcon",
          component: "image",
          uploadDir: () => "/talants",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "鏈結圖標 Url icon",
          name: "urlIcon",
          component: "image",
          uploadDir: () => "/talants",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
    {
      label: "首區段 Header Section",
      name: "headerSection",
      component: "group",
      fields: [
        {
          label: "預設 Banner Banner Placeholder",
          name: "bannerPlaceholder",
          component: "image",
          uploadDir: () => "/user/profile/head-section",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
  ],
});

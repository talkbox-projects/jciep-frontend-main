import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Divider,
  HStack,
  Image,
  VStack,
  SimpleGrid,
  GridItem,
  Tag,
  Box,
  Text,
  Wrap,
  Link,
  Button,
  Stack,
  Avatar,
  Select,
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import moment from "moment";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useCallback } from "react";
import identitySearch from "../../utils/api/IdentitySearch";
import IdentityProfileStore from "../../store/IdentityProfileStore";
import PwdSection from "../../components/profile/sections/PwdSection";
import IdentityPortfolioSection from "../../components/profile/sections/IdentityPortfolioSection";
import IdentityBiographySection from "../../components/profile/sections/IdentityBiographySection";
import ExperienceSection from "../../components/profile/sections/ExperienceSection";
import ActivitySection from "../../components/profile/sections/ActivitySection";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import organizationSearch from "../../utils/api/OrganizationSearch";

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
        identities: await identitySearch({
          published: true,
          identityType: ["pwd"],
          organizationId: context.query.organizationId,
          limit: 10,
          page: 1,
        }),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const IdentityOpportunities = ({
  api: { organizations, identities },
  page,
  enums,
}) => {
  const router = useRouter();

  const identityId = router.query.identityId ?? identities?.[0]?.id;

  const identity = identities?.find((x) => x.id === identityId);

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

  const details = (
    <IdentityProfileStore.Provider
      userFieldVisible={false}
      identity={identity}
      enums={enums}
      page={page}
      editable={false}
    >
      <VStack align="stretch" flex={1} minW={0} w="100%">
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
          href={`/talants/individuals?identityId=${identity?.id}`}
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
            borderRadius={8}
          >
            <VStack spacing={0} align="start">
              {identity?.profilePic?.url && (
                <Avatar src={identity?.profilePic?.url} size="lg" />
              )}
              <Text pt={2} color="#000">
                {identity?.chineseName}
              </Text>
              <Text color="#999">{identity?.caption}</Text>
            </VStack>
            {identity?.interestedIndustry?.length > 0 && (
              <Wrap>
                {(enums?.EnumIndustryList ?? [])
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
                <Image src={page?.content?.icon?.degreeIcon} w={6} h={6} />
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
                  <Image src={page?.content?.icon?.expIcon} w={6} h={6} />
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
                  <Image src={page?.content?.icon?.modeIcon} w={6} h={6} />
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

  return (
    <>
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
            <Box pb={[48, 48, 48, 36]} pt={[24, 24, 24, 36]}>
              <Text fontSize="5xl" fontWeight="bold">
                {wordExtractor(page?.content?.wordings, "page_title")}
              </Text>
              <Text fontSize="xl">
                {wordExtractor(page?.content?.wordings, "page_subtitle_1")}
                <Link href={wordExtractor(
                      page?.content?.wordings,
                      "page_subtitle_url"
                    )}>
                  <Text d="inline" decoration="underline">
                    {wordExtractor(
                      page?.content?.wordings,
                      "page_subtitle_link"
                    )}
                  </Text>
                </Link>
              </Text>
            </Box>
            <Image
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
            <Box w={["100%", "100%", "250px", "330px"]}>
              <Select
                value={router.query.organizationId ?? ""}
                onChange={(e) =>
                  router.push(
                    generateUrlParameter({ organizationId: e.target.value })
                  )
                }
                variant="flushed"
              >
                <option key="" value="">
                  {/* Organization */}
                  {wordExtractor(page?.content?.wordings, "organization_text")}

                </option>
                {(organizations ?? []).map(
                  ({ id, chineseCompanyName, enghlishCompanyName }) => (
                    <option key={id} value={id}>
                      {chineseCompanyName}
                    </option>
                  )
                )}
              </Select>
            </Box>
            <HStack mt={4} align="stretch" spacing={4}>
              {identityList}
              {/* desktop detail page */}
              {details}
            </HStack>
          </Container>
        </Box>
      </VStack>
      {/* mobile detail page */}
      <Box bg="#fafafa" pt={[0, 0]} d={["block", "block", "none"]}>
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
            <Box w={["100%", "100%", "250px", "330px"]}>
              <Select
                value={router.query.organizationId ?? ""}
                onChange={(e) =>
                  router.push(
                    generateUrlParameter({ organizationId: e.target.value })
                  )
                }
                variant="flushed"
              >
                <option key="" value="">
                  {/* Organization */}
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

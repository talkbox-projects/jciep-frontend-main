import React from "react";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Stack,
  Divider,
  HStack,
  Image,
  VStack,
  Box,
  Text,
  Link,
  Button,
  Avatar,
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import { ArrowBackIcon } from "@chakra-ui/icons";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import organizationSearch from "../../utils/api/OrganizationSearch";
import OrganizationBiographySection from "../../components/profile/sections/OrganizationBiographySection";
import OrganizationPortfolioSection from "../../components/profile/sections/OrganizationPortfolioSection";
import OrganizationProfileStore from "../../store/OrganizationProfileStore";
import NgoSection from "../../components/profile/sections/NgoSection";
import OrganizationMemberListSection from "../../components/profile/sections/OrganizationMemberListSection";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      api: {
        organizations: await organizationSearch(
          {
            status: ["approved"],
            published: true,
            type: ["ngo"],
            limit: 0,
          },
          context
        ),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const IdentityOpportunities = ({ api: { organizations }, page, enums }) => {
  const router = useRouter();

  const organizationId = router.query.organizationId ?? organizations?.[0]?.id;

  const organization = organizations?.find((x) => {
    return x.id === organizationId;
  });

  const details = (
    <OrganizationProfileStore.Provider
      userFieldVisible={false}
      organization={organization}
      enums={enums}
      page={page}
      editable={false}
    >
      <VStack align="stretch" flex={1} minW={0} w="100%">
        <NgoSection />
        <OrganizationBiographySection />
        <OrganizationPortfolioSection />
        <OrganizationMemberListSection path="talants" />
      </VStack>
    </OrganizationProfileStore.Provider>
  );

  const organizationList = (
    <VStack
      d={
        !router.query.organizationId
          ? "block"
          : ["none", "none", "block", "block"]
      }
      overflow="auto"
      align="stretch"
      spacing={4}
      w={["100%", "100%", "33%", "33%"]}
      cursor="pointer"
    >
      {" "}
      {(organizations ?? []).map((organization) => (
        <NextLink
          href={`/talants/organizations?organizationId=${organization?.id}`}
          key={organization?.id}
        >
          <VStack
            borderColor="#eee"
            bgColor="white"
            borderWidth={1}
            py={4}
            px={6}
            spacing={3}
            align="stretch"
            key={organization?.id}
            _hover={{
              boxShadow: "md",
            }}
            {...(organization?.id === organizationId && {
              borderColor: "#F6D644",
              borderWidth: 2,
              borderTopWidth: 8,
            })}
            borderRadius={10}
            paddingBottom="20px"
          >
            <VStack spacing={0} align="start">
              {organization?.logo?.url && (
                <Avatar
                  bg="white"
                  borderWidth={2}
                  borderColor="gray.300"
                  src={organization?.logo?.url}
                  size="lg"
                  f
                />
              )}
              <Text pt={2} color="#000">
                {router.locale === "zh"
                  ? organization?.chineseCompanyName
                  : organization?.englishCompanyName??organization?.chineseCompanyName}
              </Text>
              <Text color="#757575">{organization?.description}</Text>
            </VStack>
            <Divider borderColor="gray.200" />
            <VStack align="stretch">
              <HStack>
                <Image
                  alt=" "
                  src={page?.content?.icon?.userIcon}
                  w={6}
                  h={6}
                />
                <Text>
                  {
                    organization?.member?.filter((x) => x.role === "member")
                      ?.length
                  }{" "}
                  {wordExtractor(page?.content?.wordings, "number_of_members")}
                </Text>
              </HStack>
              {organization?.website && (
                <HStack>
                  <Image
                    alt=" "
                    src={page?.content?.icon?.urlIcon}
                    w={6}
                    h={6}
                  />
                  <Link href={organization?.website} wordBreak="break-word">
                    <Text>{organization?.website}</Text>
                  </Link>
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
          d={!router.query.organizationId ? "block" : ["none", "none", "block"]}
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
                href="https://drive.google.com/file/d/1S_TWnTiuVFGo55RDDMiXekeqkUAw3ots/view"
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
                  "page_tutorial_organization_link"
                )}
              </Button>
            </Stack>
          </Container>
        </Box>

        <Box d={["none", "none", "block"]} bg="#fafafa" py={16}>
          <Container>
            <HStack mt={4} align="stretch" spacing={4}>
              {organizationList}
              {/* desktop detail page */}
              {organization && details}
            </HStack>
          </Container>
        </Box>
      </VStack>
      {/* mobile detail page */}
      <Box bg="#fafafa" pt={24} d={["block", "block", "none"]}>
        {router.query.organizationId ? (
          <Box px={1}>
            <NextLink href="/talants/organizations">
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
          <Box p={4}>{organizationList}</Box>
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

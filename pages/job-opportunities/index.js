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
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
const PAGE_KEY = "jobOpportunities";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import moment from "moment";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useCallback } from "react";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";

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

  const jobId = router.query.jobId ?? page?.content?.jobs?.[0]?.id;

  const job = page?.content?.jobs?.find((x) => x.id === jobId);

  const jobLocationRenderer = useCallback(
    (job) =>
      [
        ...(job?.location ?? []).map((key) =>
          wordExtractor(page?.content?.wordings, `location_${key}`)
        ),
        ...(job?.otherLocation ? [job?.otherLocation] : []),
      ].map(
        (location, index, arr) =>
          `${location}${index === arr.length - 1 ? "" : "，"}` // FIXME: comma for chinese / eng
      ),
    [page, wordExtractor]
  );

  const jobFunctionRenderer = useCallback(
    (job) =>
      [
        ...(job?.jobFunction ?? []).map((key) =>
          wordExtractor(page?.content?.wordings, `jobFunction_${key}`)
        ),
        ...(job?.otherJobFunction ? [job?.otherJobFunction] : []),
      ].map((jobFunction) => <Tag rounded="full">{jobFunction}</Tag>),
    [page, wordExtractor]
  );

  const jobIndustryRenderer = useCallback(
    (job) =>
      [
        ...(job?.industry ?? []).map((key) =>
          wordExtractor(page?.content?.wordings, `industry_${key}`)
        ),
        ...(job?.otherIndustry ? [job?.otherIndustry] : []),
      ].map(
        (industry, index, arr) =>
          `${industry}${index === arr.length - 1 ? "" : "，"}`
      ),
    [page, wordExtractor] // FIXME: comma for chinese / eng
  );

  const details = (
    <>
      <Stack spacing={2}>
        {job?.companyLogo && <Image src={job?.companyLogo} w="120px" />}
        <Text fontSize={["lg"]}>{job?.companyName}</Text>
      </Stack>
      <Text fontSize={["2xl"]} pb={3} fontWeight="bold">
        {job?.title}
      </Text>
      <VStack py={4} spacing={3} align="start">
        <HStack>
          <Image src={page?.content?.icon?.modeIcon} w={6} h={6} />
          <Text>
            {wordExtractor(page?.content?.wordings, `mode_${job?.mode}`)}
          </Text>
        </HStack>
        <HStack>
          <Image src={page?.content?.icon?.locationIcon} w={6} h={6} />
          <Text>
            {wordExtractor(page?.content?.wordings, "job_location_label")}
            {jobLocationRenderer(job)}
          </Text>
        </HStack>
        <HStack>
          <Image src={page?.content?.icon?.timeIcon} w={6} h={6} />
          <Text>
            {wordExtractor(page?.content?.wordings, "job_publishDate_label")}
            {moment(job?.publishDate)?.format("YYYY-MM-DD hh:mm a")}
          </Text>
        </HStack>
        <HStack>
          <Image src={page?.content?.icon?.applyMethodsIcon} w={6} h={6} />
          <Text>
            {wordExtractor(page?.content?.wordings, "job_applyMethods_label")}
            {job?.applyMethods}
          </Text>
        </HStack>
      </VStack>
      <Divider />
      <VStack py={4} align="stretch">
        <Box fontWeight="bold">
          {wordExtractor(page?.content?.wordings, "job_description_label")}
        </Box>
        <Wrap>{jobFunctionRenderer(job)}</Wrap>
        <Box
          sx={{
            "ul, ol": {
              px: 4,
            },
            a: {
              color: "green.500",
              textDecor: "underline",
            },
            li: {
              listStyle: "none",
              pb: 2,
              position: "relative",
              "&::before": {
                content: '"．"',
                position: "absolute",
                left: "-0.8em",
                top: "-0.25em",
              },
            },
          }}
          dangerouslySetInnerHTML={{
            __html: job?.description ?? "",
          }}
        />
      </VStack>
      <Divider />
      <SimpleGrid py={4} spacing={2} direction="row" columns={[1, 2, 3, 3]}>
        {[
          {
            label: wordExtractor(
              page?.content?.wordings,
              "job_yearOfExperience_label"
            ),
            value: wordExtractor(
              page?.content?.wordings,
              `yearOfExperience_${job?.yearOfExperience}`
            ),
          },
          {
            label: wordExtractor(
              page?.content?.wordings,
              "job_qualification_label"
            ),
            value: wordExtractor(
              page?.content?.wordings,
              `qualification_${job?.qualification}`
            ),
          },
          {
            label: wordExtractor(page?.content?.wordings, "job_industry_label"),
            value: jobIndustryRenderer(job),
          },
        ].map(({ label, value }, index) => {
          return (
            <Box key={index}>
              <Text>{label}</Text>
              <Text>{value}</Text>
            </Box>
          );
        })}
        <GridItem></GridItem>
      </SimpleGrid>
      <Divider />
      <VStack py={4} align="stretch">
        <Box fontWeight="bold">
          {wordExtractor(page?.content?.wordings, "company_profile_label")}
        </Box>
        <Box
          sx={{
            "ul, ol": {
              px: 4,
            },
            li: {
              listStyle: "none",
              pb: 2,
              position: "relative",
              "&::before": {
                content: '"．"',
                position: "absolute",
                left: "-0.8em",
                top: "-0.25em",
              },
            },
          }}
          dangerouslySetInnerHTML={{
            __html: job?.companyProfile ?? "",
          }}
        />
      </VStack>
    </>
  );

  const jobList = (
    <VStack
      d={!router.query.jobId ? "block" : ["none", "none", "block", "block"]}
      maxH="100vh"
      overflow="auto"
      align="stretch"
      spacing={4}
      w={["100%", "100%", "33%", "33%"]}
      cursor="pointer"
    >
      {(page?.content?.jobs ?? []).map((job, index) => (
        <NextLink href={`/job-opportunities?jobId=${job?.id}`} key={job?.id}>
          <VStack
            borderColor="#eee"
            borderWidth={1}
            p={4}
            px={6}
            spacing={3}
            align="stretch"
            key={job?.id}
            _hover={{
              boxShadow: "md",
            }}
            {...(job?.id === jobId && {
              borderColor: "#F6D644",
              borderWidth: 2,
              borderTopWidth: 8,
            })}
            borderRadius={8}
          >
            <Stack spacing={2}>
              {job?.companyLogo && <Image src={job?.companyLogo} w="60px" />}
              <Text fontSize={["md"]}>{job?.companyName}</Text>
            </Stack>
            <Text pb={3} fontWeight="bold">
              {job?.title}
            </Text>
            <Wrap>{jobFunctionRenderer(job)}</Wrap>
            <HStack>
              <Image src={page?.content?.icon?.modeIcon} w={6} h={6} />
              <Text>
                {wordExtractor(page?.content?.wordings, `mode_${job?.mode}`)}
              </Text>
            </HStack>
            <HStack>
              <Image src={page?.content?.icon?.expIcon} w={6} h={6} />
              <Text>
                {wordExtractor(
                  page?.content?.wordings,
                  `yearOfExperience_${job?.yearOfExperience}`
                )}
              </Text>
            </HStack>
            <Divider borderColor="gray.200" />
            <HStack w="100%">
              <Box flex={1} minW={0} w="100%">
                <HStack>
                  <Image src={page?.content?.icon?.locationIcon} w={6} h={6} />
                  <Text isTruncated maxW="100%">
                    {jobLocationRenderer(job)}
                  </Text>
                </HStack>
              </Box>
              <Box>{moment(job?.publishDate)?.format("YYYY-MM-DD")}</Box>
            </HStack>
          </VStack>
        </NextLink>
      ))}
    </VStack>
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
            <Box pb={[48, 48, 48, 36]} pt={[24, 24, 24, 36]}>
              <Text fontSize="5xl" fontWeight="bold">
                {wordExtractor(page?.content?.wordings, "page_title")}
              </Text>
              <Text fontSize="xl">
                {wordExtractor(page?.content?.wordings, "page_subtitle_1")}
                <Link decoration="underline">
                  {wordExtractor(page?.content?.wordings, "page_subtitle_link")}
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
            <HStack align="start" spacing={4}>
              {jobList}
              {/* desktop detail page */}
              <VStack
                bg="white"
                flex={1}
                minW={0}
                w="100%"
                align="stretch"
                borderRadius={8}
                borderColor="#eee"
                borderWidth={2}
                minH={256}
                p={4}
              >
                {details}
              </VStack>
            </HStack>
          </Container>
        </Box>
      </VStack>
      {/* mobile detail page */}
      <Box mt={16} d={["block", "block", "none"]}>
        {router.query.jobId ? (
          <VStack align="stretch" p={4} spacing={0}>
            <NextLink href="/job-opportunities">
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
          </VStack>
        ) : (
          <Box p={4}>{jobList}</Box>
        )}
      </Box>
    </>
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
      name: "jobs",
      label: "工作機會列表",
      component: "group-list",
      itemProps: ({ id: key, title: label }) => ({
        key,
        label,
      }),
      defaultItem: () => ({
        id: Math.random().toString(36).substr(2, 9),
      }),
      fields: [
        {
          label: "Company Name",
          name: "companyName",
          component: "text",
        },
        {
          label: "Company Logo",
          name: "companyLogo",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "Company Profile",
          name: "companyProfile",
          component: "html",
        },
        {
          name: "title",
          component: "text",
          label: "職位名稱 Job title",
        },
        {
          name: "mode",
          component: "select",
          label: "工作類型 Employment mode",
          options: [
            { value: "freelance", label: "freelance 自由工作" },
            { value: "fullTime", label: "fullTime 全職" },
            { value: "partTime", label: "partTime 兼職" },
          ],
        },
        {
          name: "location",
          component: "list",
          label: "工作地區 Job location",
          defaultItem: () => "centralAndWestern",
          field: {
            component: "select",
            options: [
              {
                value: "centralAndWestern",
                label: "Central and Western 中西區",
              },
              { value: "eastern", label: "Eastern 東區" },
              { value: "southern", label: "Southern 南區" },
              { value: "wanChai", label: "Wan Chai 灣仔區" },
              { value: "shamShuiPo", label: "Sham Shui Po 深水埗區" },
              { value: "kowloonCity", label: "Kowloon City 九龍城區" },
              { value: "kwunTong", label: "Kwun Tong 觀塘區" },
              { value: "wongTaiSin", label: "Wong Tai Sin 黃大仙區" },
              { value: "yauTsimMong", label: "Yau Tsim Mong 油尖旺區" },
              { value: "islands", label: "Islands 離島區" },
              { value: "kwaiTsing", label: "Kwai Tsing 葵青區" },
              { value: "north", label: "North 北區" },
              { value: "saiKung", label: "Sai Kung 西貢區" },
              { value: "shaTin", label: "Sha Tin 沙田區" },
              { value: "taiPo", label: "Tai Po 大埔區" },
              { value: "tsuenWan", label: "Tsuen Wan 荃灣區" },
              { value: "tuenMun", label: "Tuen Mun 屯門區" },
              { value: "yuenLong", label: "Yuen Long 元朗區" },
              { value: "unrestricted", label: "Unrestricted 地點不限" },
              {
                value: "multipleLocation",
                label: "Multiple Location  全港各區",
              },
            ],
          },
        },
        {
          name: "otherLocation",
          component: "text",
          label: "其他工作地區 Other location (free text)",
        },
        {
          name: "jobFunction",
          component: "list",
          label: "工作類別 Job Function",
          defaultItem: () => "graphicDesign",
          field: {
            component: "select",
            options: [
              { value: "graphicDesign", label: "平面設計 Graphic design" },
              {
                value: "illustrationDrawing",
                label: "插畫繪製 Illustration drawing",
              },
              { value: "animationDesign", label: "動畫設計 Animation design" },
              { value: "webDesign", label: "網頁設計 Web Design" },
              { value: "photography", label: "攝影 Photography" },
              { value: "filmmaking", label: "影片製作 Filmmaking" },
              {
                value: "musicSoundDesign",
                label: "音樂/音效設計 Music/sound design",
              },
              { value: "dubbingWork", label: "配音工作 Dubbing work" },
              {
                value: "softwareMobileAppDesign",
                label: "軟件/手機應用程式設計 Software/mobile app design",
              },
              {
                value: "mobileComputerGameDesign",
                label: "手機/電腦遊戲設計 Mobile/computer game design",
              },
              {
                value: "webpageProduction",
                label: "網頁製作 Webpage production",
              },
              {
                value: "computerProgramming",
                label: "電腦程式編寫 Computer programming",
              },
              { value: "computerRepair", label: "電腦維修 Computer repair" },
              { value: "privateTuition", label: "私人補習 Private tuition" },
              { value: "musicTutor", label: "音樂導師 Music tutor" },
              { value: "artTutor", label: "美術導師 Art tutor" },
              {
                value: "sportsInstructor",
                label: "運動導師 Sports Instructor",
              },
              {
                value: "performingArtsInstructor",
                label: "表演藝術導師 Performing Arts Instructor",
              },
              {
                value: "performingArtist",
                label: "表演藝術者 Performing artist",
              },
              {
                value: "magicVaudevilleShow",
                label: "魔術/雜耍表演 Magic/vaudeville show",
              },
              {
                value: "twistedBalloonService",
                label: "扭波服務 Twisted balloon service",
              },
              { value: "activityLeader", label: "活動帶領 Activity leader" },
              {
                value: "masterOfCeremonies",
                label: "司儀工作 Master of ceremonies",
              },
              {
                value: "promotionActivities",
                label: "活動推廣 Promotion activities",
              },
              { value: "prWork", label: "公關工作 PR work" },
              { value: "eventPlanning", label: "活動策劃 Event planning" },
              { value: "setProduction", label: "佈景製作 Set production" },
              {
                value: "activityAssistant",
                label: "活動助理 Activity assistant",
              },
              {
                value: "trusteeGongAidClassInstructor",
                label: "托管/功輔班導師 Trustee/Gong Aid Class Instructor",
              },
              {
                value: "interestClassTutor",
                label: "興趣班導師 Interest class tutor",
              },
              { value: "eventsOfficer", label: "活動幹事 Events Officer" },
              { value: "teachingAssistant", label: "助教 Teaching assistant" },
              { value: "salesJob", label: "銷售工作 Sales job" },
              { value: "promoter", label: "推廣員 Promoter" },
              {
                value: "socialMediaManagement",
                label: "社交媒體管理 Social media management",
              },
              { value: "textPromotion", label: "文字推廣 Text promotion" },
              {
                value: "promotionalEventPlanning",
                label: "推廣活動策劃 Promotional event planning",
              },
              { value: "waiter", label: "侍應 Waiter" },
              { value: "waterBar", label: "水吧 Water bar" },
              { value: "coffeeBrewing", label: "咖啡沖製 Coffee brewing" },
              { value: "kitchen", label: "廚房 Kitchen" },
              { value: "cashRegister", label: "收銀 Cash register" },
              {
                value: "breadCakeMaking",
                label: "麵包/蛋糕製作 Bread/cake making",
              },
              {
                value: "frontDeskCustomerService",
                label: "前台/客戶服務 Front desk/customer service",
              },
              { value: "housekeeping", label: "房務 Housekeeping" },
              { value: "makeup", label: "化妝造型 Makeup" },
              { value: "hairstyleDesign", label: "髮型設計 Hairstyle design" },
              { value: "nailService", label: "美甲服務 Nail Service" },
              { value: "beautyService", label: "美容服務 Beauty service" },
              {
                value: "professionalGrade",
                label: "專業職系 Professional grade",
              },
              {
                value: "medicalAssistant",
                label: "醫務助理 Medical assistant",
              },
              { value: "other", label: "其他 Other " },
            ],
          },
        },
        {
          name: "otherJobFunction",
          component: "text",
          label: "其他工作類別 Other Job Function (free text)",
        },
        {
          name: "industry",
          component: "list",
          label: "工作行業 Industry",
          defaultItem: () => "accounting",
          field: {
            component: "select",
            options: [
              { value: "accounting", label: "會計及核數 Accounting " },
              { value: "admin&Hr", label: "行政及人力資源 Admin & HR " },
              {
                value: "banking/Finance",
                label: "銀行/金融 Banking / Finance ",
              },
              {
                value: "beautyCare/Health",
                label: "美容/健康 Beauty Care / Health",
              },
              {
                value: "building&Construction",
                label: "建築/測量/樓宇 Building & Construction ",
              },
              { value: "design", label: "設計 Design" },
              { value: "e-Commerce", label: "電子商務 E-commerce " },
              { value: "education", label: "教育 Education" },
              { value: "engineering", label: "工程 Engineering" },
              { value: "hospitality", label: "酒店/住宿 Hospitality " },
              { value: "f&B", label: "酒店/餐飲 F & B" },
              {
                value: "informationTechnology(It)",
                label: "資訊科技 / 電訊 Information Technology (IT)",
              },
              { value: "insurance", label: "保險 Insurance" },
              { value: "management", label: "管理 Management" },
              { value: "manufacturing", label: "製造 Manufacturing" },
              {
                value: "marketing/PublicRelations",
                label: "市場推廣/廣告/公共關係 Marketing / Public Relations",
              },
              {
                value: "media&Advertising",
                label: "傳媒/印刷/出版 Media & Advertising",
              },
              { value: "medicalServices", label: "醫療服務 Medical Services" },
              {
                value: "merchandising&Purchasing",
                label: "貿易/採購 Merchandising & Purchasing",
              },
              {
                value: "professionalServices",
                label: "專業服務 Professional Services",
              },
              {
                value: "property/RealEstate",
                label: "物業/保安 Property / Real Estate",
              },
              { value: "public/Civil", label: "政府/社會服務 Public / Civil" },
              {
                value: "nonProfit/Community&SocialServices",
                label:
                  "非牟利/社區及公共服務 Non Profit / Community & Social Services ",
              },
              {
                value: "sales,Cs&BusinessDevpt",
                label: "銷售/客戶服務/業務發展 Sales, CS & Business Devpt",
              },
              {
                value: "sciences,Lab,R&D",
                label: "生物科技/化學/科學 Sciences, Lab, R&D",
              },
              { value: "serviceIndustry", label: "服務業 Service Industry " },
              {
                value: "transportation&Logistics",
                label: "運輸/物流/物流/航運/倉儲 Transportation & Logistics",
              },
              { value: "trading", label: "貿易 Trading " },
              {
                value: "artsAndCulture,CreativeIndustry",
                label:
                  "文化／藝術／創意產業 Arts and culture, creative industry",
              },
              { value: "petCare", label: "動物護理 Pet Care " },
              { value: "others", label: "其他 Others" },
            ],
          },
        },
        {
          name: "otherIndustry",
          component: "text",
          label: "其他工作行業 Other industry (free text)",
          field: {
            component: "text",
          },
        },
        {
          name: "applyMethods",
          component: "text",
          label: "申請方法 Apply Methods",
        },
        {
          name: "description",
          component: "html",
          label: "詳情 Description",
        },
        {
          name: "yearOfExperience",
          component: "select",
          label: "年資 Years of Experience",
          options: [
            { value: "0-2", label: "0-2年 0-2 years" },
            { value: "3-5", label: "3-5年 3-5 years" },
            { value: "6-8", label: "6-8年 6-8 years" },
            { value: "9+", label: "9年或以上 9+ years" },
            {
              value: "notRequired",
              label: "無需工作經驗 No experience required ",
            },
          ],
        },
        {
          name: "qualification",
          component: "select",
          label: "資歷 Qualification",
          options: [
            { value: "n/A", label: "沒指定 N/A" },
            { value: "diploma", label: "文憑 Diploma" },
            { value: "higherDiploma", label: "高級文憑 Higher Diploma" },
            { value: "associateDegree", label: "副學士學位 Associate Degree" },
            { value: "degree", label: "學士學位 Degree" },
            { value: "masterOrAbove", label: "碩士學位或以上 Master or above" },
          ],
        },
      ],
    },
  ],
});

import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";

const PAGE_KEY = "jobOpportunities";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {},
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};
const JobOpportunities = ({ page }) => {
  return <>{JSON.stringify({ page })}</>;
};

export default withPageCMS(JobOpportunities, {
  key: PAGE_KEY,
  fields: [
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
              { value: "medicalAssistant", label: "其他 Other " },
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
          name: "description",
          component: "markdown",
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
        {
          name: "remarks",
          component: "markdown",
          label: "詳情 Description",
        },
      ],
    },
  ],
});

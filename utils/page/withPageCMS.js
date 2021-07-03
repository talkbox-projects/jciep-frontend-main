import { useForm, usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import wordListFieldsForCMS from "../tina/wordListFieldsForCMS";
const withPageCMS =
  (Component, { key, fields = [], propName = "page" }) =>
  (props) => {
    const router = useRouter();
    const _page = props?.[propName];
    const [page, form] = useForm(
      {
        key,
        initialValues: _page,
        fields: [
          {
            name: "content.seo",
            component: "group",
            label: "SEO設定 SEO Config",
            fields: [
              {
                name: "title",
                label: "標題 Title",
                component: "text",
              },
              {
                name: "description",
                label: "描述 Description",
                component: "text",
              },
              {
                name: "thumbnail",
                label: "圖標 Thumbnail",
                component: "text",
              },
            ],
          },
          {
            name: "content",
            label: "頁面內容 Page Content",
            component: "group",
            fields: [...fields, wordListFieldsForCMS({ name: "wordings" })],
          },
        ],
        onSubmit: async (values) => {
          const mutation = gql`
            mutation PageUpdate($input: PageUpdateInput) {
              PageUpdate(input: $input) {
                key
                lang
                content
              }
            }
          `;
          values.content.wordings = [
            ...values.content.wordings,

            { key: "mode_freelance", value: "自由工作" },
            { key: "mode_fullTime", value: "全職" },
            { key: "mode_partTime", value: "兼職" },
            {
              key: "location_centralAndWestern",
              value: "中西區",
            },
            { key: "location_eastern", value: "東區" },
            { key: "location_southern", value: "南區" },
            { key: "location_wanChai", value: "灣仔區" },
            { key: "location_shamShuiPo", value: "深水埗區" },
            { key: "location_kowloonCity", value: "九龍城區" },
            { key: "location_kwunTong", value: "觀塘區" },
            { key: "location_wongTaiSin", value: "黃大仙區" },
            { key: "location_yauTsimMong", value: "油尖旺區" },
            { key: "location_islands", value: "離島區" },
            { key: "location_kwaiTsing", value: "葵青區" },
            { key: "location_north", value: "北區" },
            { key: "location_saiKung", value: "西貢區" },
            { key: "location_shaTin", value: "沙田區" },
            { key: "location_taiPo", value: "大埔區" },
            { key: "location_tsuenWan", value: "荃灣區" },
            { key: "location_tuenMun", value: "屯門區" },
            { key: "location_yuenLong", value: "元朗區" },
            { key: "location_unrestricted", value: "地點不限" },
            {
              key: "location_multipleLocation",
              value: "全港各區",
            },
            {
              key: "location_multipleLocation",
              value: "Multiple",
            },
            {
              key: "jobFunction_graphicDesign",
              value: "平面設計",
            },
            {
              key: "jobFunction_illustrationDrawing",
              value: "插畫繪製",
            },
            {
              key: "jobFunction_animationDesign",
              value: "動畫設計",
            },
            { key: "jobFunction_webDesign", value: "網頁設計" },
            { key: "jobFunction_photography", value: "攝影" },
            { key: "jobFunction_filmmaking", value: "影片製作" },
            {
              key: "jobFunction_musicSoundDesign",
              value: "音樂/音效設計",
            },
            { key: "jobFunction_dubbingWork", value: "配音工作" },
            {
              key: "jobFunction_softwareMobileAppDesign",
              value: "軟件/手機應用程式設計",
            },
            {
              key: "jobFunction_mobileComputerGameDesign",
              value: "手機/電腦遊戲設計",
            },
            {
              key: "jobFunction_webpageProduction",
              value: "網頁製作",
            },
            {
              key: "jobFunction_computerProgramming",
              value: "電腦程式編寫",
            },
            {
              key: "jobFunction_computerRepair",
              value: "電腦維修",
            },
            {
              key: "jobFunction_privateTuition",
              value: "私人補習",
            },
            { key: "jobFunction_musicTutor", value: "音樂導師" },
            { key: "jobFunction_artTutor", value: "美術導師" },
            {
              key: "jobFunction_sportsInstructor",
              value: "運動導師",
            },
            {
              key: "jobFunction_performingArtsInstructor",
              value: "表演藝術導師",
            },
            {
              key: "jobFunction_performingArtist",
              value: "表演藝術者",
            },
            {
              key: "jobFunction_magicVaudevilleShow",
              value: "魔術/雜耍表演",
            },
            {
              key: "jobFunction_twistedBalloonService",
              value: "扭波服務",
            },
            {
              key: "jobFunction_activityLeader",
              value: "活動帶領",
            },
            {
              key: "jobFunction_masterOfCeremonies",
              value: "司儀工作",
            },
            {
              key: "jobFunction_promotionActivities",
              value: "活動推廣",
            },
            { key: "jobFunction_prWork", value: "公關工作" },
            {
              key: "jobFunction_eventPlanning",
              value: "活動策劃",
            },
            {
              key: "jobFunction_setProduction",
              value: "佈景製作",
            },
            {
              key: "jobFunction_activityAssistant",
              value: "活動助理",
            },
            {
              key: "jobFunction_trusteeGongAidClassInstructor",
              value: "托管/功輔班導師",
            },
            {
              key: "jobFunction_interestClassTutor",
              value: "興趣班導師",
            },
            {
              key: "jobFunction_eventsOfficer",
              value: "活動幹事",
            },
            {
              key: "jobFunction_teachingAssistant",
              value: "助教",
            },
            { key: "jobFunction_salesJob", value: "銷售工作" },
            { key: "jobFunction_promoter", value: "推廣員" },
            {
              key: "jobFunction_socialMediaManagement",
              value: "社交媒體管理",
            },
            {
              key: "jobFunction_textPromotion",
              value: "文字推廣",
            },
            {
              key: "jobFunction_promotionalEventPlanning",
              value: "推廣活動策劃",
            },
            { key: "jobFunction_waiter", value: "侍應" },
            { key: "jobFunction_waterBar", value: "水吧" },
            {
              key: "jobFunction_coffeeBrewing",
              value: "咖啡沖製",
            },
            { key: "jobFunction_kitchen", value: "廚房" },
            { key: "jobFunction_cashRegister", value: "收銀" },
            {
              key: "jobFunction_breadCakeMaking",
              value: "麵包/蛋糕製作",
            },
            {
              key: "jobFunction_frontDeskCustomerService",
              value: "前台/客戶服務",
            },
            { key: "jobFunction_housekeeping", value: "房務" },
            { key: "jobFunction_makeup", value: "化妝造型" },
            {
              key: "jobFunction_hairstyleDesign",
              value: "髮型設計",
            },
            { key: "jobFunction_nailService", value: "美甲服務" },
            {
              key: "jobFunction_beautyService",
              value: "美容服務",
            },
            {
              key: "jobFunction_professionalGrade",
              value: "專業職系",
            },
            {
              key: "jobFunction_medicalAssistant",
              value: "醫務助理",
            },
            { key: "jobFunction_medicalAssistant", value: "其他" },
            { key: "industry_accounting", value: "會計及核數" },
            { key: "industry_admin&Hr", value: "行政及人力資源" },
            {
              key: "industry_banking/Finance",
              value: "銀行/金融",
            },
            {
              key: "industry_beautyCare/Health",
              value: "美容/健康",
            },
            {
              key: "industry_building&Construction",
              value: "建築/測量/樓宇",
            },
            { key: "industry_design", value: "設計" },
            { key: "industry_e-Commerce", value: "電子商務" },
            { key: "industry_education", value: "教育" },
            { key: "industry_engineering", value: "工程" },
            { key: "industry_hospitality", value: "酒店/住宿" },
            { key: "industry_f&B", value: "酒店/餐飲" },
            {
              key: "industry_informationTechnology(It)",
              value: "資訊科技",
            },
            { key: "industry_insurance", value: "保險" },
            { key: "industry_management", value: "管理" },
            { key: "industry_manufacturing", value: "製造" },
            {
              key: "industry_marketing/PublicRelations",
              value: "市場推廣/廣告/公共關係",
            },
            {
              key: "industry_media&Advertising",
              value: "傳媒/印刷/出版",
            },
            {
              key: "industry_medicalServices",
              value: "醫療服務",
            },
            {
              key: "industry_merchandising&Purchasing",
              value: "貿易/採購",
            },
            {
              key: "industry_professionalServices",
              value: "專業服務",
            },
            {
              key: "industry_property/RealEstate",
              value: "物業/保安",
            },
            {
              key: "industry_public/Civil",
              value: "政府/社會服務",
            },
            {
              key: "industry_nonProfit/Community&SocialServices",
              label: "非牟利/社區及公共服務",
            },
            {
              key: "industry_sales,Cs&BusinessDevpt",
              value: "銷售/客戶服務/業務發展",
            },
            {
              key: "industry_sciences,Lab,R&D",
              value: "生物科技/化學/科學",
            },
            {
              key: "industry_serviceIndustry",
              value: "服務業",
            },
            {
              key: "industry_transportation&Logistics",
              value: "運輸/物流/物流/航運/倉儲",
            },
            { key: "industry_trading", value: "貿易" },
            {
              key: "industry_artsAndCulture,CreativeIndustry",
              label: "文化／藝術／創意產業",
            },
            { key: "industry_petCare", value: "動物護理" },
            { key: "industry_others", value: "其他" },

            { key: "yearOfExperience_0-2", value: "0-2年" },
            { key: "yearOfExperience_3-5", value: "3-5年" },
            { key: "yearOfExperience_6-8", value: "6-8年" },
            { key: "yearOfExperience_9+", value: "9年或以上" },
            {
              key: "yearOfExperience_notRequired",
              value: "無需工作經驗",
            },

            { key: "qualification_n/A", value: "沒指定" },
            { key: "qualification_diploma", value: "文憑" },
            {
              key: "qualification_higherDiploma",
              value: "高級文憑",
            },
            {
              key: "qualification_associateDegree",
              value: "副學士學位",
            },
            { key: "qualification_degree", value: "學士學位" },
            {
              key: "qualification_masterOrAbove",
              value: "碩士學位或以上",
            },
          ];
          const variables = {
            input: {
              key,
              lang: router.locale,
              ...values,
            },
          };
          await getGraphQLClient().request(mutation, variables);
        },
      },
      {
        values: _page,
      }
    );

    usePlugin(form);

    return (
      <Component
        {...{
          ...props,
          [propName]: page,
        }}
      />
    );
  };
export default withPageCMS;

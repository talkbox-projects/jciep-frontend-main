import { Box, Code } from "@chakra-ui/react";
import IdentityPublicProfile from "../../../components/profile/IdentityPublicProfile";
import IdentityPwdProfile from "../../../components/profile/IdentityPwdProfile";
import IdentityStaffProfile from "../../../components/profile/IdentityStaffProfile";
import IdentityEmployerProfile from "../../../components/profile/IdentityEmployerProfile";
import IdentityAdminProfile from "../../../components/profile/IdentityAdminProfile";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import identityMeGet from "../../../utils/api/IdentityMeGet";
import { useRouter } from "next/router";
import React from "react";
import nookies from "nookies";
import { useAppContext } from "../../../store/AppStore";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const cookies = nookies.get(context);
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  {
    /** Redirect to '/app/user/identity/public/add' if user without 'any' Identity  */
  }

  // if(!context.auth){
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/app/user/identity/public/add?redirectFrom=publicUpdatePage"
  //     }
  //   }
  // }

  return {
    props: {
      page,
      api: {
        identity: await identityMeGet(undefined, context),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
      token: cookies["jciep-token"] ?? null,
      identityId: cookies["jciep-identityId"] ?? null,
      cToken: cookies["c-token"] ?? null,
      cIdentityId: cookies["c-identityId"] ?? null,
    },
  };
};

const IdentityProfile = ({
  api: { identity },
  enums,
  page,
  token,
  identityId,
  cToken,
  cIdentityId,
}) => {
  let comp = null;

  switch (identity?.type) {
    case "public":
      comp = <IdentityPublicProfile />;
      break;
    case "admin":
      comp = <IdentityAdminProfile />;
      break;
    default:
      comp = <Box></Box>;
  }

  return (
    <IdentityProfileStore.Provider
      userFieldVisible={true}
      identity={identity}
      enums={enums}
      page={page}
      editable={true}
    >
      <Box w="100%" bgColor="#fafafa">
        <Code fontSize="11px" colorScheme="red">
          {token ? `token:${token}` : "token not found"}
        </Code>
        <br />
        <Code fontSize="11px" colorScheme="red">
          {identityId ? `identityId:${identityId}` : "identityId not found"}
        </Code>
        <br />
        <Code fontSize="11px" colorScheme="red">
          {cToken ? `cToken:${cToken}` : "cToken not found"}
        </Code>
        <br />
        <Code fontSize="11px" colorScheme="red">
          {cIdentityId ? `cIdentityId:${cIdentityId}` : "cIdentityId not found"}
        </Code>
        <br />

        {comp}
      </Box>
    </IdentityProfileStore.Provider>
  );
};

export default withPageCMS(IdentityProfile, {
  key: PAGE_KEY,
  fields: [
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
        {
          name: "createOrganization",
          label: "你有興趣建立關於你的機構檔案嗎 Create Organization Label",
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
        {
          name: "selectOrganization",
          label: "選擇機構 select Organization Label",
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
        {
          name: "selectOrganizationContent",
          label: "機構名單 organization Content Label",
          component: "group",
          fields: [
            {
              name: "content01",
              label: "文本 text",
              component: "text",
            },
            {
              name: "content02",
              label: "文本2 text",
              component: "text",
            },
            {
              name: "link",
              label: "關聯 Link",
              component: "text",
            },
          ],
        },
        {
          name: "invitationCode",
          label: "邀請碼 Invitation Code Label",
          component: "text",
        },
      ],
    },
    {
      name: "step",
      label: "標題 step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "主標題 Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "副標題 Sub title",
          component: "text",
        },
        {
          name: "step2Title",
          label: "步驟二 Title",
          component: "text",
        },
        {
          name: "step2SubTitle",
          label: "步驟二副標題 Sub title",
          component: "text",
        },
        {
          name: "step3Title",
          label: "步驟三 Title",
          component: "text",
        },
        {
          name: "step3SubTitle",
          label: "步驟三副標題 Sub title",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [        {
        name: "createOrganization",
        label: "你有興趣建立關於你的機構檔案嗎 Create Organization Label",
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
      {
        name: "selectOrganization",
        label: "選擇機構 select Organization Label",
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
      {
        name: "selectOrganizationContent",
        label: "機構名單 organization Content Label",
        component: "group",
        fields: [
          {
            name: "content01",
            label: "文本 text",
            component: "text",
          },
          {
            name: "content02",
            label: "文本2 text",
            component: "text",
          },
          {
            name: "link",
            label: "關聯 Link",
            component: "text",
          },
        ],
      },
      {
        name: "invitationCode",
        label: "邀請碼 Invitation Code Label",
        component: "text",
      },]
    }
  ],
  
});

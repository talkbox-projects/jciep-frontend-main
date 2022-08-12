import { Box } from "@chakra-ui/react";
import IdentityPublicProfile from "../../../../components/profile/IdentityPublicProfile";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import IdentityProfileStore from "../../../../store/IdentityProfileStore";
import getSharedServerSideProps from "../../../../utils/server/getSharedServerSideProps";
import identityMeGet from "../../../../utils/api/IdentityMeGet";
import React from "react";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isApp: true,
      api: {
        identity: await identityMeGet(undefined, context),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale
    },
  };
};


const IdentityProfile = ({ api: { identity }, enums, page }) => {
  return (
    <IdentityProfileStore.Provider
      userFieldVisible={true}
      identity={identity}
      enums={enums}
      page={page}
      editable={true}
    >
      <Box w="100%" bgColor="#fafafa">
        <IdentityPublicProfile />
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
      ],
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
});

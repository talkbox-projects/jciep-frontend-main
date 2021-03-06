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
      label: "????????? Header Section",
      name: "headerSection",
      component: "group",
      fields: [
        {
          label: "?????? Banner Banner Placeholder",
          name: "bannerPlaceholder",
          component: "image",
          uploadDir: () => "/user/profile/head-section",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "createOrganization",
          label: "????????????????????????????????????????????? Create Organization Label",
          component: "group",
          fields: [
            {
              name: "label",
              label: "?????? Label",
              component: "text",
            },
            {
              name: "options",
              label: "??????  Options",
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
                  label: "?????? Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "?????? Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "selectOrganization",
          label: "???????????? select Organization Label",
          component: "group",
          fields: [
            {
              name: "label",
              label: "?????? Label",
              component: "text",
            },
            {
              name: "options",
              label: "??????  Options",
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
                  label: "?????? Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "?????? Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "selectOrganizationContent",
          label: "???????????? organization Content Label",
          component: "group",
          fields: [
            {
              name: "content01",
              label: "?????? text",
              component: "text",
            },
            {
              name: "content02",
              label: "??????2 text",
              component: "text",
            },
            {
              name: "link",
              label: "?????? Link",
              component: "text",
            },
          ],
        },
        {
          name: "invitationCode",
          label: "????????? Invitation Code Label",
          component: "text",
        },
      ],
    },
    {
      name: "step",
      label: "?????? step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "????????? Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "????????? Sub title",
          component: "text",
        },
        {
          name: "step2Title",
          label: "????????? Title",
          component: "text",
        },
        {
          name: "step2SubTitle",
          label: "?????????????????? Sub title",
          component: "text",
        },
        {
          name: "step3Title",
          label: "????????? Title",
          component: "text",
        },
        {
          name: "step3SubTitle",
          label: "?????????????????? Sub title",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "?????? Form",
      component: "group",
      fields: [        {
        name: "createOrganization",
        label: "????????????????????????????????????????????? Create Organization Label",
        component: "group",
        fields: [
          {
            name: "label",
            label: "?????? Label",
            component: "text",
          },
          {
            name: "options",
            label: "??????  Options",
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
                label: "?????? Label",
                component: "text",
              },
              {
                name: "value",
                label: "?????? Value",
                component: "text",
              },
            ],
          },
        ],
      },
      {
        name: "selectOrganization",
        label: "???????????? select Organization Label",
        component: "group",
        fields: [
          {
            name: "label",
            label: "?????? Label",
            component: "text",
          },
          {
            name: "options",
            label: "??????  Options",
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
                label: "?????? Label",
                component: "text",
              },
              {
                name: "value",
                label: "?????? Value",
                component: "text",
              },
            ],
          },
        ],
      },
      {
        name: "selectOrganizationContent",
        label: "???????????? organization Content Label",
        component: "group",
        fields: [
          {
            name: "content01",
            label: "?????? text",
            component: "text",
          },
          {
            name: "content02",
            label: "??????2 text",
            component: "text",
          },
          {
            name: "link",
            label: "?????? Link",
            component: "text",
          },
        ],
      },
      {
        name: "invitationCode",
        label: "????????? Invitation Code Label",
        component: "text",
      },]
    }
  ],
  
});

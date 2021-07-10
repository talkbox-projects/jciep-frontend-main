import { Box } from "@chakra-ui/react";
import IdentityPublicProfile from "../../../components/profile/IdentityPublicProfile";
import IdentityPwdProfile from "../../../components/profile/IdentityPwdProfile";
import IdentityStaffProfile from "../../../components/profile/IdentityStaffProfile";
import { useAppContext } from "../../../store/AppStore";
import { getPage } from "../../../utils/page/getPage";
import { getEnums } from "../../../utils/enums/getEnums";
import withPageCMS from "../../../utils/page/withPageCMS";
import IdentityEmployerProfile from "../../../components/profile/IdentityEmployerProfile";
import { useCallback, useEffect, useState } from "react";
import { IdentityProfileProvider } from "../../../utils/profile/identityProfileState";
import ProfileStore from "../../../store/ProfileStore";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import identityGet from "../../../utils/api/IdentityGet";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      api: {
        identity: await identityGet({ id: context.query.id }),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const IdentityProfile = ({ api: { identity }, enums, page, ..._props }) => {
  let comp = null;

  switch (identity?.type) {
    case "pwd":
      comp = <IdentityPwdProfile />;
      break;
    case "public":
      comp = <IdentityPublicProfile />;
      break;
    case "staff":
      comp = <IdentityStaffProfile />;
      break;
    case "employer":
      comp = <IdentityEmployerProfile />;
      break;
    default:
      comp = <Box></Box>;
  }

  return (
    <ProfileStore.Provider identity={identity} enums={enums} page={page}>
      <Box w="100%" bgColor="#fafafa">
        {comp}
      </Box>
    </ProfileStore.Provider>
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
  ],
});

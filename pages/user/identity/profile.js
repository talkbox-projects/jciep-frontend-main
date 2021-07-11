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
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const IdentityProfile = ({ enums, page }) => {
  const { identity, updateIdentity } = useAppContext();
  const editable = true;

  const props = { identity, enums, page, editable };
  let comp = null;

  switch (identity?.type) {
    case "pwd":
      comp = <IdentityPwdProfile {...props} />;
      break;
    case "public":
      comp = <IdentityPublicProfile {...props} />;
      break;
    case "staff":
      comp = <IdentityStaffProfile {...props} />;
      break;
    case "employer":
      comp = <IdentityEmployerProfile {...props} />;
      break;
    default:
      comp = <Box></Box>;
  }

  return (
    <IdentityProfileStore.Provider
      identity={identity}
      enums={enums}
      page={page}
    >
      <Box w="100%" bgColor="#fafafa">
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
      ],
    },
  ],
});

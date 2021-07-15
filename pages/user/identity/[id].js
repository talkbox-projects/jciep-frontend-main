import { Box } from "@chakra-ui/react";
import IdentityPublicProfile from "../../../components/profile/IdentityPublicProfile";
import IdentityPwdProfile from "../../../components/profile/IdentityPwdProfile";
import IdentityStaffProfile from "../../../components/profile/IdentityStaffProfile";
import IdentityEmployerProfile from "../../../components/profile/IdentityEmployerProfile";
import IdentityAdminProfile from "../../../components/profile/IdentityAdminProfile";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import identityGet from "../../../utils/api/IdentityGet";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppContext } from "../../../store/AppStore";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      api: {
        identity: await identityGet({ id: context.query.id }, context),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const IdentityProfile = ({ api: { identity }, enums, page }) => {
  let comp = null;
  const { identity: { id: currentId } = {} } = useAppContext();
  const router = useRouter();
  const editable = currentId === router.query.id;

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
      editable={editable}
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

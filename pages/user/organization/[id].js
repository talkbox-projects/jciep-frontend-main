import { Box } from "@chakra-ui/react";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import organizationGet from "../../../utils/api/OrganizationGet";
import OrganizationNgoProfile from "../../../components/profile/OrganizationNgoProfile";
import OrganizationEmploymentProfile from "../../../components/profile/OrganizationEmploymentProfile";
import { useAppContext } from "../../../store/AppStore";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      api: {
        organization: await organizationGet({ id: context.query.id }, context),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const OrganizationProfile = ({ api: { organization }, enums, page }) => {
  let comp = null;

  const { identityId } = useAppContext();
  const editable = !!(organization?.member ?? []).find((m) => {
    console.log(m?.identity?.id, identityId, m?.role, "staff");
    return (
      m?.identity?.id === identityId &&
      m?.role === "staff" &&
      m?.status === "joined"
    );
  });

  switch (organization?.organizationType) {
    case "ngo":
      comp = <OrganizationNgoProfile />;
      break;
    case "employment":
      comp = <OrganizationEmploymentProfile />;
      break;
    default:
      comp = <Box></Box>;
  }

  return (
    <OrganizationProfileStore.Provider
      userFieldVisible={true}
      organization={organization}
      enums={enums}
      page={page}
      editable={editable}
    >
      <Box w="100%" bgColor="#fafafa">
        {comp}
      </Box>
    </OrganizationProfileStore.Provider>
  );
};

export default withPageCMS(OrganizationProfile, {
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

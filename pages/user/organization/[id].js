import { Box } from "@chakra-ui/react";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import organizationGet from "../../../utils/api/organizationGet";
import OrganizationNgoProfile from "../../../components/profile/OrganizationNgoProfile";
import OrganizationCompanyProfile from "../../../components/profile/OrganizationCompanyProfile";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      api: {
        organization: await organizationGet({ id: context.query.id }),
      },
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const OrganizationProfile = ({ api: { organization }, enums, page }) => {
  let comp = null;

  switch (organization?.organizationType) {
    case "ngo":
      comp = <OrganizationNgoProfile />;
      break;
    case "company":
      comp = <OrganizationCompanyProfile />;
      break;
    default:
      comp = <Box>fdsa</Box>;
  }

  return (
    <OrganizationProfileStore.Provider
      organization={organization}
      enums={enums}
      page={page}
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

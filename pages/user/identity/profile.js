import { Box } from "@chakra-ui/react";
import IdentityPublicProfile from "../../../components/profile/IdentityPublicProfile";
import IdentityPwdProfile from "../../../components/profile/IdentityPwdProfile";
import IdentityStaffProfile from "../../../components/profile/IdentityStaffProfile";
import { useAppContext } from "../../../store/AppStore";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { getPage } from "../../../utils/page/getPage";
import { getEnums } from "../../../utils/enums/getEnums";
import withPageCMS from "../../../utils/page/withPageCMS";
import IdentityEmployerProfile from "../../../components/profile/IdentityEmployerProfile";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const enums =
    (await getEnums({
      keys: [
        "EnumGenderList",
        "EnumDistrictList",
        "EnumIndustryList",
        "EnumEmploymentModeList",
        "EnumIdentityTypeList",
        "EnumWrittenLanguageList",
        "EnumOralLanguageList",
        "EnumYearOfExperienceList",
        "EnumDegreeList",
        "EnumSkillList",
        "EnumPwdTypeList",
      ],
      lang: context.locale,
    })) ?? {};

  return {
    props: {
      page,
      enums,
      isLangAvailable: context.locale === page.lang,
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
      lang: context.locale,
    },
  };
};

const IdentityProfile = ({ enums, page }) => {
  const { identity } = useAppContext();
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
    <Box w="100%" bgColor="#fafafa">
      {comp}
    </Box>
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

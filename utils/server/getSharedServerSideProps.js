import environmentSettingGet from "../api/EnvironmentSettingGet";
import { getConfiguration } from "../configuration/getConfiguration";
import { getEnums } from "../enums/getEnums";

const getSharedServerSideProps = async (context) => {
  const getConfigurations = async (keys) => {
    return await (
      await Promise.all(
        keys.map((key) => getConfiguration({ key, lang: context.locale }))
      )
    ).reduce((_o, configuration, index) => {
      return {
        ..._o,
        [keys[index]]: configuration,
      };
    }, {});
  };

  return {
    props: {
      enums:
        (await getEnums({
          keys: [
            "EnumGenderList",
            "EnumDistrictList",
            "EnumInterestedIndustryList",
            "EnumEmploymentModeList",
            "EnumIdentityTypeList",
            "EnumWrittenLanguageList",
            "EnumOralLanguageList",
            "EnumYearOfExperienceList",
            "EnumDegreeList",
            "EnumSkillList",
            "EnumPwdTypeList",
            "EnumOrganizationStatusList",
            "EnumJoinRoleList",
            "EnumJoinStatusList",
            "EnumOrganizationTypeList",
            "EnumServiceTargetList",
            "EnumPublishStatusList",
          ],
          lang: context.locale,
        })) ?? {},
      ...(await getConfigurations([
        "setting",
        "header",
        "footer",
        "navigation",
        "wordings",
      ])),
      // environmentSetting: await environmentSettingGet(),
    },
  };
};

export default getSharedServerSideProps;

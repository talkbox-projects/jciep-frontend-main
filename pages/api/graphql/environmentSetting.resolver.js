import { getConfig } from "next/config";

const { publicRuntimeConfig } = getConfig();

export default {
  Query: {
    EnvironmentSettingGet: async () => {
      return {
        facebookAppId: publicRuntimeConfig.FACEBOOK_APP_ID,
        facebookAppRedirectUri: publicRuntimeConfig.FACEBOOK_APP_REDIRECT_URI,
        googleClientId: publicRuntimeConfig.GOOGLE_CLIENT_ID,
      };
    },
  },
};

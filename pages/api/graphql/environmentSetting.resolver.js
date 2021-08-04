export default {
  Query: {
    EnvironmentSettingGet: async () => {
      return {
        facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        facebookAppRedirectUri:
          process.env.NEXT_PUBLIC_FACEBOOK_APP_REDIRECT_URI,
        googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      };
    },
  },
};

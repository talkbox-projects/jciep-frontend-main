import appleSignIn from "apple-signin-auth";

export default {
  getProfile: async (accessToken) => {
    try {
      const user = await appleSignIn.verifyIdToken(accessToken, {
        audience: "com.talkboxapp.teamwork.service.hku",

        ignoreExpiration: true,
      });

      return {
        id: user.sub,
        displayName: "",
        profilePicUrl: "",
      };
    } catch (err) {
      // Token is not verified
      console.error(err);
    }
  },
};

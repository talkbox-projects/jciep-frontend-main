import appleSignIn from "apple-signin-auth";

export default {
  getProfile: async (accessToken, platform) => {
    const audience = platform === 'ios' ? "hk.hkuinclusive.inmatch" : "hk.hkuinclusive.inmatch.applesignin"
    try {
      const user = await appleSignIn.verifyIdToken(accessToken, {
        audience: audience,
        ignoreExpiration: true,
      });

      return {
        id: user.sub,
        displayName: "",
        profilePicUrl: "",
      };
    } catch (err) {
      console.error(err);
    }
  },
};
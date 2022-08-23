import appleSignIn from "apple-signin-auth";

export default {
  getProfile: async (accessToken) => {
    try {
      const user = await appleSignIn.verifyIdToken(accessToken, {
        audience: "hk.hkuinclusive.inmatch"
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
import axios from "axios";

export default {
  getProfile: async (accessToken) => {
    const { data: response } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const snsMeta = {
      id: response.id,
      displayName: response.name,
      profilePicUrl: response.picture,
    };
    return snsMeta;
  },
};

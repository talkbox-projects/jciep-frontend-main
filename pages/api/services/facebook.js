import axios from "axios";

export default {
  getProfile: async (accessToken) => {
    try {
      const { data: { id, name: displayName } = {} } = await axios.get(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name`
      );
      const { data: { data: { url: profilePicUrl } } = {} } = await axios.get(
        `https://graph.facebook.com/v11.0/${id}/picture?format=json&format=json&method=get&pretty=0&redirect=false&suppress_http_code=1&transport=cors&type=large`
      );
      return {
        id,
        displayName,
        profilePicUrl,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
};

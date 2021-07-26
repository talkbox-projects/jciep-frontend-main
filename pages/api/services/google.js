const { default: axios } = require("axios");
const request = require("requests");

exports.getProfile = async (accessToken) => {
  try {
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
  } catch (e) {
    throw e;
  }
};

//uri: `https://www.googleapis.com/plus/v1/people/me?access_token=${accessToken}`

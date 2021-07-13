const request = require('requests');

exports.getProfile = async (accessToken) => {
  try {
    return new Promise((resolve, reject) => request(
      `https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      } )
      .on('data', (data) => {
        return resolve(JSON.parse(data))
      })
      .on('end' , (err) => {
        return reject(err)
      })
    );
  } catch (e) {
    throw e;
  }
};


//uri: `https://www.googleapis.com/plus/v1/people/me?access_token=${accessToken}`

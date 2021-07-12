const request = require('requests');

exports.getProfile = async (accessToken) => {
  try {
    return new Promise((resolve, reject) => request(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`, {} )
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

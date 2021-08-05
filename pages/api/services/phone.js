import request from "request";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const gateways = {
  production: async (phone, message) => {
    try {
      const url = "https://vercode.accessyou-anyip.com/sms/sendsms-vercode.php";
      const accountno = serverRuntimeConfig.SMS_ACCOUNT;
      const user = serverRuntimeConfig.SMS_USERNAME;
      const pwd = serverRuntimeConfig.SMS_PASSWORD;
      const countryCode = "852";

      const requestUrl = `${url}?accountno=${accountno}&user=${user}&pwd=${pwd}&phone=${countryCode}${phone}&msg=${message}`;

      const options = {
        method: "GET",
        url: requestUrl,
      };

      const response = await request(options);

      return true;
    } catch (error) {
      return false;
    }
  },

  development: async (phone, message) => {
    try {
      const url = "https://vercode.accessyou-anyip.com/sms/sendsms-vercode.php";
      const accountno = serverRuntimeConfig.SMS_ACCOUNT;
      const user = serverRuntimeConfig.SMS_USERNAME;
      const pwd = serverRuntimeConfig.SMS_PASSWORD;
      const countryCode = "852";

      const requestUrl = `${url}?accountno=${accountno}&user=${user}&pwd=${pwd}&phone=${countryCode}${phone}&msg=${message}`;

      const options = {
        method: "GET",
        url: requestUrl,
      };

      const response = await request(options);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default gateways[publicRuntimeConfig.NODE_ENV];

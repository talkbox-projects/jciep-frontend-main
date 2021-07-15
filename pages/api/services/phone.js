import request from "request";

const gateways = {
  production: (phone, message) => {
    try {
      const url = "https://vercode.accessyou-anyip.com/sms/sendsms-vercode.php";
      const accountno = process.env.SMS_ACCOUNT;
      const user = process.env.SMS_USERNAME;
      const pwd = process.env.SMS_PASSWORD;
      const countryCode = "852";

      const requestUrl = `${url}?accountno=${accountno}&user=${user}&pwd=${pwd}&phone=${countryCode}${phone}&msg=${message}`;

      const options = {
        method: "GET",
        url: requestUrl,
      };

      const response = request(options);

      return true;
    } catch (error) {
      return false;
    }
  },

  development: (phone, message) => {
    try {
      const url = "https://vercode.accessyou-anyip.com/sms/sendsms-vercode.php";
      const accountno = process.env.SMS_ACCOUNT;
      const user = process.env.SMS_USERNAME;
      const pwd = process.env.SMS_PASSWORD;
      const countryCode = "852";

      const requestUrl = `${url}?accountno=${accountno}&user=${user}&pwd=${pwd}&phone=${countryCode}${phone}&msg=${message}`;

      const options = {
        method: "GET",
        url: requestUrl,
      };

      const response = request(options);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default gateways[process.env.NODE_ENV];

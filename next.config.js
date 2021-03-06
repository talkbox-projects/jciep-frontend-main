/* eslint-disable no-undef */

module.exports = {
  serverRuntimeConfig: {
    MONGODB_URL: process.env.MONGODB_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_SENDER: process.env.SMTP_SENDER,
    SMS_ACCOUNT: process.env.SMS_ACCOUNT,
    SMS_USERNAME: process.env.SMS_USERNAME,
    SMS_PASSWORD: process.env.SMS_PASSWORD,
    JWT_SALT: process.env.JWT_SALT,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
  },
  publicRuntimeConfig: {
    HOST_URL: process.env.HOST_URL,
    NODE_ENV: process.env.NODE_ENV,
    FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,

    FACEBOOK_APP_REDIRECT_URI:
      process.env.NEXT_PUBLIC_FACEBOOK_APP_REDIRECT_URI,
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
    localeDetection: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: "file-loader",
        },
      ],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

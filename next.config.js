module.exports = {
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
    localeDetection: false,
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

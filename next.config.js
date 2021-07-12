module.exports = {
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
    localeDetection: false,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.html/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "html-loader",
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

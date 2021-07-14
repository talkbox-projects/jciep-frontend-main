module.exports = {
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
    localeDetection: false,
  },
  webpack: (config, options) => {
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

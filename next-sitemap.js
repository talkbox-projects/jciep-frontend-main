/**
 *  Reference
 *  1. hreflang 639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes and https://developers.google.com/search/docs/advanced/crawling/localized-versions
 *  2. next-sitemap https://github.com/iamvishnusankar/next-sitemap#readme
 *  3. simple chinese tutoial : https://happyjayxin.medium.com/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-next-js-%E7%94%9F%E6%88%90%E5%8B%95%E6%85%8B-sitemap-9ce57b145a99
 *  4. Inject environment variables https://github.com/iamvishnusankar/next-sitemap/issues/38
 */ 

/* eslint-disable no-undef */
const siteUrl = process.env.HOST_URL || "https://localhost:3000";

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  exclude: ["/blank", "/user*", "/admin*", "/oauth*"],
  alternateRefs: [
    {
      href: siteUrl + "/en",
      hreflang: "en",
    },
    {
      href: siteUrl + "/zh",
      hreflang: "zh",
    },
  ],

  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};



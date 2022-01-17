/**
 * Reference :
 * 1. For knowing globby, https://blog.logrocket.com/build-sitemap-generator-nextjs/
 * 2. For knowing the appoach of having sitemap.xml.js in page folder, https://cheatcode.co/tutorials/how-to-generate-a-dynamic-sitemap-with-next-js
 * 3. For hreflang: https://developers.google.com/search/docs/advanced/crawling/localized-versions#sitemap
 * 4. For hreflang, refer 639-1 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes and https://developers.google.com/search/docs/advanced/crawling/localized-versions
 * 5. application/xml https://en.wikipedia.org/wiki/XML_and_MIME
 */

import { globby } from "globby";

import getConfig from "next/config";

function addPage(page, locales) {
  const hostUrl = getConfig().publicRuntimeConfig.HOST_URL;

  const path = page.replace("pages", "").replace(".js", "").replace(".mdx", "");
  const hasSlug = path.includes("[slug]");
  if (hasSlug) return null;

  const route = path.replace("/index", "");

  return `
    <url>
      <loc>${`${hostUrl}${route}`}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>

      ${locales
        .map((locale) => {
          return `
        <xhtml:link
        rel="alternate"
        hreflang="${locale}"
        href="${hostUrl}/${locale}${route}"/>`;
        })
        .join("")}
    </url>
    `;
}

export const getServerSideProps = async (ctx) => {
  const { res, locales } = ctx;
  const pages = await globby([
    "pages/**/*{.js,.mdx}",
    "!pages/_*.js",
    "!pages/api",
    "!pages/oauth",
    "!pages/admin",
    "!pages/blank.js",
    "!pages/user",
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pages.map((page) => addPage(page, locales)).join("\n")}
  </urlset>
`;

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const Sitemap = () => {};

export default Sitemap;

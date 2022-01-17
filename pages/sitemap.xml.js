/**
 * Reference :
 * 1. For knowing globby, https://blog.logrocket.com/build-sitemap-generator-nextjs/
 * 2. For knowing the appoach of having sitemap.xml.js in page folder, https://cheatcode.co/tutorials/how-to-generate-a-dynamic-sitemap-with-next-js
 */

import { globby } from "globby";

import getConfig from "next/config";

function addPage(page) {
  const hostUrl = getConfig().publicRuntimeConfig.HOST_URL;

  const path = page.replace("pages", "").replace(".js", "").replace(".mdx", "");
  const route = path === "/index" ? "" : path;
  return `<url>
      <loc>${`${hostUrl}${route}`}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>`;
}

export const getServerSideProps = async ({ res }) => {
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
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(addPage).join("\n")}
  </urlset>
`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const Sitemap = () => {};

export default Sitemap;


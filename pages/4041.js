import { getConfiguration } from "../utils/configuration/getConfiguration";
import { getPage } from "../utils/page/getPage";

const PAGE_KEY = "404";

// export const getStaticProps = async (context) => {
//   return {
//     props: {
//       page: await getPage({ key: PAGE_KEY, lang: context.locale }) ?? {},
//       wordings: await getConfiguration({
//         key: "wordings",
//         lang: context.locale,
//       }),
//       header: await getConfiguration({ key: "header", lang: context.locale }),
//       footer: await getConfiguration({ key: "footer", lang: context.locale }),
//       navigation: await getConfiguration({
//         key: "navigation",
//         lang: context.locale,
//       }),
//     },
//   };
// };

const Custom404 = () => {
  return (
    <>
      <h1>404 - Page Not Found</h1>
    </>
  );
};

export default Custom404;

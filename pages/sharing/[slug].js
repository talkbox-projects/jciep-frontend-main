import { useRouter } from "next/router";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPost } from "../../utils/post/getPost";
import withPostCMS from "../../utils/post/withPostCMS";
import sharingFieldsForCMS from "../../utils/tina/sharingFieldsForCMS";

const PAGE_KEY = "sharing";

export const getServerSideProps = async (context) => {
  return {
    props: {
      post: await getPost({
        idOrSlug: context.params.slug,
        lang: context.locale,
      }),
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const PostDetail = ({ post, setting }) => {
  const categories = setting?.value?.categories;
  const router = useRouter();
  return (
    <>
      {JSON.stringify(post)}
      {JSON.stringify(categories)}
    </>
  );
};

export default withPostCMS(
  withPageCMS(PostDetail, {
    key: PAGE_KEY,
    fields: sharingFieldsForCMS,
  })
);

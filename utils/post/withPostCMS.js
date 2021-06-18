import { useForm, usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useEffect } from "react";
const withPostCMS =
  (Component, { propName = "post" } = {}) =>
  (props) => {
    const router = useRouter();
    const _post = props?.[propName];

    const categories = props?.setting?.value?.categories ?? [];
    const [post, form] = useForm({
      key: router.query.idOrSlug,
      initialValues: _post,
      fields: [
        {
          name: "slug",
          label: "後綴路由 Slug",
          component: "text",
          description: "This post route would be /sharing/{slug}",
        },
        {
          name: "lang",
          component: "select",
          label: "語言",
          options: [
            { value: "en", label: "English" },
            { value: "zh", label: "繁體中文" },
          ],
          defaultValue: "zh",
        },
        {
          name: "publishDate",
          label: "發佈日期 Publish Date",
          component: "date",
          dateFormat: "MMMM DD YYYY",
          timeFormat: true,
        },
        {
          name: "status",
          component: "select",
          label: "狀態",
          options: [
            { value: "published", label: "己發佈 Published" },
            { value: "draft", label: "草稿 Draft" },
            { value: "removed", label: "己刪除 Removed" },
          ],
          defaultValue: "draft",
        },
        {
          name: "category",
          label: "分類 Category",
          component: "select",
          defaultValue: "",
          options: [
            { value: "notSpecified", label: "無 N/A" },
            ...categories.map(({ key, label: { en, zh } }) => ({
              value: key,
              label: `${en} ${zh}`,
            })),
          ],
        },
        {
          name: "title",
          label: "標題 Title",
          component: "text",
        },
        {
          name: "excerpt",
          label: "概述 Excerpt",
          component: "textarea",
        },
        {
          name: "tag",
          label: "標籤 Tags",
          component: "list",
          field: {
            component: "text",
          },
        },
      ],
      onSubmit: async (values) => {
        const mutation = gql`
          mutation PostUpdate($input: PostUpdateInput) {
            PostUpdate(input: $input) {
              id
              slug
              lang
              title
              excerpt
              publishDate
              status
              tag
              category
              content
            }
          }
        `;
        const variables = {
          input: values,
        };
        await getGraphQLClient().request(mutation, variables);
      },
    });

    usePlugin(form);

    return (
      <Component
        {...{
          ...props,
          [propName]: post,
        }}
      />
    );
  };
export default withPostCMS;

import { useForm, usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useEffect } from "react";
const withPageCMS =
  (Component, { key, fields = [], propName = "page" }) =>
  (props) => {
    const router = useRouter();
    const _page = props?.[propName];
    const [page, form] = useForm({
      key,
      initialValues: _page,
      fields: [
        {
          name: "seo",
          component: "group",
          label: "SEO設定 SEO Config",
          fields: [
            {
              name: "title",
              label: "標題 Title",
              component: "text",
            },
            {
              name: "description",
              label: "描述 Description",
              component: "text",
            },
            {
              name: "thumbnail",
              label: "圖標 Thumbnail",
              component: "text",
            },
          ],
        },
        {
          name: "content",
          label: "頁面內容 Page Content",
          component: "group",
          fields: [
            ...fields,
            {
              name: "wordings",
              component: "group-list",
              label: "字串 Static Wordings",
              description: "Store all the static wordings for this page",
              itemProps: ({ id: key, key: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "key",
                  label: "辨別碼 Key",
                  component: "text",
                },
                {
                  name: "value",
                  label: "字串 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
      ],
      onSubmit: async (values) => {
        const mutation = gql`
          mutation PageUpdate($input: PageUpdateInput) {
            PageUpdate(input: $input) {
              key
              lang
              title
              description
              content
            }
          }
        `;
        const variables = {
          input: {
            key,
            lang: router.locale,
            ...values,
          },
        };
        await getGraphQLClient().request(mutation, variables);
      },
    });

    usePlugin(form);

    return (
      <Component
        {...{
          ...props,
          [propName]: page,
        }}
      />
    );
  };
export default withPageCMS;

import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useForm, useFormScreenPlugin } from "tinacms";

export const useWordingLists = ({ lists, key = "wordings", initialValue }) => {
  const router = useRouter();
  const lang = router.locale;
  const [wordings, form] = useForm({
    key,
    label: "字串 Wording List",
    initialValues: initialValue,
    fields: lists.map(({ name, label, description }) => ({
      name,
      component: "group-list",
      description,
      label,
      description: "Store all the static wordings for this page",
      itemProps: ({ id: key, key: _label }) => ({
        key,
        label: _label,
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
    })),
    onSubmit: async (value) => {
      const mutation = gql`
        mutation ConfigurationUpdate($input: ConfigurationUpdateInput) {
          ConfigurationUpdate(input: $input) {
            key
            value
          }
        }
      `;
      const variables = {
        input: {
          key: "wordings",
          lang,
          value,
        },
      };
      await getGraphQLClient().request(mutation, variables);
    },
  });

  useFormScreenPlugin(form, "", "fullscreen");

  return wordings;
};

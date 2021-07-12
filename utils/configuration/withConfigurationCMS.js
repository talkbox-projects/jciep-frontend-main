import { useForm, usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useFormScreenPlugin } from "tinacms";

const withConfigurationCMS =
  (Component, { key, label, fields = [], propName = key }, context) =>
  (props) => {
    const router = useRouter();
    const lang = router.locale;
    const _configuration = props?.[propName];
    const [configuration, form] = useForm(
      {
        key,
        label,
        initialValues: _configuration?.value,
        fields: [...fields],
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
              key,
              lang,
              value,
            },
          };
          await getGraphQLClient(context).request(mutation, variables);
        },
      },
      {
        values: _configuration?.value,
      }
    );

    useFormScreenPlugin(form);

    return (
      <Component
        {...{
          ...props,
          [propName]: configuration,
        }}
      />
    );
  };
export default withConfigurationCMS;

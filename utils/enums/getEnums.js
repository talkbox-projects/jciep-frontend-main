import { gql } from "graphql-request";
import { getGraphQLClient } from "../../utils/apollo";

const properize = (text) => {
  return text
    .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
    .replace(/\s+/g, "");
};

export const getEnums = async ({ keys = [], lang }, context) => {
  let res = undefined;
  const query = gql`
    query {
        ${keys.map((queryName) => {
          return `
                ${queryName} {
                    key
                    value {
                        ${lang}
                    }
                }
            `;
        })}
    }
  `;

  res = await getGraphQLClient(context).request(query);

  return res;
};

export const getEnumText = (list, value, locale) => {
  return list?.find((x) => x.key === value)?.value?.[locale];
};

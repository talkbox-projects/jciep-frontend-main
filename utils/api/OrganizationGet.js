import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const organizationGet = async ({ id }) => {
  const query = gql`
    query OrganizationGet($id: ID!) {
      OrganizationGet(id: $id) {
        id
        organizationType
        status
        chineseCompanyName
        englishCompanyName
        logo {
          id
          contentType
          fileSize
          url
        }
        website
        businessRegistration {
          id
          contentType
          fileSize
          url
        }
        industry
        district
        companyBenefit
        biography
        portfolio {
          file {
            id
            contentType
            fileSize
            url
          }
          videoUrl
          title
          description
        }
        member {
          identity {
            chineseName
            englishName
          }
          email
          status
          role
        }
        contactName
        contactPhone
        contactEmail
        description

        tncAccept
      }
    }
  `;

  const data = await getGraphQLClient().request(query, { id });

  return data?.OrganizationGet;
};

export default organizationGet;

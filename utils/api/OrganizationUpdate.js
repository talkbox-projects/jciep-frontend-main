import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const organizationUpdate = async ({ input }) => {
  const query = gql`
    mutation OrganizationUpdate($input: OrganizationUpdateInput!) {
      OrganizationUpdate(input: $input) {
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

  const data = await getGraphQLClient().request(query, { input });

  return data?.OrganizationUpdate;
};

export default organizationUpdate;

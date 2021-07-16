import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const organizationUpdate = async ({ input }, context) => {
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
        industryOther
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
          identityId
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
        invitationCode
        published

        submission {
          id
          status
          createdAt
          updatedAt
          vettedAt

          chineseCompanyName
          englishCompanyName

          # employer only
          industry
          # employer only
          industryOther

          description
          website
          businessRegistration {
            url
          }

          contactName
          contactEmail
          contactPhone
          remark
        }
      }
    }
  `;

  const data = await getGraphQLClient(context).request(query, { input });

  return data?.OrganizationUpdate;
};

export default organizationUpdate;

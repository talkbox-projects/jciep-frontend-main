import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const organizationSearch = async ({ status, type, name }, context) => {
  const query = gql`
    query OrganizationSearch(
      $status: [EnumOrganizationStatus]
      $type: [EnumOrganizationType]
      $name: String
    ) {
      OrganizationSearch(status: $status, type: $type, name: $name) {
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
            id
            chineseName
            englishName
            profilePic {
              url
            }
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

        submission {
          id
          status
          createdAt
          updatedAt
          vettedAt

          chineseCompanyName
          englishCompanyName
          industry
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

  const data = await getGraphQLClient(context).request(query, {
    name,
    status,
    type,
  });

  return data?.OrganizationSearch;
};

export default organizationSearch;

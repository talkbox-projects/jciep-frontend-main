import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const organizationGet = async ({ id }, context) => {
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
        industryOther
        district
        companyBenefit
        bannerMedia {
          file {
            id
            url
            contentType
            fileSize
          }
          videoUrl
          title
          description
        }
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
            publishStatus
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
        published

        missionNVision
        # targetGroup
        # targetGroupDisabilities
        # targetGroupDisabilitiesOther

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

          missionNVision
          targetGroup
          # targetGroupDisabilities
          # targetGroupDisabilitiesOther

          contactName
          contactEmail
          contactPhone
          remark
        }
      }
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.OrganizationGet;
};

export default organizationGet;

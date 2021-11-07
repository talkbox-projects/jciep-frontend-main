import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const organizationIdentityGet = async ({ organizationId, identityId }, context) => {
  const query = gql`
    query OrganizationIdentityGet($organizationId: ID!, $identityId: ID!) {
      OrganizationIdentityGet(organizationId: $organizationId, identityId: $identityId) {
        id
        type
        publishStatus
        chineseName
        englishName
        dob
        gender
        district
        pwdType
        interestedEmploymentMode
        interestedIndustry
        interestedIndustryOther
        industry
        industryOther
        tncAccept
        published
        email
        phone
        profilePic {
          id
          url
          contentType
          fileSize
        }
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
        educationLevel
        yearOfExperience
        biography
        portfolio {
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
        caption
        writtenLanguage
        writtenLanguageOther
        oralLanguage
        oralLanguageOther
        skill
        skillOther
        hobby
        education {
          school
          degree
          fieldOfStudy
          startDatetime
          endDatetime
          present
        }
        employment {
          employmentType
          companyName
          jobTitle
          industry
          industryOther
          startDatetime
          endDatetime
          present
        }
        activity {
          name
          description
          startDatetime
          endDatetime
        }
        organizationRole {
          organization {
            id
            logo {
              url
            }
            chineseCompanyName
            englishCompanyName
          }
          status
          role
        }
      }
    }
  `;

  const data = await getGraphQLClient(context).request(query, { organizationId, identityId });

  return data?.OrganizationIdentityGet;
};

export default organizationIdentityGet;

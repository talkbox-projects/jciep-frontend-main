import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const adminIdentitySearch = async (
  {
    limit,
    page,
    organizationId,
    identityType,
    publishStatus,
    published,
    name,
    days,
  },
  context
) => {
  const query = gql`
    query AdminIdentitySearch(
      $limit: Int!
      $page: Int!
      $organizationId: ID
      $identityType: [EnumIdentityType]
      $publishStatus: [EnumPublishStatus]
      $name: String
      $days: String
      $published: Boolean
    ) {
      AdminIdentitySearch(
        limit: $limit
        page: $page
        organizationId: $organizationId
        identityType: $identityType
        publishStatus: $publishStatus
        published: $published
        name: $name
        days: $days
      ) {
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
        createdAt
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

  const data = await getGraphQLClient(context).request(query, {
    page,
    limit,
    organizationId,
    identityType,
    publishStatus,
    name,
    published,
    days,
  });

  return data?.AdminIdentitySearch;
};

export default adminIdentitySearch;

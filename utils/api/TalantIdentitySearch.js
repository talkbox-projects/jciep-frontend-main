import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const talantIdentitySearch = async (
  {
    limit,
    page,
    organizationId,
    jobType,
    jobInterested
  },
  context
) => {
  const query = gql`
    query TalantIdentitySearch(
      $limit: Int!
      $page: Int!
      $organizationId: ID
      $jobType: String
      $jobInterested: String
    ) {
      TalantIdentitySearch(
        limit: $limit
        page: $page
        organizationId: $organizationId
        jobType: $jobType
        jobInterested: $jobInterested
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
    jobType,
    jobInterested
  });

  return data?.TalantIdentitySearch;
};

export default talantIdentitySearch;

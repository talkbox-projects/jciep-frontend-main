import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const identitySearch = async (
  { limit, page, organizationId, identityType, published, name },
  context
) => {
  const query = gql`
    query IdentitySearch(
      $limit: Int!
      $page: Int!
      $organizationId: ID
      $identityType: [EnumIdentityType]
      $name: String
      $published: Boolean
    ) {
      IdentitySearch(
        limit: $limit
        page: $page
        organizationId: $organizationId
        identityType: $identityType
        published: $published
        name: $name
      ) {
        id
        type
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
    name,
    published,
  });

  return data?.IdentitySearch;
};

export default identitySearch;

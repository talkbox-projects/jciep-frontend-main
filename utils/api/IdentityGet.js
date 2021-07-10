import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const identityGet = async ({ id }) => {
  const query = gql`
    query IdentityGet($id: ID!) {
      IdentityGet(id: $id) {
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
      }
    }
  `;

  const data = await getGraphQLClient().request(query, { id });

  return data?.IdentityGet;
};

export default identityGet;

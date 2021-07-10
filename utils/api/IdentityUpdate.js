import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const identityUpdate = async ({ input }) => {
  const query = gql`
    mutation IdentityUpdate($input: IdentityUpdateInput!) {
      IdentityUpdate(input: $input) {
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

  const data = await getGraphQLClient().request(query, { input });

  return data?.IdentityUpdate;
};

export default identityUpdate;

import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const identityMeGet = async (params, context) => {
  const query = gql`
    query IdentityMeGet {
      IdentityMeGet {
        id
        type
        publishStatus
        chineseName
        englishName
        dob
        age
        gender
        district
        pwdType
        pwdOther
        wishToDo
        wishToDoOther
        interestedEmploymentMode
        interestedIndustry
        currentIndustry
        interestedIndustryOther
        industry
        industryOther
        tncAccept
        appTncAccept
        published
        phase2profile
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

  const data = await getGraphQLClient(context).request(query);

  return data?.IdentityMeGet;
};

export default identityMeGet;

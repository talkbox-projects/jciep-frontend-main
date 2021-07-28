import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const userLogin = async ({ input }, context) => {
  const mutation = gql`
  mutation UserLogin($input: LoginInput) {
    UserLogin(input: $input) {
      token
      user {
        id
        email
        phone
        facebookId
        googleId
        appleId
        snsMeta {
          profilePicUrl
          displayName
        }
        identities {
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
          industryOther
          tncAccept
          published
          email
          phone
          organizationRole {
            organization {
              id
            },
            status
            role
          }
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
          writtenLanguage
          writtenLanguageOther
          oralLanguage
          oralLanguageOther
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
        }
      }
    }
  }
  `;

  const data = await getGraphQLClient(context).request(mutation, { input});

  return data?.UserLogin;
};

export default userLogin;

import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const userGet = async ({ token }, context) => {
  const mutation = gql`
    mutation UserGet($token: String!) {
      UserGet(token: $token) {
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
          organizationRole {
            organization {
              id
            }
            status
            role
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
  `;

  const data = await getGraphQLClient(context).request(mutation, { token });

  return data?.UserGet;
};

export default userGet;

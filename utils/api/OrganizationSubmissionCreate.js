import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationSubmissionCreate = async ({ input }, context) => {
  const query = gql`
    mutation OrganizationSubmissionCreate(
      $input: OrganizationSubmissionCreateInput!
    ) {
      OrganizationSubmissionCreate(input: $input) {
        id
        status
        createdAt
        updatedAt
        vettedAt

        chineseCompanyName
        englishCompanyName

        # employer only
        industry
        # employer only
        industryOther

        missionNVision
        targetGroup
        targetGroupDisabilities
        targetGroupDisabilitiesOther

        description
        website
        businessRegistration {
          url
        }

        remark
        contactName
        contactEmail
        contactPhone
      }
    }
  `;

  const data = await getGraphQLClient(context).request(query, { input });

  return data?.OrganizationSubmissionCreate;
};

export default OrganizationSubmissionCreate;

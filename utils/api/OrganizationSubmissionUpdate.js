import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationSubmissionUpdate = async ({ input }, context) => {
  const query = gql`
    mutation OrganizationSubmissionUpdate(
      $input: OrganizationSubmissionUpdateInput!
    ) {
      OrganizationSubmissionUpdate(input: $input) {
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

  return data?.OrganizationSubmissionUpdate;
};

export default OrganizationSubmissionUpdate;

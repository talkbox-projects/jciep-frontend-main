export default {
  Query: {
    UserEmailValidityCheck: async (_parent, params) => {},

    OrganizationGet: async () => {
      /**
       * Get Organization By Id
       */
    },

    OrganizationSearch: async () => {
      /**
       * Search Organization
       * Admin can access to all organization
       * other identity can only access to approved organization
       */
    },
  },
  Mutation: {
    OrganizationSubmissionCreate: async (_parent, params) => {
      /**
       * Create an organization submission (type can be ngo/employment)
       *
       * identity with type = staff can only create an organization submission with organizationType = ngo
       * identity with type = employer can only create an organization submission with organizationType = employment
       * return error if not the case
       *
       * if organizationId exists,
       *    create an OrganizationSubmission.
       * else,
       *    create a new organization.
       *    create an organization submission with the id of newly-created organization.
       * status = pendingApproval
       */
    },

    OrganizationSubmissionUpdate: async (_parent, params) => {
      /**
       * Only admin can call this api
       * Update an organization submission in console by admin
       */
    },

    OrganizationUpdate: async (_parent, { input }) => {
      /**
       * Only admin can call this api
       * Update an organization
       */
    },

    OrganizationMemberInvite: async (_parent, { input }) => {
      /**
       * Admin can send invitation for any organization
       * Staff can only send invitation for his/her organization
       * Employer can only send invitation for his/her organization
       * Pwd/Public can not call this api.
       */
    },
    OrganizationMemberRemove: async (_parent, { input }) => {
      /**
       * Admin can send invitation for any organization
       * Staff can only remove member for his/her organization
       * Employer can only remove member for his/her organization
       * Pwd/Public can not call this api.
       */
    },
    OrganzationMemberBind: () => {
      /**
       * invite token should represent a member in an organization with status = invited
       * return error if token is invalid.
       * update the status (to binded) and corresponding identityId
       */
    },
  },
};

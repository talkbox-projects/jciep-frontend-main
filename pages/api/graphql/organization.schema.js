import { gql } from "apollo-server-core";

export default gql`
  # graphql-upload

  enum OrganizationType {
    ngo
    employment
  }

  enum OrganizationStatus {
    pendingApproval
    approved
    rejected
    resubmitRequied
  }

  type Member {
    identity: Identity
    email: String
    status: JoinStatus!
    role: Role
  }

  type OrganizationSubmission {
    id: ID!
    organizationType: OrganizationType
    organization: Organization!
    status: OrganizationStatus!

    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: File
    industry: Industry
    description: String
    district: District
    companyBenefit: String
    logo: File
    tncAccept: Boolean

    createAt: Timestamp!
    updateAt: Timestamp!
    approveAt: Timestamp!
    remark: String
    createBy: Identity
  }

  type Organization {
    id: ID!
    organizationType: OrganizationType

    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: File
    industry: Industry
    description: String
    district: District
    companyBenefit: String
    logo: File

    biography: JsonContent
    portfolio: [Media]

    member: [Member]
    submission: [OrganizationSubmission]
    tncAccept: Boolean
  }

  input OrganizationSubmissionCreateInput {
    organizationType: OrganizationType
    remark: String
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: FileInput
    industry: Industry
    description: String
    district: District
    companyBenefit: String
    logo: FileInput
    identityId: ID!
    organizationId: ID
  }

  input OrganizationSubmissionUpdateInput {
    id: ID!
    status: OrganizationStatus
    remark: String
    organizationType: OrganizationType
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: FileInput
    industry: Industry
    description: String
    district: District
    companyBenefit: String
    logo: FileInput
  }

  input OrganizationUpdateInput {
    id: ID!
    organizationType: OrganizationType

    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: FileInput
    industry: Industry
    description: String
    district: District
    companyBenefit: String
    logo: FileInput

    biography: JsonContent
    portfolio: [MediaInput]

    tncAccept: Boolean
  }

  input OrganizationMemberInviteInput {
    email: String!
    role: Role!
  }

  type Query {
    OrganizationGet(id: ID): Organization
    OrganizationSearch(
      status: OrganizationStatus
      limit: Int!
      page: Int!
    ): [Organization]
  }

  type Mutation {
    OrganizationSubmissionCreate(
      input: OrganizationSubmissionCreateInput
    ): OrganizationSubmission

    OrganizationSubmissionUpdate(
      input: OrganizationSubmissionUpdateInput
    ): OrganizationSubmission @auth(identityTypes: [admin])

    OrganizationUpdate(input: OrganizationUpdateInput): Organization
      @auth(identityTypes: [admin])
    OrganizationMemberInvite(input: OrganizationMemberInviteInput): Boolean
    OrganizationMemberRemove(id: ID!): Boolean
    OrganzationMemberBind(inviteToken: String!, identityId: ID!): Identity
  }
`;

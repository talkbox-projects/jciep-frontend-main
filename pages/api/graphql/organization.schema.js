import { gql } from "apollo-server-core";

export default gql`
  # graphql-upload

  type Member {
    identity: Identity
    email: String
    status: EnumJoinStatus
    role: EnumJoinRole
  }

  type OrganizationSubmission {
    id: ID!
    organizationType: EnumOrganizationType
    organization: Organization!
    status: EnumOrganizationStatus!
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: [File]
    industry: [EnumIndustry]
    industryOther: String
    description: String
    district: District
    companyBenefit: String
    logo: File

    contactName: String
    contactPhone: String
    contactEmail: String

    tncAccept: Boolean
    createdAt: Timestamp
    updatedAt: Timestamp
    vettedAt: Timestamp
    remark: String
    createdBy: Identity
  }

  type Organization {
    id: ID!
    organizationType: EnumOrganizationType
    status: EnumOrganizationStatus!
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: [File]
    industry: [EnumIndustry]
    industryOther: String
    description: String
    district: District
    companyBenefit: String
    logo: File

    contactName: String
    contactPhone: String
    contactEmail: String

    biography: JsonContent
    portfolio: [FileMeta]
    member: [Member]
    submission: [OrganizationSubmission]
    tncAccept: Boolean
    invitationCode: String
  }

  input OrganizationSubmissionCreateInput {
    organizationType: EnumOrganizationType
    remark: String
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: [FileInput]
    industry: [EnumIndustry]
    industryOther: String
    description: String
    district: District
    companyBenefit: String
    logo: FileInput
    identityId: ID!
    organizationId: ID
    tncAccept: Boolean

    contactName: String
    contactPhone: String
    contactEmail: String
  }

  input OrganizationSubmissionUpdateInput {
    id: ID!
    status: EnumOrganizationStatus
    remark: String
    organizationType: EnumOrganizationType
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: [FileInput]
    industry: [EnumIndustry]
    description: String
    district: District
    companyBenefit: String
    logo: FileInput

    contactName: String
    contactPhone: String
    contactEmail: String
  }

  input OrganizationUpdateInput {
    id: ID!
    organizationType: EnumOrganizationType
    chineseCompanyName: String
    englishCompanyName: String
    industry: [EnumIndustry]
    industryOther: String
    website: String
    businessRegistration: [FileInput]
    description: String
    district: District
    companyBenefit: String
    logo: FileInput

    contactName: String
    contactPhone: String
    contactEmail: String

    biography: JsonContent
    portfolio: [FileMetaInput]
    tncAccept: Boolean
  }

  input OrganizationMemberInviteInput {
    id: ID!
    email: String!
    role: EnumJoinRole!
  }

  type Query {
    OrganizationGet(id: ID): Organization
    OrganizationSearch(
      status: EnumOrganizationStatus
      limit: Int!
      page: Int!
    ): [Organization]

    OrganizationSubmissionGet(id: ID): OrganizationSubmission

    OrganizationSubmissionSearch(
      type: EnumOrganizationType
      status: EnumOrganizationStatus
      name: String
      limit: Int!
      page: Int!
    ): [OrganizationSubmission]
  }

  type Mutation {
    OrganizationSubmissionCreate(
      input: OrganizationSubmissionCreateInput
    ): OrganizationSubmission

    OrganizationSubmissionUpdate(
      input: OrganizationSubmissionUpdateInput!
    ): OrganizationSubmission

    OrganizationUpdate(input: OrganizationUpdateInput): Organization
      @auth(identityTypes: [admin])

    OrganizationMemberInvite(input: OrganizationMemberInviteInput!): Boolean
    OrganizationMemberRemove(id: ID!): Boolean
    OrganzationMemberBind(inviteToken: String!, identityId: ID!): Identity
  }
`;

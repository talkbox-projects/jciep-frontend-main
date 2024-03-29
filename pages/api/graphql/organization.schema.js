import { gql } from "apollo-server-core";

export default gql`
  type Member {
    identityId: ID
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
    district: EnumDistrict
    companyBenefit: String
    logo: File

    contactName: String
    contactPhone: String
    contactEmail: String

    missionNVision: String
    targetGroup: [String]
    targetGroupDisabilities: String
    targetGroupDisabilitiesOther: String

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
    district: EnumDistrict
    companyBenefit: String
    logo: File

    contactName: String
    contactPhone: String
    contactEmail: String

    missionNVision: String
    targetGroup: [EnumTargetGroup]
    targetGroupDisabilities: EnumTargetGroupDisability
    targetGroupDisabilitiesOther: String

    bannerMedia: FileMeta
    biography: JsonContent
    portfolio: [FileMeta]
    member: [Member]
    submission: [OrganizationSubmission]
    tncAccept: Boolean
    invitationCode: String
    published: Boolean
    createdAt: Timestamp
  }

  input OrganizationSubmissionCreateInput {
    organizationType: EnumOrganizationType
    remark: String
    centre: String
    missionNVision: String
    targetGroup: [EnumTargetGroup]
    targetGroupDisabilities: EnumTargetGroupDisability
    targetGroupDisabilitiesOther: String
    chineseCompanyName: String
    englishCompanyName: String
    website: String
    businessRegistration: [FileInput]
    industry: [EnumIndustry]
    industryOther: String
    description: String
    district: EnumDistrict
    companyBenefit: String
    logo: FileInput
    identityId: ID!
    organizationId: ID
    tncAccept: Boolean

    contactName: String
    contactPhone: String
    contactEmail: String
    postalAddress: String
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
    industryOther: String
    description: String
    district: EnumDistrict
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
    district: EnumDistrict
    companyBenefit: String
    logo: FileInput

    contactName: String
    contactPhone: String
    contactEmail: String

    missionNVision: String
    targetGroup: [EnumTargetGroup]
    targetGroupDisabilities: EnumTargetGroupDisability
    targetGroupDisabilitiesOther: String

    bannerMedia: FileMetaInput
    biography: JsonContent
    portfolio: [FileMetaInput]
    tncAccept: Boolean
    published: Boolean
  }

  input OrganizationMemberInviteInput {
    id: ID!
    email: String!
    role: EnumJoinRole!
  }

  type Query {
    OrganizationGet(id: ID): Organization
    OrganizationInvitationCodeValidity(
      invitationCode: String!
      organizationType: EnumOrganizationType
    ): Boolean
    OrganizationSearch(
      name: String
      days: String
      status: [EnumOrganizationStatus]
      type: [EnumOrganizationType]
      published: Boolean
    ): [Organization]

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
    OrganizationMemberJoin(invitationCode: String!, identityId: ID!): Boolean
    OrganizationMemberRemove(organizationId: ID!, identityId: ID!): Boolean
    OrganizationMemberApprove(organizationId: ID!, identityId: ID!): Boolean

    OrganizationRemove(id: ID!): Boolean
  }
`;

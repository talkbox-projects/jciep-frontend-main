import { gql } from "apollo-server-core";

export default gql`
  # graphql-upload

  enum JoinStatus {
    binded
    invited
  }
  enum PwdType {
    adhd
  }

  type OrganizationRole {
    organization: Organization
    status: JoinStatus!
    role: Role
  }

  type User {
    phone: String
    email: String
    facebookId: String
    appleId: String
    googleId: String
    identities: [Identity]
  }

  type Education {
    school: String
    degree: Degree
    fieldOfStudy: String
    startDatetime: Timestamp
    endDatetime: Timestamp
    present: Boolean
  }

  type Employment {
    employmentType: EmploymentMode
    CompanyName: String
    Industry: Industry
    startDatetime: Timestamp
    endDatetime: Timestamp
    present: Boolean
  }

  type Activity {
    name: String
    description: String
    startDatetime: Timestamp
    endDatetime: Timestamp
  }

  input EducationInput {
    school: String
    degree: Degree
    fieldOfStudy: String
    startDatetime: Timestamp
    endDatetime: Timestamp
    present: Boolean
  }

  input EmploymentInput {
    employmentType: EmploymentMode
    CompanyName: String
    Industry: Industry
    startDatetime: Timestamp
    endDatetime: Timestamp
    present: Boolean
  }

  input ActivityInput {
    name: String
    description: String
    startDatetime: Timestamp
    endDatetime: Timestamp
  }

  type Identity {
    id: ID!
    type: IdentityType!
    chineseName: String!
    englishName: String!
    dob: Timestamp
    gender: Gender
    district: District
    pwdType: PwdType
    interestedEmploymentMode: EmploymentMode
    interestedIndustry: [Industry]
    industry: Industry
    tncAccept: Boolean
    email: String
    phone: String

    biography: JsonContent
    portfolio: [Media]
    writtenLanguage: [WrittenLanguage]
    oralLanguage: [WrittenLanguage]
    hobby: String
    education: [Education]
    employment: [Employment]
    activity: [Activity]

    organizationRole: OrganizationRole
  }

  input IdentityCreateInput {
    userId: ID
    inviteToken: String
    identity: IdentityType!
    chineseName: String!
    englishName: String!
    dob: Timestamp
    gender: Gender
    district: District
    pwdType: PwdType
    interestedEmploymentMode: EmploymentMode
    interestedIndustry: [Industry]
    industry: Industry
    tncAccept: Boolean
    email: String
    phone: String

    biography: JsonContent
    portfolio: [MediaInput]
    writtenLanguage: [WrittenLanguage]
    oralLanguage: [WrittenLanguage]
    hobby: String
    education: [EducationInput]
    employment: [EmploymentInput]
    activity: [ActivityInput]
  }

  input IdentityUpdateInput {
    id: ID
    organizationId: ID
    userId: ID
    identity: IdentityType!
    chineseName: String!
    englishName: String!
    dob: Timestamp
    gender: Gender
    district: District
    pwdType: PwdType
    interestedEmploymentMode: EmploymentMode
    interestedIndustry: [Industry]
    industry: Industry
    tncAccept: Boolean
    email: String
    phone: String

    biography: JsonContent
    portfolio: [MediaInput]
    writtenLanguage: [WrittenLanguage]
    oralLanguage: [WrittenLanguage]
    hobby: String
    education: [EducationInput]
    employment: [EmploymentInput]
    activity: [ActivityInput]
  }

  input LoginInput {
    phone: String
    otp: String
    facebookToken: String
    googleToken: String
    appleToken: String
    email: String
    emailVerificationToken: String
    password: String
  }

  type LoginOutput {
    user: User!
    token: String!
  }

  type UserEmailValidityCheckOutput {
    email: String!
    meta: JsonContent
  }

  type Query {
    UserEmailValidityCheck(token: String!): UserEmailValidityCheckOutput

    IdentityGet(id: ID): User
    IdentitySearch(
      identityTypes: [IdentityType]
      limit: Int!
      page: Int!
    ): [User] @auth(identityTypes: [admin])
  }

  type Mutation {
    UserPhoneVerify(phone: String!): Boolean
    UserEmailVerify(email: String!): Boolean

    UserLogin(input: LoginInput): LoginOutput
    UserGet(token: String!): User
    UserLogout: Boolean

    UserPasswordResetEmailSend(email: String!): Boolean
    UserPasswordReset(token: String!, password: String!): Boolean

    IdentityCreate(input: IdentityCreateInput!): Identity @auth
    IdentityUpdate(input: IdentityUpdateInput!): Identity @auth
  }
`;

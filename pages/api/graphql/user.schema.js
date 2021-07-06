import { gql } from "apollo-server-core";

export default gql`
  enum JoinStatus {
    binded
    invited
  }

  type OrganizationRole {
    organization: Organization
    status: JoinStatus!
    role: Role
  }

  type User {
    id: ID
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
    employmentType: EnumEmploymentMode
    CompanyName: String
    Industry: EnumIndustry
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
    degree: EnumDegree
    fieldOfStudy: String
    startDatetime: Timestamp
    endDatetime: Timestamp
    present: Boolean
  }

  input EmploymentInput {
    employmentType: EnumEmploymentMode
    CompanyName: String
    Industry: EnumIndustry
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
    id: ID
    type: EnumIdentityType!
    chineseName: String!
    englishName: String!
    dob: Timestamp
    gender: EnumGender
    district: EnumDistrict
    pwdType: EnumPwdType
    interestedEmploymentMode: EnumEmploymentMode
    interestedIndustry: [EnumIndustry]
    industry: EnumIndustry
    tncAccept: Boolean
    email: String
    phone: String

    profilePic: Media
    bannerMedia: Media
    # yearOfExperience: EnumYearOfExperience

    biography: JsonContent
    portfolio: [Media]
    writtenLanguage: [EnumWrittenLanguage]
    oralLanguage: [EnumOralLanguage]
    hobby: String
    education: [Education]
    employment: [Employment]
    activity: [Activity]

    organizationRole: OrganizationRole
  }

  input IdentityCreateInput {
    userId: ID
    inviteToken: String
    identity: EnumIdentityType!
    chineseName: String!
    englishName: String!
    dob: Timestamp
    gender: EnumGender
    district: EnumDistrict
    pwdType: [EnumPwdType]
    interestedEmploymentMode: [EnumEmploymentMode]
    interestedIndustry: [EnumIndustry]
    industry: EnumIndustry
    tncAccept: Boolean
    email: String
    phone: String
    biography: JsonContent
    portfolio: [MediaInput]
    writtenLanguage: [EnumWrittenLanguage]
    oralLanguage: [EnumOralLanguage]
    hobby: String
    education: [EducationInput]
    employment: [EmploymentInput]
    activity: [ActivityInput]
  }

  input IdentityUpdateInput {
    id: ID
    organizationId: ID
    userId: ID
    identity: EnumIdentityType!
    chineseName: String!
    englishName: String!
    dob: Timestamp
    gender: EnumGender
    district: District
    pwdType: EnumPwdType
    interestedEmploymentMode: EnumEmploymentMode
    interestedIndustry: [EnumIndustry]
    industry: EnumIndustry
    tncAccept: Boolean
    email: String
    phone: String

    biography: JsonContent
    portfolio: [MediaInput]
    writtenLanguage: [EnumWrittenLanguage]
    oralLanguage: [EnumOralLanguage]
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

    UserGet(token: String!): User
    
    """
    Search User by either phone, email or name. Search the name of every identities.
    """
    UserSearch(
      phone: String
      email: String
      name: String
      limit: Int!
      page: Int!
    ): [User]

    """
    Search Identtiy by either phone, email or name. Search the name of every identities.
    """
    IdentitySearch(
      phone: String
      email: String
      name: String
      limit: Int!
      page: Int!
    ): [User]
  }

  type Mutation {
    UserPhoneVerify(phone: String!): Boolean
    UserEmailVerify(email: String!): Boolean

    UserLogin(input: LoginInput): LoginOutput
    UserGet(token: String!): User
    UserLogout: Boolean

    UserPasswordResetEmailSend(email: String!): Boolean
    UserPasswordReset(token: String!, password: String!): Boolean

    IdentityCreate(input: IdentityCreateInput!): Identity
    IdentityUpdate(input: IdentityUpdateInput!): Identity
  }
`;

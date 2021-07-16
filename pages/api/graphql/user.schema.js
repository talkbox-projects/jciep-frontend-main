import { gql } from "apollo-server-core";

export default gql`
  type OrganizationRole {
    organization: Organization!
    status: EnumJoinStatus!
    role: EnumJoinRole!
  }

  type SnsMeta {
    profilePicUrl: String
    displayName: String
  }

  type User {
    id: ID
    phone: String
    email: String
    facebookId: String
    appleId: String
    googleId: String
    identities: [Identity]
    snsMeta: SnsMeta
  }

  type Education {
    school: String
    degree: EnumDegree
    fieldOfStudy: String
    startDatetime: Timestamp
    endDatetime: Timestamp
    present: Boolean
  }

  type Employment {
    employmentType: EnumEmploymentMode
    companyName: String
    jobTitle: String
    industry: EnumIndustry
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
    companyName: String
    jobTitle: String
    industry: EnumIndustry
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
    pwdType: [EnumPwdType]
    interestedEmploymentMode: [EnumEmploymentMode]
    interestedIndustry: [EnumIndustry]
    interestedIndustryOther: String
    industry: [EnumIndustry]
    tncAccept: Boolean
    published: Boolean

    email: String
    phone: String

    profilePic: File
    bannerMedia: FileMeta
    caption: String
    educationLevel: EnumDegree
    yearOfExperience: EnumYearOfExperience

    biography: JsonContent
    portfolio: [FileMeta]
    writtenLanguage: [EnumWrittenLanguage]
    writtenLanguageOther: String
    oralLanguage: [EnumOralLanguage]
    oralLanguageOther: String
    skill: [EnumSkill]
    skillOther: String
    hobby: String
    education: [Education]
    employment: [Employment]
    activity: [Activity]

    organizationRole: [OrganizationRole]
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
    interestedIndustryOther: String
    industry: [EnumIndustry]
    tncAccept: Boolean
    published: Boolean
    email: String
    phone: String

    profilePic: FileInput
    bannerMedia: FileMetaInput
    caption: String
    educationLevel: EnumDegree
    yearOfExperience: EnumYearOfExperience

    biography: JsonContent
    portfolio: [FileMetaInput]
    writtenLanguage: [EnumWrittenLanguage]
    writtenLanguageOther: String
    oralLanguage: [EnumOralLanguage]
    oralLanguageOther: String
    skill: [EnumSkill]
    skillOther: String
    hobby: String
    education: [EducationInput]
    employment: [EmploymentInput]
    activity: [ActivityInput]

    invitationCode: String
  }

  input IdentityUpdateInput {
    id: ID
    organizationId: ID
    userId: ID
    chineseName: String
    englishName: String
    dob: Timestamp
    gender: EnumGender
    district: EnumDistrict
    pwdType: [EnumPwdType]
    interestedEmploymentMode: [EnumEmploymentMode]
    interestedIndustry: [EnumIndustry]
    interestedIndustryOther: String
    industry: [EnumIndustry]
    tncAccept: Boolean
    published: Boolean
    email: String
    phone: String

    profilePic: FileInput
    bannerMedia: FileMetaInput
    caption: String
    educationLevel: EnumDegree
    yearOfExperience: EnumYearOfExperience

    biography: JsonContent
    portfolio: [FileMetaInput]
    writtenLanguage: [EnumWrittenLanguage]
    writtenLanguageOther: String
    oralLanguage: [EnumOralLanguage]
    oralLanguageOther: String
    skill: [EnumSkill]
    skillOther: String
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

    UserGet(id: ID!): User

    """
    Search Identtiy by either phone, email or name. Search the name of every identities.
    """
    IdentitySearch(
      phone: String
      email: String
      name: String
      organizationId: ID
      identityType: [EnumIdentityType]
      published: Boolean
      limit: Int!
      page: Int!
    ): [Identity]

    IdentityGet(id: ID!): Identity
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

    IdentityRemove(id: ID!): Boolean
  }
`;

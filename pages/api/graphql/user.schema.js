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
    requirePasswordSet: Boolean
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
    industryOther: String
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
    industryOther: String
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
    publishStatus: EnumPublishStatus!
    chineseName: String!
    englishName: String
    dob: Timestamp
    age: EnumAge
    gender: EnumGender
    district: EnumDistrict
    pwdType: [EnumPwdType]
    pwdOther: String
    interestedEmploymentMode: [EnumEmploymentMode]
    interestedIndustry: [EnumInterestedIndustry]
    interestedIndustryOther: String
    industry: [EnumIndustry]
    industryOther: String
    currentIndustry: String
    wishToDo: EnumWishToDo
    wishToDoOther: String
    appTncAccept: Boolean
    phase2profile: Boolean
    tncAccept: Boolean
    published: Boolean

    email: String
    phone: String
    createdAt: Timestamp
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
    englishName: String
    dob: Timestamp
    gender: EnumGender
    district: EnumDistrict
    pwdType: [EnumPwdType]
    pwdOther: String
    interestedEmploymentMode: [EnumEmploymentMode]
    interestedIndustry: [EnumInterestedIndustry]
    interestedIndustryOther: String
    industry: [EnumIndustry]
    industryOther: String
    currentIndustry: String
    tncAccept: Boolean
    published: Boolean
    email: String
    phone: String
    age: EnumAge
    jobFunction: String
    isDisability: Boolean
    wishToDo: EnumWishToDo
    wishToDoOther: String

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

    phase2profile: Boolean
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
    pwdOther: String
    interestedEmploymentMode: [EnumEmploymentMode]
    interestedIndustry: [EnumInterestedIndustry]
    interestedIndustryOther: String
    industry: [EnumIndustry]
    industryOther: String
    tncAccept: Boolean
    published: Boolean
    email: String
    phone: String
    age: EnumAge
    jobFunction: String
    isDisability: Boolean
    wishToDo: EnumWishToDo
    wishToDoOther: String

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

    phase2profile: Boolean
  }

  input LoginInput {
    phone: String
    otp: String
    facebookToken: String
    googleToken: String
    appleToken: String
    platform: String
    email: String
    emailVerificationToken: String
    password: String
  }

  type UserEmailValidityCheckOutput {
    email: String!
    meta: JsonContent
  }

  type UserEmailOTPValidityCheckOutput {
    email: String!
    meta: JsonContent
  }

  type UserExistOutput {
    email: String
    phone: String
    facebookId: String
    googleId: String
  }

  type UserPhoneValidityCheckOutput {
    phone: String!
    meta: JsonContent
  }

  type Query {
    UserEmailValidityCheck(token: String!): UserEmailValidityCheckOutput
    UserPhoneValidityCheck(phone: String!,otp: String!): UserPhoneValidityCheckOutput
    UserEmailOTPValidityCheck(email: String!,otp: String!): UserEmailOTPValidityCheckOutput
    UserExist(email: String, phone: String, facebookId: String, googleId: String): UserExistOutput

    UserMeGet: User

    AdminIdentitySearch(
      phone: String
      email: String
      name: String
      organizationId: ID
      identityType: [EnumIdentityType]
      publishStatus: [EnumPublishStatus]
      published: Boolean
      limit: Int!
      page: Int!
      days: String
    ): [Identity]

    TalantIdentitySearch(
      organizationId: ID
      jobType: String
      jobInterested: String
      limit: Int!
      page: Int!
    ): [Identity]


    AdminIdentityGet(id: ID!): Identity
    OrganizationIdentityGet(organizationId: ID!, identityId: ID!): Identity

    IdentityMeGet: Identity

  }

  type Mutation {
    UserPhoneVerify(phone: String!): Boolean
    UserEmailVerify(email: String!): Boolean

    UserLogin(input: LoginInput): User
    UserLogout: Boolean

    UserPasswordResetEmailSend(email: String!): Boolean
    UserPasswordResetEmailOTPSend(email: String!): Boolean
    UserPasswordResetPhoneSend(phone: String!): Boolean
    UserPasswordReset(token: String!, password: String!): Boolean
    UserPasswordResetByConsole(email: String!, phone: String!, password: String!): Boolean

    IdentityCreate(input: IdentityCreateInput!): Identity
    IdentityUpdate(input: IdentityUpdateInput!): Identity

    IdentityRemove(id: ID!): Boolean

    PortfolioPublishRequest(organizationId: ID, identityId: ID!): Boolean
    PortfolioPublishApprove(organizationId: ID, identityId: ID!): Boolean
    PortfolioPublishReject(organizationId: ID, identityId: ID!): Boolean
    PortfolioUnpublish(organizationId: ID, identityId: ID!): Boolean
  }
`;

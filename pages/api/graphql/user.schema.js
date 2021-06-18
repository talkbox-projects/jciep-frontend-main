import { gql } from "apollo-server-core";

export default gql`
  # graphql-upload

  type StaffProfile {
    name: String!
  }
  type JobSeekerProfile {
    introductionVideo: Media
    interestedEmploymentType: EmploymentType
    interestedIndustry: Industry
    school: School
    degree: Degree
    fieldOfStudy: String
    studyStartYear: String
    studyEndYear: String
    studyDescription: String
    studyMedia: Media
    studyTitle: String
    employmentType: EmploymentType
    companyName: String
    industry: Industry
    currentJob: Boolean
    currentJobStartYear: String
    currentJobEndYear: String
    currentJobDescription: String
    currentJobMedia: Media
    language: Language
    accomplishmentName: String
    accomplishmentMedia: Media
    otherMedia: Media
    skillName: String
    skillMedia: Media
  }

  type NgoProfile {
    district: District!
    website: String!
  }

  type EmployerProfile {
    industry: Industry!
    district: District!
    website: String!
    businessRegistration: File!
    companyBenefit: String
  }

  type PublicProfile {
    name: String!
  }

  enum ApplicationStatus {
    approved
    reject
    pending
    resubmit
  }

  type Application {
    id: ID!
    userId: ID!
    role: Role!
    status: ApplicationStatus!
    employer: EmployerProfile
    ngo: NgoProfile
    createAt: Timestamp!
    updateAt: Timestamp!
    approveAt: Timestamp!
    # staff fills in information/reason when status = resubmit/rejected
    remark: String!
    createBy: ID
  }

  input EmployerProfileInput {
    industry: Industry!
    district: District!
    website: String!
    businessRegistration: FileInput!
    companyBenefit: String
  }

  input NgoProfileInput {
    district: District!
    website: String!
  }
  input PublicProfileInput {
    name: String!
  }
  input JobSeekerProfileInput {
    introductionVideo: MediaInput
    interestedEmploymentType: EmploymentType
    interestedIndustry: Industry
    school: School
    degree: Degree
    fieldOfStudy: String
    studyStartYear: String
    studyEndYear: String
    studyDescription: String
    studyMedia: MediaInput
    studyTitle: String
    employmentType: EmploymentType
    companyName: String
    industry: Industry
    currentJob: Boolean
    currentJobStartYear: String
    currentJobEndYear: String
    currentJobDescription: String
    currentJobMedia: MediaInput
    language: Language
    accomplishmentName: String
    accomplishmentMedia: MediaInput
    otherMedia: MediaInput
    skillName: String
    skillMedia: MediaInput

    "job seeker profile can be managed by an ngo account. managedBy is the userId of the ngo"
    managedBy: ID
  }

  input UserCreateInput {
    email: String!
    password: String
    facebookId: String
    appleId: String
    chineseName: String!
    profilePic: FileInput
    bio: String!
    acceptTnc: Boolean!
    employer: EmployerProfileInput
    ngo: NgoProfileInput
    public: PublicProfileInput
    jobSeeker: JobSeekerProfileInput
  }

  input UserUpdateInput {
    id: ID!
    email: String!
    password: String
    facebookId: String
    appleId: String
    chineseName: String!
    profilePic: FileInput
    bio: String!
    acceptTnc: Boolean!
    employer: EmployerProfileInput
    ngo: NgoProfileInput
    public: PublicProfileInput
    jobSeeker: JobSeekerProfileInput
  }

  type User {
    id: ID!
    email: String!
    password: String
    facebookId: String
    appleId: String
    chineseName: String!
    profilePic: File
    bio: String!
    acceptTnc: Boolean!
    application: [Application]
    createAt: Timestamp!
    updateAt: Timestamp!

    employer: EmployerProfile
    ngo: NgoProfile
    public: PublicProfile
    jobSeeker: JobSeekerProfile
  }

  type Query {
    "return null if not exists"
    UserGet(ids: [ID]): User

    UserSearch(
      chineseName: String
      role: [Role]
      email: String
      limit: Int!
      page: Int!
    ): [User]
    UserGetMe: User

    ApplicationSearch(
      role: Role
      status: ApplicationStatus
      limit: Int!
      page: Int!
    ): [Application]
    ApplicationGet(id: ID!): Application
  }
  type Mutation {
    "header: x-token, require 'adminUser'"
    UserCreate(data: UserCreateInput): User

    "user uses this mutation to update his/her own profile"
    MeUpdate(data: UserUpdateInput): User @auth(roles: [staff, ngo])

    "staff uses this mutation to update any user profiles;  ngo uses this mutation to update ITS SUBORDINATE job seeker profiles"
    UserUpdate(data: UserUpdateInput): User @auth(roles: [staff, ngo])

    "staff uses this mutation to update any user profiles;  ngo uses this mutation to update ITS SUBORDINATE job seeker profiles"
    UserSuspense(id: ID): Boolean @auth(roles: [staff, ngo])
  }
`;

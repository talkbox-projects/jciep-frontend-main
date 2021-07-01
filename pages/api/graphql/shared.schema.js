import gql from "graphql-tag";

export default gql`
  """
  Restricted to particular identity type(s) of user
  If identityTypes is empty, check whether user is logged in
  """
  directive @auth(identityTypes: [IdentityType]) on OBJECT | FIELD_DEFINITION

  enum Gender {
    male
    female
    notSpecified
  }

  enum IdentityType {
    admin
    pwd
    public
    employer
    staff
  }

  enum Role {
    staff
    pwd
  }
  enum EmploymentMode {
    freelance
    fullTime
    partTime
  }

  enum PwdType {
    hearingImpairment
    visualImpairment
    speechImpairment
    physicalImpairment
    autism
    mentalIllnessMoodDisorder
    intellectualDisability
    visceralDisabilityPersonswithChronicDiseases
    specificLearningDifficulties
    attentionDeficitHyperactivityDisorder
  }
  
  enum Industry {
    graphicDesig
    illustrationDrawing
    animationDesign
    webDesign
    photography
    filmmaking
    musicSoundDesign
    dubbingWork
    softwareMobileAppDesign
    mobileComputerGameDesign
    webpageProduction
    computerProgramming
    computerRepair
    privateTuition
    musicTutor
    artTutor
    sportsInstructor
    performingArtsInstructor
    performingArtist
    magicVaudevilleShow
    twistedBalloonService
    activityLeader
    masterOfCeremonies
    promotionActivities
    prWork
    eventPlanning
    setProduction
    activityAssistant
    trusteeGongAidClassInstructor
    interestClassTutor
    eventsOfficer
    teachingAssistant
    salesJob
    promoter
    socialMediaManagement
    textPromotion
    promotionalEventPlanning
    waiter
    waterBar
    coffeeBrewing
    kitchen
    cashRegister
    breadCakeMaking
    frontDeskCustomerService
    housekeeping
    makeup
    hairstyleDesign
    nailService
    beautyService
    professionalGrade
    medicalAssistant
  }
  
  enum School {
    hku
  }
  enum Degree {
    bba
  }
  enum Language {
    en
    zh
  }

  enum WrittenLanguage {
    chinese
    english
    other
  }

  enum OralLanguage {
    cantonese
    english
    mandarin
    other
  }

  scalar Upload
  scalar FileInput
  scalar Timestamp
  scalar JsonContent
  scalar Timestamp

  enum District {
    centralAndWestern
    eastern
    southern
    wanChai
    shamShuiPo
    kowloonCity
    kwunTong
    wongTaiSin
    yauTsimMong
    islands
    kwaiTsing
    north
    saiKung
    shaTin
    taiPo
    tsuenWan
    tuenMun
    yuenLong
  }

  input MediaInput {
    input: Upload
    title: String
    description: String
  }

  type Media {
    id: String!
    url: String!
    title: String
    description: String
  }

  type File {
    id: String!
    url: String!
  }

  type MultiLangString {
    en: String
    cn: String
    zh: String
  }
`;

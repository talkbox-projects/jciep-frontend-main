export const districts = {
  centralAndWestern: { en: "Central and Western", zh: "中西區" },
  eastern: { en: "Eastern", zh: "東區" },
  southern: { en: "Southern", zh: "南區" },
  wanChai: { en: "Wan Chai", zh: "灣仔區" },
  shamShuiPo: { en: "Sham Shui Po", zh: "深水埗區" },
  kowloonCity: { en: "Kowloon City", zh: "九龍城區" },
  kwunTong: { en: "Kwun Tong", zh: "觀塘區" },
  wongTaiSin: { en: "Wong Tai Sin", zh: "黃大仙區" },
  yauTsimMong: { en: "Yau Tsim Mong", zh: "油尖旺區" },
  islands: { en: "Islands", zh: "離島區" },
  kwaiTsing: { en: "Kwai Tsing", zh: "葵青區" },
  north: { en: "North", zh: "北區" },
  saiKung: { en: "Sai Kung", zh: "西貢區" },
  shaTin: { en: "Sha Tin", zh: "沙田區" },
  taiPo: { en: "Tai Po", zh: "大埔區" },
  tsuenWan: { en: "Tsuen Wan", zh: "荃灣區" },
  tuenMun: { en: "Tuen Mun", zh: "屯門區" },
  yuenLong: { en: "Yuen Long", zh: "元朗區" },
};

export const identityTypes = {
  admin: { en: "Admin", zh: "管理員" },
  staff: { en: "NGO Staff", zh: "社福機構職員" },
  employer: { en: "Employer", zh: "僱主" },
  public: { en: "Public", zh: "公眾人士" },
  pwd: { en: "Talents/Carer", zh: "多元人才/照顧者" },
};

export const pwdType = {
  hearingImpairment: {en: "Hearing Impairment", zh: "聽力障礙"},
  visualImpairment: {en: "Visual Impairment", zh: "視力障礙"},
  speechImpairment: {en: "Speech Impairment", zh: "言語障礙" },
  physicalImpairment: {en: "Physical Impairment", zh: "肢體傷殘"},
  autism: {en: "Autism", zh: "自閉症"},
  mentalIllnessMoodDisorder: {en: "Mental Illness / Mood Disorder", zh: "精神病/情緒病"},
  intellectualDisability: {en: "Intellectual Disability", zh: "智能障礙"},
  visceralDisabilityPersonswithChronicDiseases: {en: "Visceral Disability / Persons with Chronic Diseases", zh: "器官殘障/長期病患"},
  specificLearningDifficulties: {en: "Specific Learning Difficulties", zh: "特殊學習困難"},
  attentionDeficitHyperactivityDisorder: {en: "Attention Deficit / Hyperactivity Disorder", zh: "注意力不足/過度活躍症"}
}

export const genders = {
  male: { en: "Male", zh: "男性" },
  female: { en: "Female", zh: "女性" },
  notSpecified: { en: "Not Specified", zh: "其他" },
};

export const employementModes = {
  freelance: { en: "Freelance", zh: "自由工作" },
  fullTime: { en: "Full time", zh: "全職" },
  partTime: { en: "Part time", zh: "兼職" },
};

export const writtenLanguage = {
  chinese: { en: "Chinese", zh: "中文" },
  english: { en: "English", zh: "英文" },
  others: { en: "Others: Please specify", zh: "其他: 請註明" },
};

export const oralLanguage = {
  chinese: { en: "Chinese", zh: "粵語" },
  english: { en: "English", zh: "英語" },
  putonghua: { en: "Putonghua", zh: "普通話" },
  others: { en: "Others: Please specify", zh: "其他: 請註明" },
};

export const degree = {
  notSpecified: { en: "N/A", zh: "沒指定" },
  diploma: { en: "Diploma", zh: "文憑" },
  highDiploma: { en: "Higher Diploma", zh: "高級文憑" },
  associateDegree: { en: "Associate Degree", zh: "副學士學位" },
  degree: { en: "Degree", zh: "學士學位" },
  masterOrAbove: { en: "Master or above", zh: "碩士學位或以上" },
};

export const industry = {
  graphicDesign: { en: "Graphic design", zh: "平面設計" },
  illustrationDrawing: { en: "Illustration drawing", zh: "插畫繪製" },
  animationDesign: { en: "Animation design", zh: "動畫設計" },
  webDesign: { en: "Web Design", zh: "網頁設計" },
  photography: { en: "Photography", zh: "攝影" },
  filmmaking: { en: "Filmmaking", zh: "影片製作" },
  musicSoundDesign: { en: "Music/sound design", zh: "音樂/音效設計" },
  dubbingWork: { en: "Dubbing work", zh: "配音工作" },
  softwareMobileAppDesign: {
    en: "Software/mobile app design",
    zh: "軟件/手機應用程式設計",
  },
  mobileComputerGameDesign: {
    en: "Mobile/computer game design",
    zh: "手機/電腦遊戲設計",
  },
  webpageProduction: { en: "Webpage production", zh: "網頁製作" },
  computerProgramming: { en: "Computer programming", zh: "電腦程式編寫" },
  computerRepair: { en: "Computer repair", zh: "電腦維修" },
  privateTuition: { en: "Private tuition", zh: "私人補習" },
  musicTutor: { en: "Music tutor", zh: "音樂導師" },
  artTutor: { en: "Art tutor", zh: "美術導師" },
  sportsInstructor: { en: "Sports Instructor", zh: "運動導師" },
  performingArtsInstructor: {
    en: "Performing Arts Instructor",
    zh: "表演藝術導師",
  },
  performingArtist: { en: "Performing artist", zh: "表演藝術者" },
  magicVaudevilleShow: { en: "Magic/vaudeville show", zh: "魔術/雜耍表演" },
  twistedBalloonService: { en: "Twisted balloon service", zh: "扭波服務" },
  activityLeader: { en: "Activity leader", zh: "活動帶領" },
  masterOfCeremonies: { en: "Master of ceremonies", zh: "司儀工作" },
  promotionActivities: { en: "Promotion activities", zh: "活動推廣" },
  prWork: { en: "PR work", zh: "公關工作" },
  eventPlanning: { en: "Event planning", zh: "活動策劃" },
  setProduction: { en: "Set production", zh: "佈景製作" },
  activityAssistant: { en: "Activity assistant", zh: "活動助理" },
  trusteeGongAidClassInstructor: {
    en: "Trustee/Gong Aid Class Instructor",
    zh: "托管/功輔班導師",
  },
  interestClassTutor: { en: "Interest class tutor", zh: "興趣班導師" },
  eventsOfficer: { en: "Events Officer", zh: "活動幹事" },
  teachingAssistant: { en: "Teaching assistant", zh: "助教" },
  salesJob: { en: "Sales job", zh: "銷售工作" },
  promoter: { en: "Promoter", zh: "推廣員" },
  socialMediaManagement: { en: "Social media management", zh: "社交媒體管理" },
  textPromotion: { en: "Text promotion", zh: "文字推廣" },
  promotionalEventPlanning: {
    en: "Promotional event planning",
    zh: "推廣活動策劃",
  },
  waiter: { en: "Waiter", zh: "侍應" },
  waterBar: { en: "Water bar", zh: "水吧" },
  coffeeBrewing: { en: "Coffee brewing", zh: "咖啡沖製" },
  kitchen: { en: "Kitchen", zh: "廚房" },
  cashRegister: { en: "Cash register", zh: "收銀" },
  breadCakeMaking: { en: "Bread/cake making", zh: "麵包/蛋糕製作" },
  frontDeskCustomerService: {
    en: "Front desk/customer service",
    zh: "前台/客戶服務",
  },
  housekeeping: { en: "Housekeeping", zh: "房務" },
  makeup: { en: "Makeup", zh: "化妝造型" },
  hairstyleDesign: { en: "Hairstyle design", zh: "髮型設計" },
  nailService: { en: "Nail Service", zh: "美甲服務" },
  beautyService: { en: "Beauty service", zh: "美容服務" },
  professionalGrade: { en: "Professional grade", zh: "專業職系" },
  medicalAssistant: { en: "Medical assistant", zh: "醫務助理" },
};

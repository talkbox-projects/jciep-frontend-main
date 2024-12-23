import degrees from "./enum/degrees";
import districts from "./enum/districts";
import jobDistricts from "./enum/jobDistricts";
import employmentModes from "./enum/employmentModes";
import genders from "./enum/genders";
import identityTypes from "./enum/identityTypes";
import interestedIndustries from "./enum/interestedIndustries";
import joinRoles from "./enum/joinRoles";
import joinStatus from "./enum/joinStatus";
import oralLanguages from "./enum/oralLanguages";
import organizationStatus from "./enum/organizationStatus";
import organizationTypes from "./enum/organizationTypes";
import pwdTypes from "./enum/pwdTypes";
import skills from "./enum/skills";
import writtenLanguages from "./enum/writtenLanguages";
import yearOfExperiences from "./enum/yearOfExperiences";
import serviceTarget from "./enum/serviceTarget";
import publishStatus from "./enum/publishStatus";
import industries from "./enum/industries";

import ages from "./enum/ages";
import wishToDos from "./enum/wishToDo";
import targetGroups from "./enum/targetGroup";
import targetGroupDisabilities from "./enum/targetGroupDisabilities";

const properize = (text) => {
  return text
    .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
    .replace(/\s+/g, "");
};

const generateEnumResolver = (_key, constants) => {
  const key = properize(_key);
  return {
    [`Enum${key}List`]: async (_parent) => {
      return Object.entries(constants).map(([key, value]) => ({ key, value }));
    },
  };
};

export default {
  Query: {
    ...generateEnumResolver("age", ages),
    ...generateEnumResolver("targetGroup", targetGroups),
    ...generateEnumResolver("targetGroupDisability", targetGroupDisabilities),
    ...generateEnumResolver("wishToDo", wishToDos),
    ...generateEnumResolver("degree", degrees),
    ...generateEnumResolver("district", districts),
    ...generateEnumResolver("jobDistrict", jobDistricts),
    ...generateEnumResolver("identityType", identityTypes),
    ...generateEnumResolver("employmentMode", employmentModes),
    ...generateEnumResolver("gender", genders),
    ...generateEnumResolver("interestedIndustry", interestedIndustries),
    ...generateEnumResolver("industry", industries),
    ...generateEnumResolver("oralLanguage", oralLanguages),
    ...generateEnumResolver("organizationStatus", organizationStatus),
    ...generateEnumResolver("organizationType", organizationTypes),
    ...generateEnumResolver("pwdType", pwdTypes),
    ...generateEnumResolver("writtenLanguage", writtenLanguages),
    ...generateEnumResolver("yearOfExperience", yearOfExperiences),
    ...generateEnumResolver("skill", skills),
    ...generateEnumResolver("organizationStatus", organizationStatus),
    ...generateEnumResolver("joinRole", joinRoles),
    ...generateEnumResolver("joinStatus", joinStatus),
    ...generateEnumResolver("serviceTarget", serviceTarget),
    ...generateEnumResolver("publishStatus", publishStatus),
  },
};

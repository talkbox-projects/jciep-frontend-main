import degrees from "./enum/degrees";
import districts from "./enum/districts";
import employmentModes from "./enum/employmentModes";
import genders from "./enum/genders";
import identityTypes from "./enum/identityTypes";
import industries from "./enum/industries";
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
    ...generateEnumResolver("degree", degrees),
    ...generateEnumResolver("district", districts),
    ...generateEnumResolver("identityType", identityTypes),
    ...generateEnumResolver("employmentMode", employmentModes),
    ...generateEnumResolver("gender", genders),
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
  },
};

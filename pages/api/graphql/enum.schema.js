import gql from "graphql-tag";
import degrees from "./enum/degrees";
import districts from "./enum/districts";
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
const generateEnumSchema = (_key, constants) => {
  const key = "Enum" + properize(_key);
  return gql`
  enum ${key} {
    ${Object.keys(constants).join(",")}  
  }

  type ${key}Display {
    en: String
    zh: String
  }

  type ${key}ListItem {
    key: ${key}
    value: ${key}Display
  }

  type Query {
    ${key}List: [${key}ListItem]
  }
  `;
};

export default gql`
  ${generateEnumSchema("age", ages)}
  ${generateEnumSchema("wishToDo", wishToDos)}
  ${generateEnumSchema("targetGroup", targetGroups)}
  ${generateEnumSchema("targetGroupDisability", targetGroupDisabilities)}
  ${generateEnumSchema("degree", degrees)}
  ${generateEnumSchema("district", districts)}
  ${generateEnumSchema("employmentMode", employmentModes)}
  ${generateEnumSchema("gender", genders)}
  ${generateEnumSchema("identityType", identityTypes)}
  ${generateEnumSchema("interestedIndustry", interestedIndustries)}
  ${generateEnumSchema("industry", industries)}
  ${generateEnumSchema("oralLanguage", oralLanguages)}
  ${generateEnumSchema("organizationStatus", organizationStatus)}
  ${generateEnumSchema("organizationType", organizationTypes)}
  ${generateEnumSchema("pwdType", pwdTypes)}
  ${generateEnumSchema("writtenLanguage", writtenLanguages)}
  ${generateEnumSchema("yearOfExperience", yearOfExperiences)}
  ${generateEnumSchema("skill", skills)}
  ${generateEnumSchema("organizationStatus", organizationStatus)}
  ${generateEnumSchema("joinRole", joinRoles)}
  ${generateEnumSchema("joinStatus", joinStatus)}
  ${generateEnumSchema("serviceTarget", serviceTarget)}
  ${generateEnumSchema("publishStatus", publishStatus)}
`;

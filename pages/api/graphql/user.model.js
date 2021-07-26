import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { uuidv4 } from "../../../utils/general";
import districts from "./enum/districts";
import genders from "./enum/genders";
import identityTypes from "./enum/identityTypes";
import employmentModes from "./enum/employmentModes";
import industries from "./enum/industries";
import pwdTypes from "./enum/pwdTypes";

const emailVerifySchema = Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  meta: { type: Schema.Types.Mixed },
});

emailVerifySchema.pre("validate", async function (next) {
  this.token = uuidv4();
  next();
});

const phoneVerifySchema = Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  meta: { type: Schema.Types.Mixed },
});

phoneVerifySchema.pre("validate", async function (next) {
  if (this.isNew) {
    this.otp = parseInt(Math.random() * 900000 + 100000).toString();
  }
  next();
});

const userSchema = Schema({
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  appleId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  snsMeta: {
    profilePicUrl: {
      type: String,
    },
    displayName: {
      type: String,
    },
  },
  identities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Identity",
    },
  ],
});

userSchema.statics.generateHash = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const identitySchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: Object.keys(identityTypes),
    required: true,
  },
  chineseName: String,
  englishName: String,
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  dob: Date,
  gender: {
    type: String,
    enum: Object.keys(genders),
  },
  district: {
    type: String,
    enum: Object.keys(districts),
  },
  pwdType: [
    {
      type: String,
      enum: Object.keys(pwdTypes),
    },
  ],
  interestedEmploymentMode: [
    {
      type: String,
      enum: Object.keys(employmentModes),
    },
  ],
  interestedIndustry: [
    {
      type: String,
      enum: Object.keys(industries),
    },
  ],
  caption: {
    type: String,
  },
  educationLevel: {
    type: String,
  },
  yearOfExperience: {
    type: String,
  },

  interestedIndustryOther: {
    type: String,
  },
  industry: [
    {
      type: String,
      enum: Object.keys(industries),
    },
  ],
  biography: {
    type: Object,
  },
  portfolio: [
    {
      file: {
        id: String,
        url: String,
        contentType: String,
        fileSize: Number,
      },
      videoUrl: String,
      title: String,
      description: String,
    },
  ],
  writtenLanguage: [
    {
      type: String,
    },
  ],
  writtenLanguageOther: {
    type: String,
  },
  oralLanguage: [
    {
      type: String,
    },
  ],
  oralLanguageOther: {
    type: String,
  },
  skill: [
    {
      type: String,
    },
  ],
  skillOther: {
    type: String,
  },

  hobby: {
    type: String,
  },
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      startDatetime: Date,
      endDatetime: Date,
      present: Boolean,
    },
  ],
  employment: [
    {
      employmentType: Object,
      companyName: String,
      jobTitle: String,
      industry: Object,
      startDatetime: Date,
      endDatetime: Date,
      present: Boolean,
    },
  ],
  profilePic: {
    id: String,
    url: String,
    contentType: String,
    fileSize: Number,
  },
  bannerMedia: {
    file: {
      id: String,
      url: String,
      contentType: String,
      fileSize: Number,
    },
    videoUrl: String,
    title: String,
    description: String,
  },
  activity: [
    {
      name: String,
      description: String,
      startDatetime: Date,
      endDatetime: Date,
    },
  ],
  tncAccept: {
    type: Boolean,
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date
  }
});

userSchema.virtual("member.identity", {
  ref: "Member",
  localField: "member.identityId",
  foreignField: "_id",
  justOne: false,
});

export const Identity = models["Identity"] ?? model("Identity", identitySchema);
export const User = models["User"] ?? model("User", userSchema);
export const EmailVerify =
  models["EmailVerify"] ?? model("EmailVerify", emailVerifySchema);
export const PhoneVerify =
  models["PhoneVerify"] ?? model("PhoneVerify", phoneVerifySchema);

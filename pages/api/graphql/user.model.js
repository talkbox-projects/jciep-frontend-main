import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { uuidv4 } from "../../../utils/uuid";
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
    this.otp = Math.floor(Math.random() * 900000);
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
  facebookId: {
    type: String,
  },
  appleId: {
    type: String,
  },
  googleId: {
    type: String,
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
  employementMode: {
    type: String,
    enum: Object.keys(employmentModes),
  },
  pwdType: {
    type: String,
    enum: Object.keys(pwdTypes),
  },
  interestedIndustry: [
    {
      type: String,
      enum: Object.keys(industries),
    },
  ],
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
      input: Object,
      title: String,
      description: String,
    },
  ],
  writtenLanguage: [
    {
      type: String,
    },
  ],
  oralLanguage: [
    {
      type: String,
    },
  ],
  hobby: {
    type: String,
  },
  education: [
    {
      school: String,
      degree: Object,
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
      industry: Object,
      startDatetime: Date,
      endDatetime: Date,
      present: Boolean,
    },
  ],
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
});

export const Identity = models["Identity"] ?? model("Identity", identitySchema);
export const User = models["User"] ?? model("User", userSchema);
export const EmailVerify =
  models["EmailVerify"] ?? model("EmailVerify", emailVerifySchema);
export const PhoneVerify =
  models["PhoneVerify"] ?? model("PhoneVerify", phoneVerifySchema);

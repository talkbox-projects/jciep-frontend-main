import { model, models, Schema } from "mongoose";
import districts from "./enum/districts";
import industries from "./enum/industries";
import organizationStatus from "./enum/organizationStatus";
import organizationTypes from "./enum/organizationTypes";

const organizationSchema = Schema({
  organizationType: {
    type: String,
    enum: Object.keys(organizationTypes),
    required: true,
  },
  remark: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.keys(organizationStatus),
  },
  chineseCompanyName: {
    type: String,
    required: true,
  },
  englishCompanyName: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  identityId: {
    type: Schema.Types.ObjectId,
    ref: "Identity",
  },
  businessRegistration: [
    {
      id: String,
      url: String,
      filename: String,
      contentType: String,
      directory: String,
    },
  ],
  industry: [{
    type: String,
    enum: Object.keys(industries),
  }],
  description: {
    type: String,
  },
  district: {
    type: String,
    enum: Object.keys(districts),
  },
  companyBenefit: {
    type: String,
  },
  submission: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrganizationSubmission",
    },
  ],
  logo: {
    id: String,
    url: String,
    filename: String,
    contentType: String,
    directory: String,
  },
  tncAccept: {
    type: Boolean,
  },
});

const organizationSubmissionSchema = Schema({
  organizationType: {
    type: String,
    enum: Object.keys(organizationTypes),
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  status: {
    type: String,
    enum: Object.keys(organizationStatus),
  },
  chineseCompanyName: {
    type: String,
    required: true,
  },
  englishCompanyName: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  businessRegistration: [
    {
      id: String,
      url: String,
      filename: String,
      contentType: String,
      directory: String,
    },
  ],
  industry: [{
    type: String,
    enum: Object.keys(industries),
  }],
  description: {
    type: String,
  },
  district: {
    type: String,
    enum: Object.keys(districts),
  },
  companyBenefit: {
    type: String,
  },

  logo: {
    id: String,
    url: String,
    filename: String,
    contentType: String,
    directory: String,
  },
  tncAccept: {
    type: Boolean,
  },
  createdAt: Date,
  updatedAt: Date,
  approvedAt: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Identity",
  },
});

export const Organization =
  models["Organization"] ?? model("Organization", organizationSchema);
export const OrganizationSubmission =
  models["OrganizationSubmission"] ??
  model("OrganizationSubmission", organizationSubmissionSchema);

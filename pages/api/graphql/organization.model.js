import { model, models, Schema } from "mongoose";
import districts from "./enum/districts";
import industries from "./enum/industries";
import organizationStatus from "./enum/organizationStatus";
import organizationTypes from "./enum/organizationTypes";
import joinStatus from "./enum/joinStatus";
import joinRoles from "./enum/joinRoles";

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
  contactName: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
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
  identityId: {
    type: Schema.Types.ObjectId,
    ref: "Identity",
  },
  businessRegistration: [
    {
      id: String,
      url: String,
      contentType: String,
      fileSize: Number,
    },
  ],
  industry: [
    {
      type: String,
      enum: Object.keys(industries),
    },
  ],
  industryOther: {
    type: String,
  },
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
  member: [
    {
      identityId: {
        type: Schema.Types.ObjectId,
        ref: "Identity",
      },
      email: String,
      status: {
        type: String,
        enum: Object.keys(joinStatus),
      },
      role: {
        type: String,
        enum: Object.keys(joinRoles),
      },
    },
  ],
  logo: {
    id: String,
    url: String,
    contentType: String,
    fileSize: Number,
  },
  tncAccept: {
    type: Boolean,
  },
  invitationCode: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date
  }
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
      contentType: String,
      fileSize: Number,
    },
  ],
  industry: [
    {
      type: String,
      enum: Object.keys(industries),
    },
  ],
  industryOther: {
    type: String,
  },
  description: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  contactEmail: {
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
    contentType: String,
    fileSize: Number,
  },
  tncAccept: {
    type: Boolean,
  },
  remark: {
    type: String,
  },
  createdAt: Date,
  updatedAt: Date,
  vettedAt: Date,
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

import send from "./email/send";
import bannerBase64 from "./email/templates/assets/img/bannerBase64";
import logoBase64 from "./email/templates/assets/img/logoBase64";
import { Organization, OrganizationSubmission } from "./organization.model";
import { Identity } from "./user.model";
import nookies from "nookies";
import getConfig from "next/config";
import { checkIfAdmin, isIdentityUnderUser, isJoinedOrganizationStaff } from "../../../utils/auth";
const { publicRuntimeConfig } = getConfig();



export default {
  Organization: {
    submission: async (parent, args, context) => {

      const organization = parent;
      const identity = context?.auth?.identity;

      if (!identity) {
        return [];
      }

      if (!checkIfAdmin(identity) && !isJoinedOrganizationStaff(identity, organization._id)) {
        return [];
      }

      const submissions = await OrganizationSubmission.find({ _id: { $in: organization.submission } });
      return submissions || [];
    },

    member: async (parent, args, context) => {

      const organization = parent;
      const currentIdentity = context?.auth?.identity;

      if (!checkIfAdmin(currentIdentity) && !isJoinedOrganizationStaff(currentIdentity, organization._id)) {
        return parent.member.filter(({ status }) => status === "joined");
      }

      return parent.member;
    }

  },
  Member: {
    identity: async (parent, args, context) => {

      const member = parent;
      const currentIdentity = context?.auth?.identity;

      if (!currentIdentity) {
        return null;
      }

      const identity = await Identity.findById(member.identityId);
      return identity;

    }
  },

  Query: {
    OrganizationGet: async (_parent, { id }) => {

      const organization = await Organization.findById(id);
      if (!organization?.invitationCode) {
        organization.invitationCode = parseInt(
          Math.random() * 900000 + 100000
        ).toString();
        await organization.save();
      }
      return organization;
    },

    OrganizationSearch: async (
      _parent,
      { status = [], type = [], name, published = undefined, days },
      context
    ) => {
      /**
       * Search Organization
       * Admin can access to all organization
       * other identity can only access to approved organization and published
       */

      const isAdmin = checkIfAdmin(context.auth?.identity);


      let date = new Date();
      if (days === "7 Days") {
        date.setDate(date.getDate() - 7);
      } else if (days === "1 Month") {
        date.setMonth(date.getMonth() - 1);
      } else if (days === "3 Months") {
        date.setMonth(date.getMonth() - 3);
      } else {
        days = undefined;
      }

      const filters = {
        ...(type?.length && { organizationType: { $in: type } }),
        ...(days && { createdAt: { $gte: date } }),
        ...(name && {
          $or: [
            { chineseCompanyName: { $regex: name, $options: "i" } },
            { englishCompanyName: { $regex: name, $options: "i" } },
          ]
        })
      };

      if (!isAdmin) {
        filters.published = true;
        filters.status = "approved";
      } else {
        if (published !== undefined) {
          filters.published = published
        }
        if ((status?.length ?? 0) > 0) {
          filters.status = { $in: status };
        }
      }

      const organizations = await Organization.find(filters)
        .populate("submission")
        .sort({ createdAt: -1 });

      return organizations;
    },
    OrganizationSubmissionSearch: async (_parent, input) => {
      let keys = {};

      if (input.type) keys["organizationType"] = input.type;
      if (input.status) keys["status"] = input.status;
      if (input.name)
        keys["$or"] = [
          { chineseCompanyName: input?.name },
          { englishCompanyName: input?.name },
        ];

      return await OrganizationSubmission.find(keys)
        .populate("organization")
        .skip((input?.page - 1) * 10)
        .limit(input?.limit);
    },

    OrganizationInvitationCodeValidity: async (
      _parent,
      { invitationCode, organizationType }
    ) => {
      try {
        return await Organization.exists({
          invitationCode,
          organizationType,
          status: "approved",
        });
      } catch (error) {
        return false;
      }
    },
  },
  Mutation: {
    OrganizationSubmissionCreate: async (_parent, params, context) => {
      /**
       * Create an organization submission (type can be ngo/employment)
       *
       * identity with type = staff can only create an organization submission with organizationType = ngo
       * identity with type = employer can only create an organization submission with organizationType = employment
       * return error if not the case
       *
       * if organizationId exists,
       *    create an OrganizationSubmission.
       * else,
       *    create a new organization.
       *    create an organization submission with the id of newly-created organization.
       * status = pendingApproval
       */
      const identityId = params?.input?.identityId;
      console.log(identityId, nookies.get(context), context?.auth);
      const identity = await Identity.findById(identityId);
      if (!isIdentityUnderUser(identityId, context?.auth?.user)) {
        throw new Error("Permission Denied!");
      }


      let getOrganization = async () => {
        if (params.input.organizationId) {
          let organization = await Organization.findById(
            params.input.organizationId
          );
          if (!organization) {
            throw new Error("Organization not exists!");
          }
          return organization;
        } else {
          return await new Organization({
            organizationType: params.input.organizationType,
            remark: params?.input?.remark,
            status: "pendingApproval",
            chineseCompanyName: params?.input.chineseCompanyName,
            englishCompanyName: params?.input.englishCompanyName,
            website: params?.input?.website,
            industry: params?.input?.industry,
            industryOther: params?.input?.industryOther,
            description: params?.input?.description,
            businessRegistration: params.input?.businessRegistration,
            submission: [],
            member: [],
            contactName: identity?.chineseName || "",
            contactEmail: identity?.email || "",
            contactPhone: identity?.phone || "",
            district: params?.input?.district,
            companyBenefit: params?.input?.companyBenefit,
            identityId: params?.input?.identityId,
            logo: params.input?.logo,
            tncAccept: params?.input?.tncAccept,
            invitationCode: Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date(),
          });
        }
      };

      const organization = await getOrganization();

      if (organization) {
        let organizationSubmission = await new OrganizationSubmission({
          organizationType: organization.organizationType,
          organization: organization._id,
          remark: params?.input.remark,
          status: "pendingApproval",
          chineseCompanyName: params?.input.chineseCompanyName,
          englishCompanyName: params?.input.englishCompanyName,
          website: params?.input.website,
          businessRegistration: params?.input.businessRegistration,
          industry: params?.input.industry,
          industryOther: params?.input.industryOther,
          description: params?.input.description,
          district: params?.input.district,
          companyBenefit: params?.input.companyBenefit,
          logo: params?.input.logo,
          contactName: identity?.chineseName || params?.input.contactName,
          contactEmail: identity?.email || params?.input.contactEmail,
          contactPhone: identity?.phone || params?.input.contactPhone,
          tncAccept: params?.input.tncAccept,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: params?.input?.identityId,
        }).save();

        organization.submission.push(organizationSubmission._id);
        organization.status = "pendingApproval";

        const exists = !!organization.member.find((m) => m?.identityId);

        if (!exists) {
          organization.member.push({
            identityId: params?.input?.identityId,
            role: "staff",
            status: "joined",
          });
        }
        await organization.save();

        return await OrganizationSubmission.findById(organizationSubmission._id)
          .populate("organization")
          .populate("createdBy");
      }
    },

    OrganizationSubmissionUpdate: async (_parent, { input }, context) => {

      const submission = await OrganizationSubmission.findById(input?.id);
      const organizationId = submission.organization;
      const identity = context?.auth?.identity
      if (!checkIfAdmin(identity) && !isJoinedOrganizationStaff(identity, organizationId)) {
        throw new Error("Permission Denied!");
      }

      input.updateAt = new Date();


      if (["approved", "rejected"].includes(input?.status)) {
        input.vettedAt = new Date();
        await Organization.findByIdAndUpdate(organizationId, {
          status: input?.status,
        });
      }

      if (["approved"].includes(input?.status)) {
        const submission = await OrganizationSubmission.findById(input.id);
        if (submission) {
          await Organization.findByIdAndUpdate(organizationId, {
            chineseCompanyName: submission?.chineseCompanyName,
            englishCompanyName: submission?.englishCompanyName,
            website: submission?.website,
            contactEmail: submission?.contactEmail,
            contactPhone: submission?.contactPhone,
            contactName: submission?.contactName,
            industry: submission?.industry,
            industryOther: submission?.industryOther,
          });
        }
      }

      return await OrganizationSubmission.findByIdAndUpdate(input.id, input, {
        new: true,
      }).populate("organization");
    },

    OrganizationUpdate: async (_parent, { input }, context) => {


      const identity = context?.auth?.identity;
      if (!checkIfAdmin(identity) && !isJoinedOrganizationStaff(identity, input.id)) {
        throw new Error("Permission Denied!");
      }

      const organization = await Organization.findByIdAndUpdate(
        input.id,
        input,
        {
          new: true,
        }
      );

      return organization;

    },

    OrganizationMemberJoin: async (_parent, { identityId, invitationCode }, context) => {


      if (!isIdentityUnderUser(identityId, context?.auth?.user)) {
        throw new Error("Permission Denied");
      }

      const identity = await Identity.findById(identityId);
      const organization = await Organization.findOne({ invitationCode });

      if (!identity || !organization) {
        return false;
      }

      if (
        !(
          ["pwd", "staff"].includes(identity.type) &&
          organization.organizationType === "ngo"
        )
      ) {
        return false;
      }

      const exists = !!(organization.member ?? []).find(
        (m) => String(m.identityId) === String(identityId)
      );

      if (exists) {
        return false;
      }

      await Organization.findOneAndUpdate(
        { invitationCode },
        {
          $push: {
            member: {
              identityId: identity.id,
              role: identity.type === "pwd" ? "member" : "staff",
              status: "pendingApproval",
            },
          },
        }
      );
      return true;
    },

    OrganizationMemberInvite: async (_parent, { input: { id, email } }, context) => {

      const identity = context?.auth?.identity;
      if (!checkIfAdmin(identity)
        && !isJoinedOrganizationStaff(identity, id)
      ) {
        throw new Error("Permission Denied!");
      }

      const organization = await Organization.findById(id);

      let host = publicRuntimeConfig.HOST_URL ?? "http://localhost:3000";
      await send(
        email,
        {
          url: `${host}`,
          title: "《賽馬會共融・知行計劃》邀請函",
          description: `<div>你被邀請參與《賽馬會共融・知行計劃》，並成為相關的多元人才。<br/>請使用以下邀請碼創建帳戶 <br/> <strong style="font-size: 20px;padding: 12px;">${organization?.invitationCode}</strong>`,
          button_text: "前往",
        },
        [
          {
            cid: "logo_base64",
            filename: "logo.png",
            encoding: "base64",
            content: logoBase64,
          },
          {
            cid: "banner_base64",
            filename: "banner.png",
            encoding: "base64",
            content: bannerBase64,
          },
        ]
      );

      return true;
    },
    OrganizationMemberRemove: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {

      const identity = context?.auth?.identity;
      if (!checkIfAdmin(identity)
        && !isJoinedOrganizationStaff(identity, organizationId)
      ) {
        throw new Error("Permission Denied!");
      }


      await Organization.findByIdAndUpdate(
        organizationId,
        {
          $pull: { member: { identityId } },
        },
        { new: true }
      );
      return true;

    },

    OrganizationMemberApprove: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {


      const identity = context?.auth?.identity;
      if (!checkIfAdmin(identity)
        && !isJoinedOrganizationStaff(identity, organizationId)
      ) {
        throw new Error("Permission Denied!");
      }

      await Organization.findByIdAndUpdate(
        organizationId,
        {
          $set: { [`member.$[m].status`]: "joined" },
        },
        {
          arrayFilters: [{ "m.identityId": identityId }],
          new: true,
        }
      );
      return true;
    },
    OrganizationRemove: async (_parent, { id }, context) => {

      const identity = context?.auth?.identity;
      if (!checkIfAdmin(identity)
        && !isJoinedOrganizationStaff(identity, id)
      ) {
        throw new Error("Permission Denied!");
      }

      await Organization.findByIdAndDelete(id);
      return true;

    },
  },
};

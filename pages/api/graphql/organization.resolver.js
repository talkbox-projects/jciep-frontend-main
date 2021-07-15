import send from "./email/send";
import { Organization, OrganizationSubmission } from "./organization.model";
import { EmailVerify, Identity, User } from "./user.model";

export default {
  Query: {
    OrganizationGet: async (_parent, { id }) => {
      const organization = await Organization.findById(id).populate(
        "submission"
      );

      if (!organization?.invitationCode) {
        organization.invitationCode = parseInt(
          Math.random() * 900000 + 100000
        ).toString();
        await organization.save();
      }

      const identities = await Identity.find({
        _id: { $in: organization.member.map((m) => m.identityId) },
      }).exec();
      organization.member.forEach((member) => {
        member.identity = identities.find((x) => {
          return String(x._id) === String(member.identityId);
        });
      });
      return organization;
    },

    OrganizationSubmissionGet: async (_parent, { id }) => {
      /**
       * Get OrganizationSubmission       *
       */

      return await OrganizationSubmission.findById(id).populate("organization");
    },
    OrganizationSearch: async (_parent, { status = [], type = [], name }) => {
      /**
       * Search Organization
       * Admin can access to all organization
       * other identity can only access to approved organization
       */

      const organizations = await Organization.find({
        ...(status?.length && { status: { $in: status } }),
        ...(type?.length && { organizationType: { $in: type } }),
        ...(name && {
          $or: [{ chineseCompanyName: name }, { englishCompanyName: name }],
        }),
      }).populate("submission");

      const identities = await Identity.find({
        _id: {
          $in: organizations.reduce(
            (_arr, x) => [..._arr, ...x.member.map((m) => m.identityId)],
            []
          ),
        },
      });
      organizations.forEach((organization) => {
        organization.member.forEach((member) => {
          member.identity = identities.find((x) => {
            return String(x._id) === String(member.identityId);
          });
        });
      });
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

      let organization = new Promise(async (resolve, reject) => {
        if (params.input.organizationId) {
          let organization = await Organization.findById(
            params.input.organizationId
          );

          if (!organization) {
            throw new Error("Organiazation not exists!");
          }

          resolve(organization);
        } else {
          resolve(
            await new Organization({
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
              contactName: params?.input?.contactName,
              contactEmail: params?.input?.contactEmail,
              contactPhone: params?.input?.contactPhone,
              district: params?.input?.district,
              companyBenefit: params?.input?.companyBenefit,
              identityId: params?.input?.identityId,
              logo: params.input?.logo,
              tncAccept: params?.input?.tncAccept,
              invitationCode: parseInt(Math.random() * 1000000).toString(),
            })
          );
        }
      });

      organization = await organization;

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
          contactName: params?.input.contactName,
          contactEmail: params?.input.contactEmail,
          contactPhone: params?.input.contactPhone,
          tncAccept: params?.input.tncAccept,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: params?.input?.identityId,
        }).save();

        organization.submission.push(organizationSubmission._id);
        organization.status = "pendingApproval";
        organization.member.push({
          identityId: params?.input?.identityId,
          role: "staff",
          status: "joined",
          email: "",
        });

        await organization.save();

        return await OrganizationSubmission.findById(organizationSubmission._id)
          .populate("organization")
          .populate("createdBy");
      }
    },

    OrganizationSubmissionUpdate: async (_parent, { input }) => {
      /**
       * Only admin can call this api
       * Update an organization submission in console by admin
       */

      input.updateAt = new Date();

      if (["approved", "rejected"].includes(input?.status)) {
        input.vettedAt = new Date();
      }

      if (["approved"].includes(input?.status)) {
        const submission = await OrganizationSubmission.findById(input.id);
        if (submission) {
          await Organization.findByIdAndUpdate(submission.organization, {
            status: input?.status,
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

    OrganizationUpdate: async (_parent, { input }) => {
      /**
       * Only admin can call this api
       * Update an organization
       */ try {
        const organization = await Organization.findByIdAndUpdate(
          input.id,
          input,
          {
            new: true,
          }
        ).populate("submission");

        const identities = await Identity.find({
          _id: { $in: organization.member.map((m) => m.identityId) },
        }).exec();
        organization.member.forEach((member) => {
          member.identity = identities.find((x) => {
            return String(x._id) === String(member.identityId);
          });
        });

        return organization;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    OrganizationMemberJoin: async (_parent, { identityId, invitationCode }) => {
      try {
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
      } catch (error) {
        return false;
        console.log(error);
      }
    },

    OrganizationMemberInvite: async (_parent, { input: { id, email } }) => {
      /**
       * Admin can send invitation for any organization
       * Staff can only send invitation for his/her organization
       * Employer can only send invitation for his/her organization
       * Pwd/Public can not call this api.
       */
      try {
        const organization = await Organization.findById(id);

        let host = process.env.HOST_URL
          ? process.env.HOST_URL
          : "http://localhost:3000";
        await send(
          email,
          {
            url: `${host}/user/invite/${emailVerify.token}`,
            title: "《賽馬會共融・知行計劃》邀請函",
            description: `<div>你被邀請參與《賽馬會共融・知行計劃》，並成為相關的多元人才。<br/>請使用以下邀請碼創建帳戶 <br/> <strong style="font-size: 20px;padding: 12px;">${organization?.invitationCode}</strong>`,
            button_text: "前往登入/註冊",
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
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    OrganizationMemberRemove: async (
      _parent,
      { organizationId, identityId }
    ) => {
      try {
        await Organization.findByIdAndUpdate(
          organizationId,
          {
            $pull: { member: { identityId } },
          },
          { new: true }
        );
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    OrganizationMemberApprove: async (
      _parent,
      { organizationId, identityId }
    ) => {
      try {
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
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    OrganizationRemove: async (_parent, { id }) => {
      try {
        await Organization.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

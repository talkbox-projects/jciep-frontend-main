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

    OrganizationMemberInvite: async (
      _parent,
      { input: { id, email, role } }
    ) => {
      /**
       * Admin can send invitation for any organization
       * Staff can only send invitation for his/her organization
       * Employer can only send invitation for his/her organization
       * Pwd/Public can not call this api.
       */
      try {
        const organization = await Organization.findById(id);

        const emailVerify = await EmailVerify.create({
          email,
          meta: {
            key: "invitation",
            role,
          },
        });

        let host = process.env.HOST_URL
          ? process.env.HOST_URL
          : "http://localhost:3000";
        await send(email, {
          url: `${host}/user/invite/${emailVerify.token}`,
          title: "《賽馬會共融・知行計劃》邀請函",
          description: `<div>你被邀請參與《賽馬會共融・知行計劃》，並成為相關的多元人才。<br/>請使用以下邀請碼創建帳戶 <br/> <strong style="font-size: 20px;padding: 12px;">${organization?.invitationCode}</strong>`,
          button_text: "前往登入/註冊",
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    OrganizationMemberRemove: async (_parent, { input }) => {
      /**
       * Admin can send invitation for any organization
       * Staff can only remove member for his/her organization
       * Employer can only remove member for his/her organization
       * Pwd/Public can not call this api.
       */
    },
    OrganzationMemberBind: () => {
      /**
       * invite token should represent a member in an organization with status = invited
       * return error if token is invalid.
       * update the status (to joined) and corresponding identityId
       */
    },
  },
};

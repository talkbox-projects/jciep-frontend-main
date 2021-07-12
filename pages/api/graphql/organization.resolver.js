import mongoose from "mongoose";
import { Organization, OrganizationSubmission } from "./organization.model";
import { EmailVerify, Identity, User } from "./user.model";

export default {
  Query: {
    OrganizationGet: async (_parent, { id }) => {
      const organization = await Organization.findById(id).populate(
        "submission"
      );
      const identities = await Identity.find({
        _id: { $in: organization.member.map((m) => m.identityId) },
      }).exec();
      organization.member.forEach((member) => {
        member.identity = identities.find((x) => {
          return String(x._id) === String(member.identityId);
        });
      });
      console.log(organization);
      return organization;
    },

    OrganizationSubmissionGet: async (_parent, { id }) => {
      /**
       * Get OrganizationSubmission       *
       */

      return await OrganizationSubmission.findById(id).populate("organization");
    },
    OrganizationSearch: async (_parent, { status, limit, page }) => {
      /**
       * Search Organization
       * Admin can access to all organization
       * other identity can only access to approved organization
       */

      return await Organization.find({ status })
        .skip((page - 1) * 10)
        .limit(limit);
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
              description: params?.input?.description,
              businessRegistration: params.input?.businessRegistration,
              submission: [],
              member: [],
              district: params?.input?.district,
              companyBenefit: params?.input?.companyBenefit,
              identityId: params?.input?.identityId,
              logo: params.input?.logo,
              tncAccept: params?.input?.tncAccept,
            })
          );
        }
      });

      organization = await organization;

      if (organization) {
        let organizationSubmission = await new OrganizationSubmission({
          organizationType: organization.organizationType,
          organization: organization._id,
          remark: organization.remark,
          status: "pendingApproval",
          chineseCompanyName: organization.chineseCompanyName,
          englishCompanyName: organization.englishCompanyName,
          website: organization.website,
          businessRegistration: organization?.businessRegistration,
          industry: organization?.industry,
          description: organization?.description,
          district: organization?.district,
          companyBenefit: organization?.companyBenefit,
          logo: organization?.logo,
          tncAccept: organization?.tncAccept,
          createAt: new Date(),
          updateAt: new Date(),
          createBy: params?.input?.identityId,
        }).save();

        organization.submission.push(organizationSubmission._id);
        organization.status = "pendingApproval";
        organization.member.push({
          identityId: params?.input?.identityId,
          role: "staff",
          status: "joined",
          email: "",
        });

        console.log("organization", organization);

        await organization.save();

        return await OrganizationSubmission.findById(organizationSubmission._id)
          .populate("organization")
          .populate("createBy");
      }
    },

    OrganizationSubmissionUpdate: async (_parent, { input }) => {
      /**
       * Only admin can call this api
       * Update an organization submission in console by admin
       */

      return await OrganizationSubmission.findByIdAndUpdate(input.id, input, {
        new: true,
      }).populate("organization");
    },

    OrganizationUpdate: async (_parent, { input }) => {
      /**
       * Only admin can call this api
       * Update an organization
       */ try {
        return await Organization.findByIdAndUpdate(input.id, input, {
          new: true,
        });
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
        await Organization.findByIdAndUpdate(
          id,
          {
            $push: {
              member: {
                email,
                role,
                status: "invited",
              },
            },
          },
          { new: true }
        );

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
        await sendEmail({
          To: email,
          Subject: "Email Verification",
          Text: `Please verify your email by clicking the link ${host}/user/verify/${emailVerify.token}`,
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

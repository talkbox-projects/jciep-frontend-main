/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { EmailVerify, PhoneVerify, User, Identity } from "./user.model";
import { Organization } from "./organization.model";
import jwt from "jsonwebtoken";
import sendSms from "../services/phone";
import facebook from "../services/facebook";
import google from "../services/google";
import { Types } from "mongoose";
import send from "./email/send";
import bannerBase64 from "./email/templates/assets/img/bannerBase64";
import logoBase64 from "./email/templates/assets/img/logoBase64";
import apple from "../services/apple";
import nookies from "nookies";
import getConfig from "next/config";
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export default {
  Query: {
    UserEmailValidityCheck: async (_parent, { token }) => {
      try {
        return await EmailVerify.findOne({ token });
      } catch (error) {
        return null;
      }
    },


    UserMeGet: async (_parent, params, { auth }) => {
      console.log("[Graphql userGet] auth=", auth);
      try {
        let user = auth.user;

        const identities = user.identities.map(async (identity) => {
          const organizations = await Organization.find({
            member: { $elemMatch: { identityId: identity._id } },
          });

          let organizationRole = await (organizations ?? []).map(
            (organization) => {
              const member = organization.member.find(
                ({ identityId }) => String(identityId) === String(identity._id)
              );
              return {
                organization,
                status: member.status,
                role: member.role,
              };
            }
          );

          identity = identity.toObject();
          identity.organizationRole = organizationRole;
          identity.id = identity._id;
          return identity;
        });

        user = user.toObject();
        user.id = user._id;
        user.identities = await Promise.all(identities);
        return user;
      } catch (error) {
        return null;
      }
    },

    IdentitySearch: async (_parent, input) => {
      /**
       * Search User
       */

      let keys = {};


      let date = new Date();
      if (input.days === "7 Days") {
        date.setDate(date.getDate() - 7);
      } else if (input.days === "1 Month") {
        date.setMonth(date.getMonth() - 1);
      } else if (input.days === "3 Months") {
        date.setMonth(date.getMonth() - 3);
      } else {
        input.days = undefined;
      }

      if (input.published) keys["published"] = input.published;
      if (input.phone) keys["phone"] = input.phone;
      if (input.email) keys["email"] = input.email;
      if (input.identityType) keys["type"] = { $in: input.identityType };
      if (input.days) {
        keys["createdAt"] = { $gte: date };
      }
      if (input.organizationId) {
        const organization = await Organization.findById(input.organizationId);
        keys["_id"] = {
          $in: organization.member
            .filter((x) => !!x.identityId)
            .map((m) => Types.ObjectId(m.identityId)),
        };
      }

      const compoundQuery = [];
      if (input.name)
        compoundQuery.push({
          $or: [
            { chineseName: { $regex: input?.name, $options: "i" } },
            { englishName: { $regex: input?.name, $options: "i" } },
          ],
        });

      if (input.publishStatus?.length > 0) {
        const $or = [
          { type: { $ne: "pwd" } },
          { publishStatus: { $in: input.publishStatus } },
        ];
        if (input.publishStatus?.includes("draft")) {
          $or.push({ publishStatus: null });
        }
        compoundQuery.push({
          $or,
        });
      }

      if (compoundQuery?.length > 0) {
        keys["$and"] = compoundQuery;
      }

      const organizations = await Organization.find();

      const identities = await Identity.find(keys)
        .skip((input.page - 1) * input?.limit)
        .limit(input?.limit);

      identities.forEach((identity) => {
        identity.organizationRole = (organizations ?? []).reduce(
          (_a, organization) => {
            const member = organization.member.find(
              ({ identityId }) => String(identityId) === String(identity.id)
            );
            if (member) {
              _a.push({
                organization,
                status: member.status,
                role: member.role,
              });
            }
            return _a;
          },
          []
        );
      });

      return identities;
    },

    IdentityGet: async (_parent, { id }) => {
      const identity = await Identity.findById(id);

      const organizations = await Organization.find({
        member: { $elemMatch: { identityId: id } },
      });

      identity.organizationRole = (organizations ?? []).map((organization) => {
        const member = organization.member.find(
          ({ identityId }) => String(identityId) === String(id)
        );
        return {
          organization,
          status: member.status,
          role: member.role,
        };
      });

      return identity;
    },
  },
  Mutation: {
    UserPhoneVerify: async (_parent, { phone }) => {
      /**
       * Send a SMS mesege with a 6-digit code to phone.
       */
      try {
        const phoneVerify = await PhoneVerify.create({ phone });
        let result = await sendSms(
          phoneVerify.phone,
          encodeURIComponent(`賽馬會共融・知行計劃一次性電話驗證碼:${phoneVerify.otp}`)
        );
        if (result) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    UserEmailVerify: async (_parent, { email }) => {
      /**
       * Send an email with a verification link (md5 token) to inbox.
       */
      try {
        const emailVerify = await EmailVerify.create({
          email,
          meta: { type: "register" },
        });

        let host = publicRuntimeConfig.HOST_URL
          ? publicRuntimeConfig.HOST_URL
          : "http://localhost:3000";
        await send(
          email,
          {
            url: `${host}/user/verify/${emailVerify.token}`,
            description: "請點擊下列按鈕啟動帳戶",
            button_text: "啟動帳戶",
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
    UserLogin: async (_parent, { input }, context) => {
      /**
       * Login via facebook/google/apple/email+password/phone+otp method. 
       * 
       * Create user if it does not exist

          case "facebook/google/apple":
            verify facebookToken, googleToken and appleToken
            if token is valid,
              if user not exists,
                create user with facebookId / googleId / appleId
              return user
            else
              return error

          case "phone+otp"
            verify phone+otp
            if otp is valid,
              if user not exists,
                create user with phone
              return user
            else
              return error

          case "email+password+emailVerificationToken"
            if emailVerificationToken exists
              if email does not exists in db
                create user with email + password
            else
              verify email+password
              if (email + password is valid,
                return user
              else
                return error

       */

      if (input?.emailVerificationToken) {
        const emailVerify = await EmailVerify.findOne({
          token: input?.emailVerificationToken,
        });
        if (!emailVerify?.email) {
          throw new Error("Invalid Token");
        } else {
          const user = await User.findOneAndUpdate(
            { email: emailVerify?.email },
            {
              email: emailVerify?.email,
              password: await User.generateHash(input?.password),
            },
            { upsert: true, new: true }
          ).populate("identities");
          await emailVerify.delete();

          const { identities, ..._user } = user.toObject();
          const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();

          nookies.set(context, "jciep-token", token, { path: "/" });

          return { user };
        }
      } else if (input?.email && input?.password) {
        const user = await User.findOne({
          email: input?.email.trim(),
        }).populate("identities");
        if (await user?.comparePassword(input?.password)) {
          const { identities, ..._user } = user.toObject();
          const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();

          nookies.set(context, "jciep-token", token, { path: "/" });
          return { user };
        } else {
          throw new Error("Wrong Email and Password!");
        }
      } else if (input?.phone) {
        const phoneVerify = await PhoneVerify.findOne({
          phone: input?.phone,
          otp: input?.otp,
        });
        if (!phoneVerify) {
          throw new Error("Invalid OTP");
        } else {
          await phoneVerify.delete();
          const user = await User.findOneAndUpdate(
            { phone: input.phone },
            { phone: input.phone },
            { upsert: true, new: true }
          ).populate("identities");

          const { identities, ..._user } = user.toObject();
          const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();

          nookies.set(context, "jciep-token", token, { path: "/" });
          return { user };
        }
      } else if (input.facebookToken) {
        const snsMeta = await facebook.getProfile(input.facebookToken);
        if (!snsMeta) {
          throw new Error("failed to login via facebook");
        }

        let user = await User.findOne({ facebookId: snsMeta.id }).populate(
          "identities"
        );
        if (!user) {
          user = await new User({ facebookId: snsMeta.id }).save();
        }
        const { identities, ..._user } = user.toObject();
        const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
        user.snsMeta = snsMeta;
        await user.save();
        nookies.set(context, "jciep-token", token, { path: "/" });
        return { user };
      } else if (input.googleToken) {
        let snsMeta = await google.getProfile(input.googleToken);
        if (!snsMeta) {
          throw new Error("failed to login via google");
        }

        let user = await User.findOne({ googleId: snsMeta.id }).populate(
          "identities"
        );
        if (!user) {
          user = await new User({ googleId: snsMeta.id }).save();
        }
        const { identities, ..._user } = user.toObject();
        const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
        user.snsMeta = snsMeta;
        await user.save();

        nookies.set(context, "jciep-token", token, { path: "/" });
        return { user };
      } else if (input.appleToken) {
        let snsMeta = await apple.getProfile(input.appleToken);
        if (!snsMeta) {
          throw new Error("failed to login via apple");
        }

        let user = await User.findOne({ appleId: snsMeta.id }).populate(
          "identities"
        );
        if (!user) {
          user = await new User({ appleId: snsMeta.id }).save();
        }
        const { identities, ..._user } = user.toObject();
        const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
        user.snsMeta = snsMeta;
        await user.save();

        nookies.set(context, "jciep-token", token, { path: "/" });
        return { user };
      }

      return null;
    },



    UserLogout: (_parent, params, context) => {

      nookies.destroy(context, "jciep-token", { path: "/" });
      return true;
    },

    UserPasswordResetEmailSend: async (_parent, { email }) => {
      /**
       * Send password reset email with reset link + md5_token
       */
      try {
        const emailVerify = await EmailVerify.create({
          email,
          meta: { type: "resetPassword" },
        });
        let host = publicRuntimeConfig.HOST_URL
          ? publicRuntimeConfig.HOST_URL
          : "http://localhost:3000";
        await send(
          email,
          {
            url: `${host}/user/password/${emailVerify.token}/reset`,
            description: "請點擊下列按鈕重設密碼",
            button_text: "重設密碼",
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

    UserPasswordReset: async (_parent, { token, password }) => {
      /**
       * email is decoded from token
       * Verify token and reset password
       */
      try {
        const emailVerify = await EmailVerify.findOne({
          token,
        });


        const { type } = emailVerify?.meta || {};

        if (type === "resetPassword") {
          await emailVerify.delete();
          const user = await User.findOneAndUpdate(
            { email: emailVerify?.email },
            {
              email: emailVerify?.email,
              password: await User.generateHash(password),
            },
            { upsert: true, new: true }
          );
        }
        return true;
      } catch (error) {
        return false;
      }
    },

    IdentityCreate: async (_parent, { input }) => {
      /**
       * Admin can create an identity for any user
       * Staff and Employer can create identity for the users that are members under his/her organization with role = pwd
       * Pwd/Public can create identity for his own account.
       */

      let identity = await new Identity({
        userId: input.userId,
        type: input.identity,
        chineseName: input.chineseName,
        englishName: input.englishName,
        dob: input.dob,
        pwdType: input?.pwdType,
        gender: input?.gender,
        district: input?.district,
        interestedEmploymentMode: input?.interestedEmploymentMode,
        interestedIndustryOther: input?.interestedIndustryOther,
        interestedIndustry: input?.interestedIndustry,
        industry: input?.industry,
        industryOther: input?.industryOther,
        tncAccept: input.tncAccept,
        profilePic: input?.profilePic,
        bannerMedia: input?.bannerMedia,
        portfolio: input?.portfolio,
        email: input.email,
        phone: input.phone,
        caption: input?.caption,
        educationLevel: input?.educationLevel,
        yearOfExperience: input?.yearOfExperience,
        biography: input?.biography,
        writtenLanguage: input?.writtenLanguage,
        oralLanguage: input?.oralLanguage,
        skill: input?.skill,
        skillOther: input?.skillOther,
        hobby: input?.hobby,
        education: input?.education,
        employment: input?.employment,
        activity: input?.activity,
        published: input?.published || false,
        createdAt: new Date(),
      }).save();

      if (input?.invitationCode) {
        await Organization.findOneAndUpdate(
          { invitationCode: input?.invitationCode },
          {
            $push: {
              member: {
                identityId: identity.id,
                role: input.identity === "pwd" ? "member" : "staff",
                status: "pendingApproval",
              },
            },
          }
        );
      }

      let user = await User.findById(input.userId);
      let identities = user.identities;
      identities.push(identity._id);

      await User.findByIdAndUpdate(input.userId, {
        identities: identities,
      });

      return identity;
    },

    IdentityUpdate: async (_parent, { input }) => {
      /**
       * Admin can update an identity for any user
       * Staff and Employer can update identity under his/her organization
       * Pwd/Public can update identity for his own account.
       */
      try {
        const identity = await Identity.findByIdAndUpdate(input.id, input, {
          new: true,
        });

        const organizations = await Organization.find({
          member: { $elemMatch: { identityId: input.id } },
        });

        identity.organizationRole = (organizations ?? []).map(
          (organization) => {
            const member = organization.member.find(
              ({ identityId }) => String(identityId) === String(input.id)
            );
            return {
              organization,
              status: member.status,
              role: member.role,
            };
          }
        );

        return identity;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    IdentityRemove: async (_parent, { id }) => {
      try {
        await Identity.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    PortfolioPublishRequest: async (_parent, { id }) => {
      const identity = await Identity.findById(id);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (!["draft", "rejected"].includes(identity?.publishStatus)) {
        return false;
      }
      identity.publishStatus = "pending";
      identity.published = false;
      await identity.save();
      return true;
    },

    PortfolioPublishApprove: async (_parent, { id }) => {
      const identity = await Identity.findById(id);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (identity?.publishStatus !== "pending") {
        return false;
      }
      identity.publishStatus = "approved";
      identity.published = true;
      await identity.save();
      return true;
    },

    PortfolioPublishReject: async (_parent, { id }) => {
      const identity = await Identity.findById(id);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (identity?.publishStatus !== "pending") {
        return false;
      }
      identity.publishStatus = "rejected";
      identity.published = false;
      await identity.save();
      return true;
    },

    PortfolioUnpublish: async (_parent, { id }) => {
      const identity = await Identity.findById(id);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (["rejected", "draft"].includes(identity?.publishStatus)) {
        return false;
      }
      identity.publishStatus = "draft";
      identity.published = false;
      await identity.save();
      return true;
    },
  },
};

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { EmailVerify, PhoneVerify, User, Identity } from "./user.model";
import { Organization } from "./organization.model";
import { AccessToken } from "./accessToken.model";
import { uuidv4 } from "../../../utils/general";
// import jwt from "jsonwebtoken";
import sendSms from "../services/phone";
import facebook from "../services/facebook";
import google from "../services/google";
import { Types } from "mongoose";
import send from "./email/send";
import { sendResetPassword, sendPortfolioPublishRequest, sendPortfolioPublishStatusUpdate } from "./email/send";
import bannerBase64 from "./email/templates/assets/img/bannerBase64";
import logoBase64 from "./email/templates/assets/img/logoBase64";
import apple from "../services/apple";
import nookies from "nookies";
import getConfig from "next/config";
import {
  checkIfAdmin,
  getIdentityOrganizationRole,
  isJoinedOrganizationStaff,
} from "../../../utils/auth";
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

const generateToken = (user) => {
  return new AccessToken({
    _id: uuidv4(),
    userId: user._id,
    createdAt: new Date(),
  }).save();
};

export default {
  Identity: {
    organizationRole: async (parent, args, context) => {
      return await getIdentityOrganizationRole(parent._id);
    },
  },
  User: {
    identities: async (parent) => {
      return await Identity.find({ _id: { $in: parent.identities } }).map(
        (identity) => {
          identity.id = identity._id;
          return identity;
        }
      );
    },
  },
  Query: {
    UserEmailValidityCheck: async (_parent, { token }) => {
      try {
        return await EmailVerify.findOne({ token });
      } catch (error) {
        return null;
      }
    },

    UserEmailOTPValidityCheck: async (_parent, { email, otp }) => {
      try {
        return await EmailVerify.findOne({ email, otp });
      } catch (error) {
        return null;
      }
    },

    UserExist: async (_parent, { email, phone, googleId, facebookId }) => {
      if (email) {
        try {
          return await User.findOne({ email });
        } catch (error) {
          return null;
        }
      } else if (phone) {
        try {
          return await User.findOne({ phone });
        } catch (error) {
          return null;
        }
      } else if (googleId) {
        try {
          return await User.findOne({ googleId });
        } catch (error) {
          return null;
        }
      } else if (facebookId) {
        try {
          return await User.findOne({ facebookId });
        } catch (error) {
          return null;
        }
      }
    },

    UserPhoneValidityCheck: async (_parent, { phone, otp }) => {
      try {
        return await PhoneVerify.findOne({ otp, phone });
      } catch (error) {
        return null;
      }
    },

    UserMeGet: async (_parent, params, context) => {
      let id = context?.auth?.user?.id;
      const user = await User.findById(id);
      user.id = user._id;
      return user;
    },

    AdminIdentitySearch: async (_parent, input, context) => {
      /**
       * Search User
       */

      if (!checkIfAdmin(context?.auth?.identity)) {
        throw new Error("Permission Denied!");
      }
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

      const identities = await Identity.find(keys)
        .skip((input.page - 1) * input?.limit)
        .limit(input?.limit);

      return identities;
    },

    TalantIdentitySearch: async (_parent, input) => {
      const keys = { publishStatus: "approved", published: true };
      let identities = [];

      if (input.organizationId) {
        const organization = await Organization.findById(input.organizationId);
        keys._id = {
          $in: organization.member
            .filter((x) => !!x.identityId)
            .map((m) => Types.ObjectId(m.identityId)),
        };
      }

      if (input.jobType) {
        keys.interestedEmploymentMode = { $in: input?.jobType?.split(",") };
      }

      if (input.jobInterested) {
        keys.interestedIndustry = { $in: input?.jobInterested?.split(",") };
      }

      identities = await Identity.find(keys)
        .skip((input.page - 1) * input?.limit)
        .limit(input?.limit);

      return identities;
    },

    AdminIdentityGet: async (_parent, { id }, context) => {
      if (!checkIfAdmin(context?.auth?.identity)) {
        throw new Error("Permission Denied!");
      }

      const identity = await Identity.findById(id);
      identity.id = identity._id;

      return identity;
    },

    OrganizationIdentityGet: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {
      const identity = await Identity.findById(identityId);
      identity.id = identity._id;

      return identity;
    },

    IdentityMeGet: async (_parent, params, context) => {
      if (!context?.auth?.identity) {
        throw new Error("Permission Denied!");
      }
      return Identity.findById(context?.auth?.identity._id);
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
          encodeURIComponent(
            `賽馬會共融・知行計劃一次性電話驗證碼:${phoneVerify.otp}`
          )
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
 
          case "phone+otp+password"
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
          );
          await emailVerify.delete();

          // const _user = user.toObject();
          // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
          const tokenObject = await generateToken(user);
          const token = tokenObject._id;

          nookies.set(context, "jciep-token", token, { path: "/" });

          return user;
        }
      } else if (input?.email && input?.otp) {
        const emailOTPVerify = await EmailVerify.findOne({
          email: input?.email,
          otp: input?.otp,
        });
        if (!emailOTPVerify) {
          throw new Error("EmailOTP: Invalid OTP");
        } else {
          await emailOTPVerify.delete();
          const user = await User.findOneAndUpdate(
            { email: input.email },
            {
              email: input.email,
              password: await User.generateHash(input?.password),
            },
            { upsert: true, new: true }
          );

          const tokenObject = await generateToken(user);
          const token = tokenObject._id;

          nookies.set(context, "jciep-token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
          });
          return user;
        }
      } else if (input?.email && input?.password) {
        const user = await User.findOne({
          email: input?.email.trim(),
        });
        if (await user?.comparePassword(input?.password)) {
          // const _user = user.toObject();
          // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
          const tokenObject = await generateToken(user);
          const token = tokenObject._id;

          nookies.set(context, "jciep-token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
          });
          return user;
        } else {
          throw new Error("Wrong Email and Password!");
        }
      } else if (input?.phone && input?.otp) {
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
            {
              phone: input.phone,
              password: await User.generateHash(input?.password),
            },
            { upsert: true, new: true }
          );

          // const _user = user.toObject();
          // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
          const tokenObject = await generateToken(user);
          const token = tokenObject._id;

          nookies.set(context, "jciep-token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
          });
          return user;
        }
      } else if (input?.phone && input?.password) {
        const user = await User.findOne({
          phone: input?.phone.trim(),
        });
        if (await user?.comparePassword(input?.password)) {
          // const _user = user.toObject();
          // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
          const tokenObject = await generateToken(user);
          const token = tokenObject._id;

          nookies.set(context, "jciep-token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
          });
          return user;
        } else {
          throw new Error("Wrong Phone and Password!");
        }
      } else if (input.facebookToken) {
        const snsMeta = await facebook.getProfile(input.facebookToken);
        if (!snsMeta) {
          throw new Error("failed to login via facebook");
        }

        let user = await User.findOne({ facebookId: snsMeta.id });
        if (!user) {
          user = await new User({ facebookId: snsMeta.id }).save();
        }
        // const _user = user.toObject();
        // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
        const tokenObject = await generateToken(user);
        const token = tokenObject._id;
        user.snsMeta = snsMeta;
        await user.save();
        nookies.set(context, "jciep-token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });
        return user;
      } else if (input.googleToken) {
        let snsMeta = await google.getProfile(input.googleToken);
        if (!snsMeta) {
          throw new Error("failed to login via google");
        }

        let user = await User.findOne({ googleId: snsMeta.id });
        if (!user) {
          user = await new User({ googleId: snsMeta.id }).save();
        }
        // const _user = user.toObject();
        // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
        const tokenObject = await generateToken(user);
        const token = tokenObject._id;
        user.snsMeta = snsMeta;
        await user.save();

        nookies.set(context, "jciep-token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });
        return user;
      } else if (input.appleToken) {
        let snsMeta = await apple.getProfile(input.appleToken, input.platform);
        if (!snsMeta) {
          throw new Error("failed to login via apple");
        }

        let user = await User.findOne({ appleId: snsMeta.id });
        if (!user) {
          user = await new User({ appleId: snsMeta.id }).save();
        }
        // const _user = user.toObject();
        // const token = jwt.sign(_user, serverRuntimeConfig.JWT_SALT).toString();
        const tokenObject = await generateToken(user);
        const token = tokenObject._id;
        user.snsMeta = snsMeta;
        await user.save();

        nookies.set(context, "jciep-token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });
        return user;
      }

      return null;
    },

    UserLogout: async (_parent, params, context) => {
      const token = nookies.get(context)?.["jciep-token"];
      await AccessToken.findByIdAndDelete(token);
      nookies.destroy(context, "jciep-token", { path: "/" });
      return true;
    },

    UserPasswordResetPhoneSend: async (_parent, { phone }) => {
      try {
        const phoneVerify = await PhoneVerify.create({
          phone,
          meta: { type: "resetPassword" },
        });
        let result = await sendSms(
          phoneVerify.phone,
          encodeURIComponent(
            `賽馬會共融・知行計劃一次性電話驗證碼:${phoneVerify.otp}`
          )
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

    UserPasswordResetEmailSend: async (_parent, { email }) => {
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

    UserPasswordResetEmailOTPSend: async (_parent, { email }) => {
      try {
        const emailVerify = await EmailVerify.create({
          email,
          meta: { type: "resetPassword" },
        });

        await sendResetPassword(
          email,
          {
            description: `請輸入以下驗證碼以繼續<br/>${emailVerify.otp}`,
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

    UserPasswordResetByConsole: async (_parent, { email, phone, password }) => {
      try {
        if (email) {
          let user = await User.findOne({ email });
          if (user?.id) {
            const user = await User.findOneAndUpdate(
              { email: email },
              {
                email: email,
                password: await User.generateHash(password),
              },
              { upsert: true, new: true }
            );
          }
        }

        if (phone) {
          let user = await User.findOne({ phone });
          if (user?.id) {
            const user = await User.findOneAndUpdate(
              { phone: phone },
              {
                phone: phone,
                password: await User.generateHash(password),
              },
              { upsert: true, new: true }
            );
          }
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
        age: input?.age,
        district: input?.district,
        interestedEmploymentMode: input?.interestedEmploymentMode,
        interestedIndustryOther: input?.interestedIndustryOther,
        interestedIndustry: input?.interestedIndustry,
        industry: input?.industry,
        industryOther: input?.industryOther,
        currentIndustry: input?.currentIndustry,
        pwdOther: input?.pwdOther,
        wishToDo: input?.wishToDo,
        wishToDoOther: input?.wishToDoOther,
        phase2profile: input?.phase2profile,
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
                status: "joined",
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

        identity.organizationRole = await getIdentityOrganizationRole(input.id);

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

    PortfolioPublishRequest: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {
      const currentIdentity = context?.auth?.identity;
      if (
        !checkIfAdmin(currentIdentity) &&
        !isJoinedOrganizationStaff(currentIdentity, organizationId) &&
        currentIdentity._id === identityId
      ) {
        throw new Error("Permission Denied!");
      }

      const identity = await Identity.findById(identityId);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (!["draft", "rejected"].includes(identity?.publishStatus)) {
        return false;
      }
      identity.publishStatus = "pending";
      identity.published = false;
      await identity.save();

      if (organizationId) {
        const organization = await Organization.findById(organizationId);
        if (organization?.contactEmail) {
          let host = publicRuntimeConfig.HOST_URL ?? "http://localhost:3000";

          sendPortfolioPublishRequest(
            organization?.contactEmail,
            {
              url: `${host}`,
              description: `你好，<br/>你的機構會員 ${identity?.chineseName} 已於「人才庫」完成個人履歷，正等待批核，請登入網頁處理申請。<br/>如有查詢，請致電3917 4762（陳小姐）或電郵至<a href="mailto:jcicp@hku.hk">jcicp@hku.hk</a>。`,
              descriptionOther: `賽馬會共融．知行計劃<br/>此電郵由電腦系統自動傳送，請勿回覆此電郵。`,
              button_text: "連結",
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
        }
      }
      return true;
    },

    PortfolioPublishApprove: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {
      const currentIdentity = context?.auth?.identity;
      if (
        !checkIfAdmin(currentIdentity) &&
        !isJoinedOrganizationStaff(currentIdentity, organizationId)
      ) {
        throw new Error("Permission Denied!");
      }

      const identity = await Identity.findById(identityId);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (identity?.publishStatus !== "pending") {
        return false;
      }
      identity.publishStatus = "approved";
      identity.published = true;
      await identity.save();

      if (identity?.email) {
        let host = publicRuntimeConfig.HOST_URL ?? "http://localhost:3000";

        sendPortfolioPublishStatusUpdate(
          identity?.email,
          {
            url: `${host}`,
            description: `${identity?.chineseName}你好，<br/>你的機構已處理你於「人才庫」提交的個人履歷，請登入以下網頁查看批核狀態。<br/>`,
            descriptionOther: `如有查詢，請致電3917 4762（陳小姐）或電郵至<a href="mailto:jcicp@hku.hk">jcicp@hku.hk</a>。`,
            button_text: "連結",
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
      }


      return true;
    },

    PortfolioPublishReject: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {
      const currentIdentity = context?.auth?.identity;
      if (
        !checkIfAdmin(currentIdentity) &&
        !isJoinedOrganizationStaff(currentIdentity, organizationId)
      ) {
        throw new Error("Permission Denied!");
      }

      const identity = await Identity.findById(identityId);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (identity?.publishStatus !== "pending") {
        return false;
      }
      identity.publishStatus = "rejected";
      identity.published = false;
      await identity.save();

      if (identity?.email) {
        let host = publicRuntimeConfig.HOST_URL ?? "http://localhost:3000";

        sendPortfolioPublishStatusUpdate(
          identity?.email,
          {
            url: `${host}`,
            description: `${identity?.chineseName}你好，<br/>你的機構已處理你於「人才庫」提交的個人履歷，請登入以下網頁查看批核狀態。<br/>`,
            descriptionOther: `如有查詢，請致電3917 4762（陳小姐）或電郵至<a href="mailto:jcicp@hku.hk">jcicp@hku.hk</a>。`,
            button_text: "連結",
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
      }

      return true;
    },

    PortfolioUnpublish: async (
      _parent,
      { organizationId, identityId },
      context
    ) => {
      const currentIdentity = context?.auth?.identity;
      if (
        !checkIfAdmin(currentIdentity) &&
        !isJoinedOrganizationStaff(currentIdentity, organizationId) &&
        currentIdentity._id === identityId
      ) {
        throw new Error("Permission Denied!");
      }

      const identity = await Identity.findById(identityId);
      if (identity?.type !== "pwd") {
        return false;
      }
      if (["rejected", "draft"].includes(identity?.publishStatus)) {
        return false;
      }
      identity.publishStatus = "draft";
      identity.published = false;
      await identity.save();

      if (identity?.email) {
        let host = publicRuntimeConfig.HOST_URL ?? "http://localhost:3000";

        sendPortfolioPublishStatusUpdate(
          identity?.email,
          {
            url: `${host}`,
            description: `${identity?.chineseName}你好，<br/>你的機構已處理你於「人才庫」提交的個人履歷，請登入以下網頁查看批核狀態。<br/>`,
            descriptionOther: `如有查詢，請致電3917 4762（陳小姐）或電郵至<a href="mailto:jcicp@hku.hk">jcicp@hku.hk</a>。<br/>賽馬會共融．知行計劃<br/>此電郵由電腦系統自動傳送，請勿回覆此電郵。`,
            button_text: "連結",
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
      }



      return true;
    },
  },
};

import { EmailVerify, PhoneVerify, User } from "./user.model";
import nookies from "nookies";
import jwt from "jsonwebtoken";
export default {
  Query: {
    UserEmailValidityCheck: async (_parent, { token }) => {
      try {
        return await EmailVerify.findOne({ token });
      } catch (error) {
        return null;
      }
    },

    IdentityGet: async () => {
      /**
       * Get My User Profile
       */
    },

    IdentitySearch: async () => {
      /**
       * Search User
       */
    },
  },
  Mutation: {
    UserPhoneVerify: async (_parent, { phone }) => {
      /**
       * Send a SMS mesege with a 6-digit code to phone.
       */
      try {
        const phoneVerify = await PhoneVerify.create({ phone });
        return true;
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
        const emailVerify = await EmailVerify.create({ email });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    UserLogin: async (_parent, { input }, { user, res }) => {
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
          );
          await emailVerify.delete();
          return user;
        }
      } else if (input?.email && input?.password) {
        const user = await User.findOne({ email: input?.email.trim() });
        if (await user?.comparePassword(input?.password)) {
          nookies.set(
            { res },
            "x-token",
            jwt.sign(user.toObject(), "shhhhh").toString(),
            {
              maxAge: 30 * 24 * 60 * 60,
              path: "",
              httpOnly: true,
              secure: true,
            }
          );
          return user;
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
            { phone: phoneVerify?.phone },
            { phone: phoneVerify?.phone },
            { upsert: true, new: true }
          );
          return user;
        }
      }
      return null;
    },

    UserLogout: (_parent, args, { res }) => {
      nookies.destroy({ res }, "x-token", {
        maxAge: 30 * 24 * 60 * 60,
        path: "",
        httpOnly: true,
        secure: true,
      });
      return true;
    },

    UserPasswordResetEmailSend: (_parent, { email }) => {
      /**
       * Send password reset email with reset link + md5_token
       */
    },

    UserPasswordReset: (_parent, { token, password }) => {
      /**
       * email is decoded from token
       * Verify token and reset password
       */
    },

    IdentityCreate: () => {
      /**
       * Admin can create an identity for any user
       * Staff and Employer can create identity for the users that are members under his/her organization with role = pwd
       * Pwd/Public can create identity for his own account.
       */
    },

    IdentityCreate: () => {
      /**
       * Admin can update an identity for any user
       * Staff and Employer can update identity under his/her organization
       * Pwd/Public can update identity for his own account.
       */
    },
  },
};

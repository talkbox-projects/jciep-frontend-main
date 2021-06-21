export default {
  Query: {
    UserEmailValidityCheck: async (_parent, params) => {},

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
    UserPhoneVerify: async (_parent, params) => {
      /**
       * Send a SMS message with a 6-digit code to phone.
       */
    },
    UserEmailVerify: async (_parent, params) => {
      /**
       * Send an email with a verification link (md5 token) to inbox.
       */
    },
    UserLogin: async (_parent, { input }) => {
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

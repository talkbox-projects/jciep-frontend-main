import { useAppContext } from "../../../../store/AppStore";
import React from "react";
import EmailRequestResetPassword from "../../../../components/mobile/resetPassword/EmailRequestResetPassword"
import EmailOtpVerify from "../../../../components/mobile/resetPassword/EmailOtpVerify"
import EmailResetPassword from "../../../../components/mobile/resetPassword/EmailResetPassword"

const EmailResetPasswordWrap = () => {
  const {
    resetPasswordStatus
  } = useAppContext();

  switch (resetPasswordStatus?.step) {
    case "requestOtp":
        return (<EmailRequestResetPassword/>)

    case "verify":
        return (<EmailOtpVerify/>)

    case "resetPassword":
        return (<EmailResetPassword/>)
  
    default:
        return (<></>)
  }
};

export default EmailResetPasswordWrap;

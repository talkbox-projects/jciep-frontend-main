import { useAppContext } from "../../../../store/AppStore";
import React from "react";
import EmailRequestResetPassword from "../../../../components/mobile/resetPassword/EmailRequestResetPassword"
import OtpVerify from "../../../../components/mobile/resetPassword/OtpVerify"
import PhoneResetPassword from "../../../../components/mobile/resetPassword/PhoneResetPassword"

const EmailResetPasswordWrap = () => {
  const {
    resetPasswordStatus
  } = useAppContext();

  switch (resetPasswordStatus?.step) {
    case "requestOtp":
        return (<EmailRequestResetPassword/>)

    case "verify":
        return (<OtpVerify/>)

    case "resetPassword":
        return (<PhoneResetPassword/>)
  
    default:
        return (<></>)
  }
};

export default EmailResetPasswordWrap;

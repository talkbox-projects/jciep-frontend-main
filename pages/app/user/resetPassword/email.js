import { useAppContext } from "../../../../store/AppStore";
import React from "react";
import EmailRequestResetPassword from "../../../../components/mobile/resetPassword/EmailRequestResetPassword"
import EmailOtpVerify from "../../../../components/mobile/resetPassword/EmailOtpVerify"
import EmailResetPassword from "../../../../components/mobile/resetPassword/EmailResetPassword"

const EmailResetPasswordWrap = ({page}) => {
  const {
    resetPasswordStatus
  } = useAppContext();

  switch (resetPasswordStatus?.step) {
    case "requestOtp":
        return (<EmailRequestResetPassword page={page}/>)

    case "verify":
        return (<EmailOtpVerify page={page}/>)

    case "resetPassword":
        return (<EmailResetPassword page={page}/>)
  
    default:
        return (<></>)
  }
};

export default EmailResetPasswordWrap;

import { useAppContext } from "../../../../store/AppStore";
import React from "react";
import PhoneRequestResetPassword from "../../../../components/mobile/resetPassword/PhoneRequestResetPassword"
import OtpVerify from "../../../../components/mobile/resetPassword/OtpVerify"
import PhoneResetPassword from "../../../../components/mobile/resetPassword/PhoneResetPassword"

const PhoneResetPasswordWrap = ({page}) => {
  const {
    resetPasswordStatus
  } = useAppContext();

  switch (resetPasswordStatus?.step) {
    case "requestOtp":
        return (<PhoneRequestResetPassword page={page}/>)

    case "verify":
        return (<OtpVerify page={page}/>)

    case "resetPassword":
        return (<PhoneResetPassword page={page}/>)
  
    default:
        return (<></>)
  }
};

export default PhoneResetPasswordWrap;


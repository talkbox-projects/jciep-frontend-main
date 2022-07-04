import { useAppContext } from "../../../../store/AppStore";
import React from "react";
import PhoneRequestResetPassword from "../../../../components/mobile/resetPassword/PhoneRequestResetPassword"
import OtpVerify from "../../../../components/mobile/resetPassword/OtpVerify"
import PhoneResetPassword from "../../../../components/mobile/resetPassword/PhoneResetPassword"

const PhoneResetPasswordWrap = () => {
  const {
    resetPasswordStatus
  } = useAppContext();

  switch (resetPasswordStatus?.step) {
    case "requestOtp":
        return (<PhoneRequestResetPassword/>)

    case "verify":
        return (<OtpVerify/>)

    case "resetPassword":
        return (<PhoneResetPassword/>)
  
    default:
        return (<></>)
  }
};

export default PhoneResetPasswordWrap;

const nodemailer = require("nodemailer");
const html = require("./templates/activation.js").default;

import getConfig from "next/config";
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

const transporter = {
  production: nodemailer.createTransport({
    host: serverRuntimeConfig.SMTP_HOST,
    port: serverRuntimeConfig.SMTP_PORT,
    secure: false,
    auth: {
      user: serverRuntimeConfig.SMTP_USERNAME,
      pass: serverRuntimeConfig.SMTP_PASSWORD,
    },
  }),
  development: nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: "cf787698eb2171",
      pass: "30b46ed4217152",
    },
  }),
};

const sendMail = (receiver, subject, content, attachments = []) => {
  transporter[publicRuntimeConfig.NODE_ENV].sendMail(
    {
      from: serverRuntimeConfig.SMTP_SENDER,
      to: receiver,
      subject: subject,
      html: content,
      attachments,
    },
    () => {
      console.log("sent to " + receiver);
    }
  );
};

const send = (receiver, params, attachments) => {
  const subject = "《賽馬會共融・知行計劃》註冊申請";
  sendMail(
    receiver,
    subject,
    Object.entries(params).reduce(
      (_html, [key, value]) => _html.replace(`{{${key}}}`, value),
      html
    ),
    attachments
  );
};

export default send;

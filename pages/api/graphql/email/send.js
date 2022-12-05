import nodemailer from "nodemailer";
import html from "./templates/activation.js";
import htmlResetPasswordTemplate from "./templates/resetPassword.js";
import htmlPortfolioTemplate from "./templates/portfolioPublishRequest.js";

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
      user: "94964fd2b8c178",
      pass: "d3cb43ff5e4348",
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

export const sendResetPassword = (receiver, params, attachments) => {
  const subject = "《賽馬會共融・知行計劃》重設密碼";
  sendMail(
    receiver,
    subject,
    Object.entries(params).reduce(
      (_html, [key, value]) => _html.replace(`{{${key}}}`, value),
      htmlResetPasswordTemplate
    ),
    attachments
  );
};

export const sendPortfolioPublishRequest = (receiver, params, attachments) => {
  const subject = "《賽馬會共融・知行計劃》會員已完成資料庫，等待批核";
  sendMail(
    receiver,
    subject,
    Object.entries(params).reduce(
      (_html, [key, value]) => _html.replace(`{{${key}}}`, value),
      htmlPortfolioTemplate
    ),
    attachments
  );
};

export const sendPortfolioPublishStatusUpdate = (receiver, params, attachments) => {
  const subject = "《賽馬會共融・知行計劃》個人履歷已批核";
  sendMail(
    receiver,
    subject,
    Object.entries(params).reduce(
      (_html, [key, value]) => _html.replace(`{{${key}}}`, value),
      htmlPortfolioTemplate
    ),
    attachments
  );
};

export default send;

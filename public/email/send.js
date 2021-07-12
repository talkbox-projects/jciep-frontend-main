const nodemailer = require("nodemailer");
const nodemailerSendGrid = require("nodemailer-sendgrid");
const html = require("./templates/activation.js").default;
const path = require("path");

const transporter = {
  production: nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  }),
  development: nodemailer.createTransport(
    nodemailerSendGrid({
      apiKey:
        "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",
    })
  ),
};

const sendMail = (receiver, subject, content, attachments = []) => {
  transporter[process.env.NODE_ENV].sendMail(
    {
      from: process.env.SMTP_SENDER,
      to: receiver,
      subject: subject,
      html,
      attachments: [],
    },
    () => {
      console.log("sent to " + receiver);
    }
  );
};

const send = (receiver, url, templateKey) => {
  console.log("email template ready");

  const subject = "《賽馬會共融・知行計劃》註冊申請";
  const host = process.env.HOST_URL
    ? process.env.HOST_URL
    : "http://localhost:3000";
  sendMail(receiver, subject, html.replace("{{url}}", url), [
    {
      filename: "logo-jc-hku.png",
      path: `${host}/email/templates/assets/img/logo-jc-hku.png`,
      cid: "logo-jc-hku",
    },
    {
      filename: "banner-jc-hku.png",
      path: `${host}/email/templates/assets/img/banner-jc-hku.png`,
      cid: "banner-jc-hku",
    },
  ]);
};

export default send;

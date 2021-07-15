const nodemailer = require("nodemailer");
const html = require("./templates/activation.js").default;

const transporter = {
  production: nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
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
  transporter[process.env.NODE_ENV].sendMail(
    {
      from: process.env.SMTP_SENDER,
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

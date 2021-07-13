const nodemailer = require("nodemailer");
const html = require("./templates/activation.js").default;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = (receiver, subject, content) => {
  transporter.sendMail(
    {
      from: process.env.SMTP_SENDER,
      to: receiver,
      subject: subject,
      html: content,
      attachments: [],
    },
    () => {
      console.log("sent to " + receiver);
    }
  );
};

const send = (receiver, params) => {
  const subject = "《賽馬會共融・知行計劃》註冊申請";
  sendMail(
    receiver,
    subject,
    Object.entries(params).reduce(
      (_html, [key, value]) => _html.replace(`{{${key}}}`, value),
      html
    )
  );
};

export default send;

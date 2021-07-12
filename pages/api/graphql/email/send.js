const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = (receiver, subject, content, attachments = []) => {
  transporter.sendMail(
    {
      from: process.env.SMTP_SENDER,
      to: receiver,
      subject: subject,
      html: content,
      attachments: attachments,
    },
    () => {
      console.log("sent to " + receiver);
    }
  );
};

const send = (receiver, url, template) => {
  fs.readFile(`./email/${template}.html`, "utf8", function (err, content) {
    console.log("email template ready");

    const subject = "《賽馬會共融・知行計劃》註冊申請";

    sendMail(receiver, subject, content.replace("{{url}}", url), [
      {
        filename: "logo-jc-hku.png",
        path: "./email/assets/img/logo-jc-hku.png",
        cid: "logo-jc-hku",
      },
      {
        filename: "banner-jc-hku.png",
        path: "./email/assets/img/banner-jc-hku.png",
        cid: "banner-jc-hku",
      },
    ]);
  });
};

export default send;

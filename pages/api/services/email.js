const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

// Parameters
//  - To
//  - Subject
//  - Text
//  - Html

exports.sendEmail = ({ To, Subject, Text, Html }) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to: To,
      from: "timtalkbox@gmail.com",
      subject: Subject,
      text: Text,
    };

    sgMail
      .send(msg)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response.body);
      });
  });
};

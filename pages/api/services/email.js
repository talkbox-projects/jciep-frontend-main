import sgMail from "@sendgrid/mail";
sgMail.setApiKey(
  "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"
);

// Parameters
//  - To
//  - Subject
//  - Text
//  - Html

export const sendEmail = ({ To, Subject, Text }) => {
  return new Promise((resolve) => {
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

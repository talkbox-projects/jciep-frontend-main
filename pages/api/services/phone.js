const client = require("twilio")(
  "AC6b59cabdd00a933168e216a3c56b69a2",
  "74f52d02f882b2aeed86ba2a51691d82"
);

exports.sendSms = ({ Body, To }) => {
  return client.messages.create({
    body: Body,
    from: "+18035909773",
    to: To,
  });
};

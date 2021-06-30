const client = require('twilio')("AC6b59cabdd00a933168e216a3c56b69a2", "da21b5917139e878c133ad31dab3a401");
// Parameters 
//  - To
//  - Body


exports.sendSms = ({Body, To}) => {
    client.messages
    .create({
        body: Body,
        from: '+18035909773',
        to: To
    })
}

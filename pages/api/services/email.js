const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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")


// Parameters 
//  - To
//  - Subject
//  - Text
//  - Html

exports.sendEmail = ({To, Subject, Text, Html }) => {
    return new Promise((resolve, reject) => {
        const msg = {
            to: To, 
            from: 'timtalkbox@gmail.com', 
            subject: Subject,
            text: Text
        }
    
        sgMail
            .send(msg)
            .then((response) => {
                console.log('***********')
                resolve(response)
            })
            .catch((error) => {
                console.log(error.response.body)
                resolve(error.response.body)
            })
    })
    
}

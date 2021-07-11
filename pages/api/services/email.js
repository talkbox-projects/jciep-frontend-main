const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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")


// Parameters 
//  - To
//  - Subject
//  - Text
//  - Html

exports.sendEmail = ({To, Subject, Text, Html }) => {
    return new Promise((resolve, reject) => {
        console.log('yes')
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

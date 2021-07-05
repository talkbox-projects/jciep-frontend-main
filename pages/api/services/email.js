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

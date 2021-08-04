const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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")



const struct1 = {{
    messages: [
        { id: "m1", sender: { userId: "u1", name: "Tim" }, message: "Hi, this is Tim." },
        { id: "m2", sender: { userId: "u1", name: "Michael" }, message: "Nice to meet you!", replyTo: "m1" },
        { id: "m3", sender: { userId: "u1", name: "Any" }, message: "Welcome aboard", replyTo: "m1" },
        { id: "m4", sender: { userId: "u1", name: "Tim" }, message: "Thanks all" }
    ],
}

const struct2 = {
    messages: {
        "m1": { id: "m1", senderId: "u1", message: "Hi, this is Tim." },
        "m2": { id: "m2", senderId: "u2", message: "Nice to meet you!", replyTo: "m1" },
        "m3": { id: "m3", senderId: "u3", message: "Welcome aboard", replyTo: "m1" },
        "m4": { id: "m4", senderId: "u1", message: "Thanks all" }
    },
    senders: {
        "u1": { id: "u1", username: "Tim" },
        "u2": { id: "u2", username: "Michael" },
        "u3": { id: "u3", username: "Andy" },
    }
}


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

const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                service: 'gmail',   
                host:process.env.MAIL_HOST,
                 //add certification
                 port: 587,
                 secure: false,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'SkillSync || Binary Blenders',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error);
        //throw right error
        throw error;
    }
}


module.exports = mailSender;
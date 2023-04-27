import { createTestAccount, createTransport } from "nodemailer"

export const TRANSPORTER = createTestAccount().then(account => {
    console.log('Test account created')
    
    return createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    })
})
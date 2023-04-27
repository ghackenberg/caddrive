import { createTestAccount, createTransport } from "nodemailer"
import { nodemailerMjmlPlugin } from "nodemailer-mjml"

export const TRANSPORTER = createTestAccount().then(account => {
    return createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    })
}).catch(() => {
    return createTransport({
        jsonTransport: true
    })
}).then(transport => {
    transport.use('compile', nodemailerMjmlPlugin({ templateFolder: 'templates' }))
    return transport
})
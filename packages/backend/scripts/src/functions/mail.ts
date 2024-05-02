import { createTestAccount, createTransport } from "nodemailer"
import { nodemailerMjmlPlugin } from "nodemailer-mjml"

const SMTP_HOST = process.env['SMTP_HOST']
const SMTP_PORT = process.env['SMTP_PORT']
const SMTP_SECURE = process.env['SMTP_SECURE']
const SMTP_AUTH_USER = process.env['SMTP_AUTH_USER']
const SMTP_AUTH_PASS = process.env['SMTP_AUTH_PASS']

async function create() {
    if (SMTP_HOST && SMTP_PORT && SMTP_SECURE && SMTP_AUTH_USER && SMTP_AUTH_PASS) {
        console.log('Using env SMTP server connection')
        return createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_SECURE == 'true',
            auth: {
                user: SMTP_AUTH_USER,
                pass: SMTP_AUTH_PASS
            }
        })
    } else {
        try {
            const account = await createTestAccount()
            console.log('Using test SMTP server connection')
            return createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })
        } catch (error) {
            console.log('Using stub SMTP server connection')
            return createTransport({
                jsonTransport: true
            })
        }
    }
}

async function initialize() {
    const transport  = await create()

    transport.use('compile', nodemailerMjmlPlugin({ templateFolder: 'templates' }))

    return transport
}

export const TRANSPORTER = initialize()
import nodemailer from 'nodemailer'

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GMAIL_APP_PW
    }
  })

  return transporter
}

export default async emailOptions => {
  const emailTransporter = await createTransporter()
  const res = await emailTransporter.sendMail(emailOptions)
  emailTransporter.close()
  return res
}

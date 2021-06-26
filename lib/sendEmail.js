import { google } from 'googleapis'
import nodemailer from 'nodemailer'

const createTransporter = async () => {
  const OAuth2 = google.auth.OAuth2

  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject('Failed to create access token :(')
      }
      resolve(token)
    })
  })

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PW,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken
    }
  })

  return transporter
}

export default async emailOptions => {
  const emailTransporter = await createTransporter()
  await emailTransporter.sendMail(emailOptions)
  emailTransporter.close()
}

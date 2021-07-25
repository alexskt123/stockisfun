import { sendUserPriceMA, sendUserByID } from '@/lib/email/emailOptions'
import sendEmail from '@/lib/sendEmail'

export default async (req, res) => {
  const { type, id, uid } = req.query

  const options =
    type === 'priceMA'
      ? await sendUserPriceMA()
      : type === 'id'
      ? await sendUserByID(id, uid)
      : null

  const response = await Promise.all(
    options.map(async option => {
      return sendEmail(option)
    })
  )

  res.statusCode = 200
  res.json(response)
}

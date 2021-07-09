import { sendUserPriceMA, sendUserByID } from '@/lib/email/emailOptions'
import axios from 'axios'

export default async (req, res) => {
  const { type, id, uid } = req.query

  const options =
    type === 'priceMA'
      ? await sendUserPriceMA()
      : type === 'id'
      ? await sendUserByID(id, uid)
      : null

  const responses = await Promise.all(
    options.map(async option => {
      return await axios.get(process.env.AUTOCODE_SENDEMAIL_ENDPOINT, {
        params: {
          to: option.to,
          subject: option.subject,
          html: option.html
        }
      })
    })
  )

  res.statusCode = 200
  res.json(responses.map(item => item?.data))
}

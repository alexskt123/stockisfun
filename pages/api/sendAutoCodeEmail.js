import { toAxios } from '@/lib/commonFunction'
import { sendUserPriceMA } from '@/lib/email/emailOptions'

export default async (req, res) => {
  const { type } = req.query

  const options = type === 'priceMA' ? await sendUserPriceMA() : null

  const responses = await Promise.all(
    options.map(async option => {
      return await toAxios(process.env.AUTOCODE_SENDEMAIL_ENDPOINT, {
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

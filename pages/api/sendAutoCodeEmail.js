import { sendEmail } from '@/lib/autocodeEmail'
import { sendUserPriceMA } from '@/lib/email/emailOptions'

export default async (req, res) => {
  const { type } = req.query

  const options = type === 'priceMA' ? await sendUserPriceMA() : null

  const responses = await Promise.all(
    options.map(async option => await sendEmail(option))
  )

  res.statusCode = 200
  res.json(responses)
}

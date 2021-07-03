import { sendEmail } from '@/lib/autocodeEmail'
import { sendUserBoughtListMA } from '@/lib/email/emailOptions'

export default async (req, res) => {
  const { type } = req.query

  const options = type === 'boughtList' ? await sendUserBoughtListMA() : null

  const responses = await Promise.all(
    options.map(async option => await sendEmail(option))
  )

  res.statusCode = 200
  res.json(responses)
}

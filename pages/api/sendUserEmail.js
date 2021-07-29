import { sendEmail, sendUserPriceMA, sendUserByID } from '@/lib/email'

export default async (req, res) => {
  const { type, id, uid } = req.query

  const response = {}

  try {
    const options =
      type === 'priceMA'
        ? await sendUserPriceMA()
        : type === 'id'
        ? await sendUserByID(id, uid)
        : null

    const result = await Promise.all(
      options.map(async option => {
        return sendEmail(option)
      })
    )

    response.result = result
  } catch (error) {
    response.error = error.message
  }

  res.statusCode = 200
  res.json(response)
}

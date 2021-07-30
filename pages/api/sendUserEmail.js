import { sendEmail, sendUserByType, sendUserByID } from '@/lib/email'

export default async (req, res) => {
  const { type, id, uid } = req.query

  const response = {}

  const typeFunctPairs = [
    {
      type: 'priceMA',
      funct: sendUserByType,
      params: { type: 'priceMA' }
    },
    {
      type: 'earningsDate',
      funct: sendUserByType,
      params: { type: 'earningsDate' }
    },
    {
      type: 'id',
      funct: sendUserByID,
      params: { id, uid }
    }
  ]

  try {
    const curAction = typeFunctPairs?.find(x => x.type === type)
    const options = await curAction?.funct(curAction?.params)

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

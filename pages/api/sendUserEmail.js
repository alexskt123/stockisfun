import { typeFunctPairsSettings } from '@/config/email'
import { sendEmail } from '@/lib/email'

export default async (req, res) => {
  const { type, id, uid } = req.query
  const typeFunctPairs = typeFunctPairsSettings({ id, uid })

  const response = {}

  try {
    const curAction = typeFunctPairs?.find(x => x.type === type)
    const options = await curAction?.funct(curAction?.params)

    const result = await Promise.all(options.map(option => sendEmail(option)))

    response.result = result
  } catch (error) {
    response.error = error.message
    console.error(error)
  }

  res.statusCode = 200
  res.json(response)
}

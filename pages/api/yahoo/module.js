import { getModulesData } from '@/lib/yahoo'

export default async (req, res) => {
  const { ticker, name } = req.query

  const response = await getModulesData(ticker, name)

  res.statusCode = 200
  res.json(response)
}

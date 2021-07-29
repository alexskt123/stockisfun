import { getMoneyCnn } from '@/lib/forecast/getMoneyCnn'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getMoneyCnn(ticker)

  res.statusCode = 200
  res.json(data)
}

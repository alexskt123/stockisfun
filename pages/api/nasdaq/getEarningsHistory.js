import { getEarningsHistory } from '@/lib/nasdaq/getEarningsHistory'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getEarningsHistory(ticker)

  res.statusCode = 200
  res.json(data)
}

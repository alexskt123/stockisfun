import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooStatistics(ticker)

  res.statusCode = 200
  res.json(data)
}

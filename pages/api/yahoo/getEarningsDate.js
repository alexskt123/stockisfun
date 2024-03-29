import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'

export default async (req, res) => {
  const { ticker } = req.query

  const earningsDate = await getEarningsDate(ticker)

  res.statusCode = 200
  res.json(earningsDate)
}

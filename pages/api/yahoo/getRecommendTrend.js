import { getRecommendTrend } from '@/lib/yahoo/getRecommendTrend'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getRecommendTrend(ticker)

  res.statusCode = 200
  res.json(data)
}

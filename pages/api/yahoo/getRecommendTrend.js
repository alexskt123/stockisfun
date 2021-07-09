//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getRecommendTrend } from '@/lib/yahoo/getRecommendTrend'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getRecommendTrend(ticker)

  res.statusCode = 200
  res.json(data)
}

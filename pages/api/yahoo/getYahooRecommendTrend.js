//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooRecommendTrend } from '../../../lib/yahoo/getYahooRecommendTrend'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooRecommendTrend(ticker)
  
  res.statusCode = 200
  res.json(data)
}

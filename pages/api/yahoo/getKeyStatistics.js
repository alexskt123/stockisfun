//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooStatistics(ticker)

  res.statusCode = 200
  res.json(data)
}

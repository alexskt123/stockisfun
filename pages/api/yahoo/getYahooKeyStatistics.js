//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooKeyStatistics } from '../../../lib/yahoo/getYahooKeyStatistics'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooKeyStatistics(ticker)
  
  res.statusCode = 200
  res.json(data)
}

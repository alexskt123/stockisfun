//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooEarningsDate } from '../../../lib/yahoo/getYahooEarningsDate'

export default async (req, res) => {
  const { ticker } = req.query

  const earningsDate = await getYahooEarningsDate(ticker)


  res.statusCode = 200
  res.json(earningsDate)
}

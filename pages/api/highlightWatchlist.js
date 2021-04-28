//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import { getYahooEarningsDate } from '../../lib/yahoo/getYahooEarningsDate'

export default async (req, res) => {
  const { ticker } = req.query

  const quote = await getYahooQuote(ticker)
  const earningsDate = await getYahooEarningsDate(ticker)

  res.statusCode = 200
  res.json({ ...quote, earningsDate: earningsDate.fmt })
}

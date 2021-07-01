//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getMoneyCnnCouple } from '@/lib/forecast/getMoneyCnn'
import { getYahooQuote } from '@/lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getMoneyCnnCouple(ticker)
  const quote = await getYahooQuote(ticker)

  res.statusCode = 200
  res.json({ ticker, price: quote.regularMarketPrice, ...data })
}

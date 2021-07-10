//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getMoneyCnnCouple } from '@/lib/forecast/getMoneyCnn'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getMoneyCnnCouple(ticker)
  const quoteArr = await getQuote(ticker)
  const quote = quoteArr.find(x => x) || {}

  res.statusCode = 200
  res.json({ ticker, price: quote.regularMarketPrice, ...data })
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query
  const tickers = [].concat(ticker)

  const data = await getQuote(tickers)

  res.statusCode = 200
  res.json(data)
}

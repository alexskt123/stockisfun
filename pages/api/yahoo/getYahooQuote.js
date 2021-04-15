//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooQuote, getYahooMultiQuote } from '../../../lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = ticker.split(',').length > 1 ? await getYahooMultiQuote(ticker) : await getYahooQuote(ticker)
  
  res.statusCode = 200
  res.json(data)
}

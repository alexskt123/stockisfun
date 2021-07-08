//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getQuote, getMultiQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data =
    ticker.split(',').length > 1
      ? await getMultiQuote(ticker)
      : await getQuote(ticker)

  res.statusCode = 200
  res.json(data)
}

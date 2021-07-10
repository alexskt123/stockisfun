//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const quoteArr = await getQuote(ticker)
  const quote = quoteArr.find(x => x) || {}
  const earningsDate = quoteArr.find(x => x)
    ? await getEarningsDate(ticker)
    : null

  res.statusCode = 200
  res.json({ ...quote, earningsDate: earningsDate.fmt })
}

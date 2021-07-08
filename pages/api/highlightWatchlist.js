//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const quote = await getQuote(ticker)
  const earningsDate = await getEarningsDate(ticker)

  res.statusCode = 200
  res.json({ ...quote, earningsDate: earningsDate.fmt })
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getStockEarningCapacity } from '@/lib/stockInfo'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const quote = await getQuote(ticker)

  const earningCapacity = await getStockEarningCapacity(ticker)

  res.statusCode = 200
  res.json({
    ...quote,
    ...earningCapacity
  })
}

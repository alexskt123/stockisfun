//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getStockEarningCapacity } from '@/lib/commonFunction'
import { getYahooBalanceSheet } from '@/lib/yahoo/getYahooBalanceSheet'
import { getYahooCashflowStatement } from '@/lib/yahoo/getYahooCashflowStatement'
import { getYahooEarnings } from '@/lib/yahoo/getYahooEarnings'
import { getYahooQuote } from '@/lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getYahooEarnings(ticker)
  const cashflow = await getYahooCashflowStatement(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)
  const quote = await getYahooQuote(ticker)

  const earningCapacity = getStockEarningCapacity(
    earnings,
    cashflow,
    balanceSheet
  )

  res.statusCode = 200
  res.json({
    ...quote,
    ...earningCapacity
  })
}

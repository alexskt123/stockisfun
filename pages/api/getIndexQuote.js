//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import { getYahooEarnings } from '../../lib/yahoo/getYahooEarnings'
import { getYahooCashflowStatement } from '../../lib/yahoo/getYahooCashflowStatement'
import { getYahooBalanceSheet } from '../../lib/yahoo/getYahooBalanceSheet'
import { getStockEarningCapacity } from '../../lib/commonFunction'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getYahooEarnings(ticker)
  const cashflow = await getYahooCashflowStatement(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)
  const quote = await getYahooQuote(ticker)

  const earningCapacity = getStockEarningCapacity(earnings, cashflow, balanceSheet)

  res.statusCode = 200
  res.json({
    ...quote,
    ...earningCapacity
  })
}

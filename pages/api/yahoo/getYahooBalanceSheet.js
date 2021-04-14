//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooBalanceSheet } from '../../../lib/yahoo/getYahooBalanceSheet'
import { getYahooBalanceSheetData } from '../../../lib/stockDetailsFunction'

export default async (req, res) => {
  const { ticker } = req.query

  const balanceSheet = await getYahooBalanceSheet(ticker)
  const balanceSheetExtract = getYahooBalanceSheetData(balanceSheet)

  res.statusCode = 200
  res.json([...balanceSheetExtract])
}

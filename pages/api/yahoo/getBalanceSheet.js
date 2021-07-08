//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getBalanceSheetData } from '@/lib/stockDetailsFunction'
import { getBalanceSheet } from '@/lib/yahoo/getBalanceSheet'

export default async (req, res) => {
  const { ticker } = req.query

  const balanceSheet = await getBalanceSheet(ticker)
  const balanceSheetExtract = getBalanceSheetData(balanceSheet)

  res.statusCode = 200
  res.json([...balanceSheetExtract])
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  getBalanceSheetData,
  getYahooBasicsData
} from '@/lib/stockDetailsFunction'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getBalanceSheet } from '@/lib/yahoo/getBalanceSheet'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getAssetProfile(ticker)
  const quote = await getQuote(ticker)
  const balanceSheet = await getBalanceSheet(ticker)

  const balanceSheetExtract = getBalanceSheetData(balanceSheet)
  const newData = getYahooBasicsData(data, quote)

  res.statusCode = 200
  res.json({
    basics: { ...newData },
    balanceSheet: [...balanceSheetExtract]
  })
}

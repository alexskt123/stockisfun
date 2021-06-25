//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  getYahooBalanceSheetData,
  getYahooBasicsData
} from '../../../lib/stockDetailsFunction'
import { getYahooAssetProfile } from '../../../lib/yahoo/getYahooAssetProfile'
import { getYahooBalanceSheet } from '../../../lib/yahoo/getYahooBalanceSheet'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooAssetProfile(ticker)
  const quote = await getYahooQuote(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)

  const balanceSheetExtract = getYahooBalanceSheetData(balanceSheet)
  const newData = getYahooBasicsData(data, quote)

  res.statusCode = 200
  res.json({
    basics: { ...newData },
    balanceSheet: [...balanceSheetExtract]
  })
}

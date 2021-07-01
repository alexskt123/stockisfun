//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { roundTo, getStockEarningCapacity } from '@/lib/commonFunction'
import { getYahooAssetProfile } from '@/lib/yahoo/getYahooAssetProfile'
import { getYahooFinancialData } from '@/lib/yahoo/getYahooFinancialData'
import { getYahooIncomeStatement } from '@/lib/yahoo/getYahooIncomeStatement'
import { getYahooQuote } from '@/lib/yahoo/getYahooQuote'
import percent from 'percent'

export default async (req, res) => {
  const { ticker } = req.query

  const income = await getYahooIncomeStatement(ticker)
  const financialData = await getYahooFinancialData(ticker)
  const quote = await getYahooQuote(ticker)
  const assetProfile = await getYahooAssetProfile(ticker)

  const earningCapacity = await getStockEarningCapacity(ticker)

  const grossMargin = percent.calc(
    income.find(x => x)?.grossProfit?.raw,
    income.find(x => x)?.totalRevenue?.raw,
    2,
    true
  )
  const returnOnEquity = financialData?.returnOnEquity?.fmt
  const returnOnAssets = financialData?.returnOnAssets?.fmt
  const trailingPE = quote?.trailingPE ? roundTo(quote?.trailingPE) : 'N/A'
  const industry = assetProfile?.industry

  const data = {
    symbol: ticker,
    trailingPE,
    returnOnEquity: returnOnEquity ? returnOnEquity : 'N/A',
    grossMargin: grossMargin ? grossMargin : 'N/A',
    returnOnAssets: returnOnAssets ? returnOnAssets : 'N/A',
    industry: industry ? industry : 'N/A',
    ...earningCapacity
  }

  res.statusCode = 200
  res.json(data)
}

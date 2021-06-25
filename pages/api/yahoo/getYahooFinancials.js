//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooEarnings } from '../../../lib/yahoo/getYahooEarnings'
import { getYahooIncomeStatement } from '../../../lib/yahoo/getYahooIncomeStatement'
import { getYahooCashflowStatement } from '../../../lib/yahoo/getYahooCashflowStatement'
import { getYahooBalanceSheet } from '../../../lib/yahoo/getYahooBalanceSheet'
import { getYahooFinancialData } from '../../../lib/yahoo/getYahooFinancialData'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'
import { getYahooAssetProfile } from '../../../lib/yahoo/getYahooAssetProfile'
import percent from 'percent'
import { roundTo, getStockEarningCapacity } from '../../../lib/commonFunction'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getYahooEarnings(ticker)
  const income = await getYahooIncomeStatement(ticker)
  const cashflow = await getYahooCashflowStatement(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)
  const financialData = await getYahooFinancialData(ticker)
  const quote = await getYahooQuote(ticker)
  const assetProfile = await getYahooAssetProfile(ticker)

  const earningCapacity = getStockEarningCapacity(
    earnings,
    cashflow,
    balanceSheet
  )

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

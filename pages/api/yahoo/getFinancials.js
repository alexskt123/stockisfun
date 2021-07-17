//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { roundTo, calPcnt } from '@/lib/commonFunction'
import { getStockEarningCapacity } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getFinancialData } from '@/lib/yahoo/getFinancialData'
import { getIncomeStatement } from '@/lib/yahoo/getIncomeStatement'
import { getQuote } from '@/lib/yahoo/getQuote'

const getData = async args => {
  const { ticker } = args

  const income = await getIncomeStatement(ticker)
  const financialData = await getFinancialData(ticker)
  const quoteArr = await getQuote(ticker)
  const quote = quoteArr.find(x => x) || {}
  const assetProfile = await getAssetProfile(ticker)

  const earningCapacity = await getStockEarningCapacity(ticker)

  const grossMargin = calPcnt(
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

  return data
}

export default async (req, res) => {
  const response = await getData(req.query)

  res.statusCode = 200
  res.json(response)
}

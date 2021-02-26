//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooEarnings } from '../../lib/yahoo/getYahooEarnings'
import { getYahooIncomeStatement } from '../../lib/yahoo/getYahooIncomeStatement'
import { getYahooFinancialData } from '../../lib/yahoo/getYahooFinancialData'
import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import percent from 'percent'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getYahooEarnings(ticker)
  const income = await getYahooIncomeStatement(ticker)
  const financialData = await getYahooFinancialData(ticker)
  const quote = await getYahooQuote(ticker)

  const revenueArr = []
  const netIncomeArr = []

  const earningsExtract = earnings.map(item => {
    return {
      'revenue': item.revenue.raw,
      'netIncome': item.earnings.raw
    }
  })

  earningsExtract.forEach((item,index) => {
    if (index > 0) {
      const revenuePcnt = percent.calc((item.revenue - earningsExtract[index - 1].revenue), earningsExtract[index - 1].revenue, 2, true)
      const netIncomePcnt = percent.calc((item.netIncome - earningsExtract[index - 1].netIncome), earningsExtract[index - 1].netIncome, 2, true)
      revenueArr.push(revenuePcnt)
      netIncomeArr.push(netIncomePcnt)
    }
  })

  const latestIncome = income.find(x => x)

  let grossMargin = 'N/A'
  let returnOnEquity = 'N/A'
  let returnOnAssets = 'N/A'
  let trailingPE = 'N/A'

  if (latestIncome)
    grossMargin = percent.calc(latestIncome.grossProfit.raw, latestIncome.totalRevenue.raw, 2, true)


  if (financialData.returnOnEquity)
    returnOnEquity = financialData.returnOnEquity.fmt
  
  if (financialData.returnOnAssets)
    returnOnAssets = financialData.returnOnAssets.fmt

  if (quote.trailingPE)
    trailingPE = quote.trailingPE.toFixed(2)

  const data = [
    ...revenueArr.reverse(),
    ...netIncomeArr.reverse(),
    trailingPE,
    returnOnEquity,
    grossMargin,
    returnOnAssets
  ]

  res.statusCode = 200
  res.json(data)
}

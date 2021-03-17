//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooEarnings } from '../../../lib/yahoo/getYahooEarnings'
import { getYahooIncomeStatement } from '../../../lib/yahoo/getYahooIncomeStatement'
import { getYahooFinancialData } from '../../../lib/yahoo/getYahooFinancialData'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'
import percent from 'percent'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getYahooEarnings(ticker)
  const income = await getYahooIncomeStatement(ticker)
  const financialData = await getYahooFinancialData(ticker)
  const quote = await getYahooQuote(ticker)

  const earningsExtract = earnings.map(item => {
    return {
      'revenue': item.revenue.raw,
      'netIncome': item.earnings.raw
    }
  })

  const incomeStmtDefault = {
    revenueArr: [],
    netIncomeArr: []
  }

  const incomeStmt = earningsExtract.reduce((acc, cur, index, org) => {
    if (index > 0) {

      const revenuePcnt = percent.calc((cur.revenue - org[index - 1].revenue), org[index - 1].revenue, 2, true)
      const netIncomePcnt = percent.calc((cur.netIncome - org[index - 1].netIncome), org[index - 1].netIncome, 2, true)

      acc = {
        revenueArr: [...acc.revenueArr, revenuePcnt],
        netIncomeArr: [...acc.netIncomeArr, netIncomePcnt]
      }
    }

    return acc
  }, { ...incomeStmtDefault })

  const grossMargin = percent.calc(income.find(x => x)?.grossProfit?.raw, income.find(x => x)?.totalRevenue?.raw, 2, true)
  const returnOnEquity = financialData?.returnOnEquity?.fmt
  const returnOnAssets = financialData?.returnOnAssets?.fmt
  const trailingPE = quote?.trailingPE?.toFixed(2)

  const data = [
    ...incomeStmt.revenueArr.reverse(),
    ...incomeStmt.netIncomeArr.reverse(),
    trailingPE,
    returnOnEquity,
    grossMargin,
    returnOnAssets
  ]

  res.statusCode = 200
  res.json(data)
}

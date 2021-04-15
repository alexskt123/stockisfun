//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooEarnings } from '../../../lib/yahoo/getYahooEarnings'
import { getYahooIncomeStatement } from '../../../lib/yahoo/getYahooIncomeStatement'
import { getYahooCashflowStatement } from '../../../lib/yahoo/getYahooCashflowStatement'
import { getYahooBalanceSheet } from '../../../lib/yahoo/getYahooBalanceSheet'
import { getYahooFinancialData } from '../../../lib/yahoo/getYahooFinancialData'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'
import percent from 'percent'
import { roundTo, getAnnualizedPcnt, getRevenueIndicator } from '../../../lib/commonFunction'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getYahooEarnings(ticker)
  const income = await getYahooIncomeStatement(ticker)
  const cashflow = await getYahooCashflowStatement(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)
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

      const revenuePcnt = percent.calc((cur.revenue - org[index - 1].revenue), Math.abs(org[index - 1].revenue), 2)
      const netIncomePcnt = percent.calc((cur.netIncome - org[index - 1].netIncome), Math.abs(org[index - 1].netIncome), 2)

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
  const trailingPE = quote?.trailingPE ? roundTo(quote?.trailingPE) : 'N/A'


  const { totalCashFromOperatingActivities } = cashflow.find(x => x) || {}
  const { totalLiab } = balanceSheet.find(x => x) || {}

  const debtClearance = totalCashFromOperatingActivities?.raw && totalLiab?.raw ? roundTo(totalCashFromOperatingActivities?.raw / totalLiab?.raw) : 'N/A'

  incomeStmt.revenueArr.reverse()
  incomeStmt.netIncomeArr.reverse()

  const revenueArr = [...Array(3)].map((_item, idx) => {
    const revenueItem = incomeStmt.revenueArr[idx]
    return revenueItem ? revenueItem : 'N/A'
  })

  const revenueAnnualized = getAnnualizedPcnt(revenueArr)
  const revenueIndicator = getRevenueIndicator(revenueAnnualized.raw)

  const netIncomeArr = [...Array(3)].map((_item, idx) => {
    const netIncomeItem = incomeStmt.netIncomeArr[idx]
    return netIncomeItem ? netIncomeItem : 'N/A'
  })

  const incomeAnnualized = getAnnualizedPcnt(netIncomeArr)
  const incomeIndicator = getRevenueIndicator(incomeAnnualized.raw)

  const data = Object.assign({
    symbol: ticker,
    revenueAnnualized: revenueAnnualized.raw * 100,
    revenueIndicator,
    incomeAnnualized: incomeAnnualized.raw * 100,
    incomeIndicator,
    debtClearance,
    trailingPE,
    returnOnEquity: returnOnEquity ? returnOnEquity : 'N/A',
    grossMargin: grossMargin ? grossMargin : 'N/A',
    returnOnAssets: returnOnAssets ? returnOnAssets : 'N/A'    
  }, ...revenueArr.map((item, idx) => {
    return ({
      [`revenue-${idx + 1}`]: item
    })
  }), ...netIncomeArr.map((item, idx) => {
    return ({
      [`netIncome-${idx + 1}`]: item
    })
  })
  )

  res.statusCode = 200
  res.json(data)
}

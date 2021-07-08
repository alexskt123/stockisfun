//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getIncomeStatement } from '@/lib/yahoo/getIncomeStatement'

export default async (req, res) => {
  const { ticker } = req.query

  const earnings = await getIncomeStatement(ticker)
  const earningsExtract = earnings.map(item => {
    return {
      date: item.endDate.fmt,
      Revenue: item.totalRevenue.raw,
      'Cost Of Revenue': item.costOfRevenue.raw,
      'Gross Profit': item.grossProfit.raw,
      'Net Income': item.netIncome.raw
    }
  })

  res.statusCode = 200
  res.json(earningsExtract)
}

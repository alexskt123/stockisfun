//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAPIResponse } from '@/lib/request'
import { getIncomeStatement } from '@/lib/yahoo/getIncomeStatement'

const getData = async args => {
  const { ticker } = args
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
  return earningsExtract
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}

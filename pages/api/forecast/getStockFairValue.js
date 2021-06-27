//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getFinanchill } from '../../../lib/forecast/getFinanchill'
import { getMoneyCnnCouple } from '../../../lib/forecast/getMoneyCnn'
import { getWalletInvestor } from '../../../lib/forecast/getWalletInvestor'
import { getYahooRecommendTrend } from '../../../lib/yahoo/getYahooRecommendTrend'

export default async (req, res) => {
  const { ticker } = req.query

  const responses = await Promise.all([
    getWalletInvestor(ticker),
    getFinanchill(ticker),
    getMoneyCnnCouple(ticker),
    getYahooRecommendTrend(ticker)
  ])

  res.statusCode = 200
  res.json(
    responses.reduce(
      (acc, item) => {
        return {
          ...acc,
          ...item
        }
      },
      { symbol: ticker }
    )
  )
}

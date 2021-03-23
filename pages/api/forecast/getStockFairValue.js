//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getMoneyCnn } from '../../../lib/forecast/getMoneyCnn'
import { getFinanchill} from '../../../lib/forecast/getFinanchill'
import { getWalletInvestor} from '../../../lib/forecast/getWalletInvestor'
import { getYahooRecommendTrend } from '../../../lib/yahoo/getYahooRecommendTrend'

export default async (req, res) => {
  const { ticker } = req.query

  const responses = await Promise.all([
    getWalletInvestor(ticker),
    getFinanchill(ticker),
    getMoneyCnn(ticker),
    getYahooRecommendTrend(ticker)
  ])

  res.statusCode = 200
  res.json([].concat.apply([], responses))
}

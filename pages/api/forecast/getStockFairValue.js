//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getFinanchill } from '@/lib/forecast/getFinanchill'
import { getMoneyCnnCouple } from '@/lib/forecast/getMoneyCnn'
import { getWalletInvestor } from '@/lib/forecast/getWalletInvestor'
import { getRecommendTrend } from '@/lib/yahoo/getRecommendTrend'

const getData = async args => {
  const { ticker } = args

  const responses = await Promise.all([
    getWalletInvestor(ticker),
    getFinanchill(ticker),
    getMoneyCnnCouple(ticker),
    getRecommendTrend(ticker)
  ])

  return responses.reduce(
    (acc, item) => {
      return {
        ...acc,
        ...item
      }
    },
    { symbol: ticker }
  )
}

export default async (req, res) => {
  const response = await getData(req.query)

  res.statusCode = 200
  res.json(response)
}

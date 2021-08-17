import Quote from '@/lib/class/quote'
import { getFinanchill } from '@/lib/forecast/getFinanchill'
import { getMoneyCnnCouple } from '@/lib/forecast/getMoneyCnn'
import { getWalletInvestor } from '@/lib/forecast/getWalletInvestor'
import { getRecommendTrend } from '@/lib/yahoo/getRecommendTrend'

const getData = async args => {
  const { ticker } = args

  const quote = new Quote(ticker)
  await quote.request()

  const responses = quote.valid
    ? await Promise.all([
        getWalletInvestor(ticker),
        getFinanchill(ticker),
        getMoneyCnnCouple(ticker),
        getRecommendTrend(ticker)
      ])
    : []

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

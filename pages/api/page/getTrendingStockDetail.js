import { getStockEarningCapacity } from '@/lib/stockInfo'
import { getQuote } from '@/lib/yahoo/getQuote'

const getData = async args => {
  const { ticker } = args
  const quote = await getQuote(ticker)
  const earningCapacityData = await getStockEarningCapacity(ticker)
  const quoteData = quote.find(x => x) || { symbol: ticker }
  return {
    ...quoteData,
    ...earningCapacityData
  }
}

export default async (req, res) => {
  const response = await getData(req.query)

  res.statusCode = 200
  res.json(response)
}

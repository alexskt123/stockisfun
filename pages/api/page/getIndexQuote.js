import { getAPIResponse } from '@/lib/request'
import { getStockEarningCapacity } from '@/lib/stockInfo'

const getData = async args => {
  const { ticker, quoteData } = args

  const earningCapacity = await getStockEarningCapacity(ticker)

  return {
    ...quoteData,
    ...earningCapacity
  }
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}

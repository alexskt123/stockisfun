//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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

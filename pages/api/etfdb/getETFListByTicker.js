//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { etfListByTickerCount } from '@/config/etf'
import { getETFListByTicker } from '@/lib/etfdb/getETFListByTicker'
import { getAPIResponse } from '@/lib/request'

const getData = async args => {
  const { ticker } = args
  const etfInfo = await getETFListByTicker(ticker)
  const data = {
    ...etfInfo,
    etfList: [
      ...etfInfo.etfList.filter((_x, idx) => idx < etfListByTickerCount)
    ]
  }

  return data
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}

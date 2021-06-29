//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { etfListByTickerCount } from '@/config/etf'
import { getETFListByTicker } from '@/lib/etfdb/getETFListByTicker'

export default async (req, res) => {
  const { ticker } = req.query

  const etfInfo = await getETFListByTicker(ticker)
  const data = {
    ...etfInfo,
    etfList: [
      ...etfInfo.etfList.filter((_x, idx) => idx < etfListByTickerCount)
    ]
  }

  res.statusCode = 200
  res.json(data)
}

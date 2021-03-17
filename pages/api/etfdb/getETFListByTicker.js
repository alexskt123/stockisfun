//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../../lib/etfdb/getETFAUMSum'
import { etfListByTickerCount } from '../../../config/etf'

export default async (req, res) => {
  const { ticker } = req.query

  const etfList = await getETFAUMSum(ticker)
  const data = etfList.filter((_x, idx) => idx < etfListByTickerCount)

  res.statusCode = 200
  res.json(data)
}

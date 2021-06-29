//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { aumTableHeader } from '@/config/etf'
import { getAUM } from '@/lib/compare/aum'
import { getMoneyCnnCouple } from '@/lib/forecast/getMoneyCnn'

export default async (req, res) => {
  const { ticker } = req.query

  const aumData = await getAUM(ticker)
  const moneyCnnData = await getMoneyCnnCouple(ticker)

  res.statusCode = 200
  res.json({
    ...[ticker, ...aumData].reduce(
      (acc, item, idx) => ({ ...acc, [aumTableHeader[idx].item]: item }),
      {}
    ),
    ...moneyCnnData
  })
}

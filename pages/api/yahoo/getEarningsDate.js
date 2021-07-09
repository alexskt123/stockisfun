//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getEarningsDate } from '@/lib/yahoo/getEarningsDate'

export default async (req, res) => {
  const { ticker } = req.query

  const earningsDate = await getEarningsDate(ticker)

  res.statusCode = 200
  res.json(earningsDate)
}

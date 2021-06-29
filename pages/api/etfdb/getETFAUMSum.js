//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAUM } from '@/lib/compare/aum'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getAUM(ticker)

  res.statusCode = 200
  res.json(data)
}

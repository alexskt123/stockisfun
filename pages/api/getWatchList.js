//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getQuote(ticker)

  res.statusCode = 200
  res.json(data.find(x => x))
}

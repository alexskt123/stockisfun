//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Quote from '../../lib/quote'

export default async (req, res) => {
  const { ticker } = req.query

  const quote = new Quote(ticker)
  await quote.request()
  
  res.statusCode = 200
  res.json({valid: quote.valid, type: quote.type})
}

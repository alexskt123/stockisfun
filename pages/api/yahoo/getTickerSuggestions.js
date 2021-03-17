//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getTickerSuggestions } from '../../../lib/yahoo/getTickerSuggestions'

export default async (req, res) => {
  const { query } = req.query

  const data = await getTickerSuggestions(query)
  
  res.statusCode = 200
  res.json(data)
}

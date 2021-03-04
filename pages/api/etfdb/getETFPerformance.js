//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFPerformance } from '../../../lib/etfdb/getETFPerformance'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getETFPerformance(ticker)
  
  res.statusCode = 200
  res.json(data)
}

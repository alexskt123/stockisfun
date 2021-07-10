//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooBasicsData } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getAssetProfile(ticker)
  const quoteArr = await getQuote(ticker)
  const quote = quoteArr.find(x => x) || {}

  const newData = getYahooBasicsData(data, quote)

  res.statusCode = 200
  res.json({
    ...newData
  })
}

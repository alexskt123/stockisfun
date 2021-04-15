//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooAssetProfile } from '../../../lib/yahoo/getYahooAssetProfile'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'
import { getYahooBasicsData } from '../../../lib/stockDetailsFunction'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooAssetProfile(ticker)
  const quote = await getYahooQuote(ticker)

  const newData = getYahooBasicsData(data, quote)

  res.statusCode = 200
  res.json({
    ...newData
  })
}

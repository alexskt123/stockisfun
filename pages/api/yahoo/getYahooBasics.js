//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Quote from '@/lib/quote'
import { getYahooBasicsData } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'

const getData = async (ticker, quoteData) => {
  const assetProfileData = await getAssetProfile(ticker)
  const newData = getYahooBasicsData(assetProfileData, quoteData)

  return {
    ...newData
  }
}

export default async (req, res) => {
  const { ticker } = req.query

  const quote = new Quote(ticker)
  await quote.request()

  const result = quote.valid ? await getData(ticker, quote.quoteData) : null

  res.statusCode = 200
  res.json(result)
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { calPcnt } from '@/lib/commonFunction'
import Quote from '@/lib/quote'
import { getYahooBasicsData } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'

const getData = async (ticker, quoteData) => {
  const keyStat = await getYahooStatistics(ticker)
  const data = await getAssetProfile(ticker)
  const basics = getYahooBasicsData(data, quoteData || {})

  const floatingShareRatio = keyStat?.floatShares
    ? calPcnt(keyStat.floatShares.raw, keyStat.sharesOutstanding.raw, 2, true)
    : 'N/A'

  return {
    ...basics.basics,
    'Floating Shares': floatingShareRatio
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

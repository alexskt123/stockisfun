//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { calPcnt } from '@/lib/commonFunction'
import { getAPIResponse } from '@/lib/request'
import { getYahooBasicsData } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'

const getData = async args => {
  const { ticker, quoteData } = args
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
  const response = await getAPIResponse(req, getData)
  res.statusCode = 200
  res.json(response)
}

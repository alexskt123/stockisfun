//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { calPcnt } from '@/lib/commonFunction'
import { getYahooBasicsData } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'
import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'
import { getQuote } from '@/lib/yahoo/getQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const keyStat = await getYahooStatistics(ticker)

  const data = await getAssetProfile(ticker)
  const quote = await getQuote(ticker)

  const basics = getYahooBasicsData(data, quote)

  const floatingShareRatio =
    keyStat && keyStat.floatShares
      ? calPcnt(keyStat.floatShares.raw, keyStat.sharesOutstanding.raw, 2, true)
      : 'N/A'

  res.statusCode = 200
  res.json({
    basics,
    floatingShareRatio
  })
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { calPcnt } from '@/lib/commonFunction'
import { getYahooBasicsData } from '@/lib/stockDetailsFunction'
import { getYahooAssetProfile } from '@/lib/yahoo/getYahooAssetProfile'
import { getYahooKeyStatistics } from '@/lib/yahoo/getYahooKeyStatistics'
import { getYahooQuote } from '@/lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { ticker } = req.query

  const keyStat = await getYahooKeyStatistics(ticker)

  const data = await getYahooAssetProfile(ticker)
  const quote = await getYahooQuote(ticker)

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

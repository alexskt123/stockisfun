//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'

export default async (req, res) => {
  const { ticker } = req.query

  const tickers = [].concat(ticker)

  const assetProfiles = await Promise.all(
    tickers.map(async item => {
      const assetProfile = await getAssetProfile(item)
      return assetProfile
    })
  ).catch(error => console.error(error))

  res.statusCode = 200
  res.json(assetProfiles)
}

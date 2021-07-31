import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'

export default async (req, res) => {
  const { ticker } = req.query

  const tickers = [].concat(ticker)

  const assetProfiles = await Promise.all(
    tickers.map(item => getAssetProfile(item))
  ).catch(error => console.error(error))

  res.statusCode = 200
  res.json(assetProfiles)
}

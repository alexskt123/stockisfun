import { getAPIResponse } from '@/lib/request'
import { getYahooBasicsData } from '@/lib/stockInfo'
import { getAssetProfile } from '@/lib/yahoo/getAssetProfile'

const getData = async args => {
  const { ticker, quoteData } = args
  const assetProfileData = await getAssetProfile(ticker)
  const newData = getYahooBasicsData(assetProfileData, quoteData)

  return {
    ...newData
  }
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)

  res.statusCode = 200
  res.json(response)
}

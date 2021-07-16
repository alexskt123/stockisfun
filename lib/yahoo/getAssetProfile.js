import { assetProfileResponse } from '@/config/yahooChart'
import Quote from '@/lib/class/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('assetProfile')
  const resData = quote.moduleData

  return {
    ...assetProfileResponse,
    ...(resData || {})
  }
}

export const getAssetProfile = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).assetProfile
}

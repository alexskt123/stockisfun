import { assetProfileResponse } from '@/config/yahooChart'
import { ModuleQuote } from '@/lib/quote'

async function getResponse(ticker) {
  const quote = new ModuleQuote(ticker)
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

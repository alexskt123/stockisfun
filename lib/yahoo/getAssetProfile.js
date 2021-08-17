import { getModuleResponse } from '@/lib/yahoo'

export const getAssetProfile = async ticker => {
  const response = await getModuleResponse(ticker, 'AssetProfile')
  return response
}

import { getModuleResponse } from '@/lib/yahoo'

export const getEarnings = async ticker => {
  const response = await getModuleResponse(ticker, 'Earnings')
  return response
}

import { getModuleResponse } from '@/lib/yahoo'

export const getEarningsDate = async ticker => {
  const response = await getModuleResponse(ticker, 'EarningsData')
  return response
}

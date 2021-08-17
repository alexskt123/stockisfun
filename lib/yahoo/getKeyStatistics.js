import { getModuleResponse } from '@/lib/yahoo'

export const getYahooStatistics = async ticker => {
  const response = await getModuleResponse(ticker, 'KeyStatistics')
  return response
}

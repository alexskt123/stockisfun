import { getModuleResponse } from '@/lib/yahoo'

export const getRecommendTrend = async ticker => {
  const response = await getModuleResponse(ticker, 'RecommendTrend')
  return response
}

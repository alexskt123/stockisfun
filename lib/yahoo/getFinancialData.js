import { getModuleResponse } from '@/lib/yahoo'

export const getFinancialData = async ticker => {
  const response = await getModuleResponse(ticker, 'FinancialData')
  return response
}

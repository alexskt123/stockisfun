import { getModuleResponse } from '@/lib/yahoo'

export const getIncomeStatement = async ticker => {
  const response = await getModuleResponse(ticker, 'IncomeStatement')
  return response
}

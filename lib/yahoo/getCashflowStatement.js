import { getModuleResponse } from '@/lib/yahoo'

export const getCashflowStatement = async ticker => {
  const response = await getModuleResponse(ticker, 'CashflowStatement')
  return response
}

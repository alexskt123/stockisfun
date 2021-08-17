import { getModuleResponse } from '@/lib/yahoo'

export const getBalanceSheet = async ticker => {
  const response = await getModuleResponse(ticker, 'BalanceSheet')
  return response
}

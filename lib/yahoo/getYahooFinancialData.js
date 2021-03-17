import axios from 'axios'
import { financialDataResponse } from '../../config/yahooChart'
import { isValidTicker } from '../../lib/commonFunction'

async function getResponse(ticker) {
  const validTicker = await isValidTicker(ticker)
  const response = validTicker ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=financialData`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...financialDataResponse,
    ...(resData || {})
  }
}

export const getYahooFinancialData = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).financialData
}

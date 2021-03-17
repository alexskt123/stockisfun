import axios from 'axios'
import { incomeResponse } from '../../config/yahooChart'
import { isValidTicker } from '../../lib/commonFunction'

async function getResponse(ticker) {
  const validTicker = await isValidTicker(ticker)
  const response = validTicker ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=incomeStatementHistory`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...incomeResponse,
    ...(resData || {})
  }
}

export const getYahooIncomeStatement = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).incomeStatementHistory.incomeStatementHistory
}

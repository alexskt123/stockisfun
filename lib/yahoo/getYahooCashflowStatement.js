import axios from 'axios'
import { cashflowResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type
  const response = validTicker && tickerType === 'EQUITY' ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=cashflowStatementHistory`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...cashflowResponse,
    ...(resData || {})
  }
}

export const getYahooCashflowStatement = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).cashflowStatementHistory.cashflowStatements
}

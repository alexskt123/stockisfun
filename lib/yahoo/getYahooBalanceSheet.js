import axios from 'axios'
import { balanceSheetRespsone } from '../../config/yahooChart'
import { isValidTicker } from '../../lib/commonFunction'

async function getResponse(ticker) {
  const validTicker = await isValidTicker(ticker)
  const response = validTicker ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=balanceSheetHistory`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...balanceSheetRespsone,
    ...(resData || {})
  }
}

export const getYahooBalanceSheet = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).balanceSheetHistory.balanceSheetStatements
}

import axios from 'axios'
import {balanceSheetRespsone} from '../config/yahooChart'

async function getResponse(ticker) {
    let response = {
        ...balanceSheetRespsone
    }

    try {
        response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=balanceSheetHistory`)
    }
    catch {

    }

    return response.data

}

export const getYahooBalanceSheet = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)


  return responseArr.quoteSummary.result.find(x => x).balanceSheetHistory.balanceSheetStatements
}

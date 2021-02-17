import axios from 'axios'
import {incomeResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
    let response = {
        ...incomeResponse
    }

    try {
        response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=incomeStatementHistory`)
    }
    catch {

    }

    return response.data

}

export const getYahooIncomeStatement = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)


  return responseArr.quoteSummary.result.find(x => x).incomeStatementHistory.incomeStatementHistory
}

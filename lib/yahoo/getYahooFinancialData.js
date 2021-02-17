import axios from 'axios'
import {financialDataResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
    let response = {
        ...financialDataResponse
    }

    try {
        response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=financialData`)
    }
    catch {

    }

    return response.data

}

export const getYahooFinancialData = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)


  return responseArr.quoteSummary.result.find(x => x).financialData
}

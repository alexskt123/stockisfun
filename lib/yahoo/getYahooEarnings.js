import axios from 'axios'
import {earningsResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
  let response = {
    ...earningsResponse
  }

  try {
    response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=earnings`)
  }
  catch {
    console.log('Failed to execute lib/yahoo/getYahooEarnings')
  }

  return response.data

}

export const getYahooEarnings = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)


  return responseArr.quoteSummary.result.find(x => x).earnings.financialsChart.yearly 
}

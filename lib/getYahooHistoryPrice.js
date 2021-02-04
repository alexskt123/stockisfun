import axios from 'axios'
import {chartResponse} from '../config/yahooChart'

async function getResponse(ticker, fromdate, todate) {
    let response = {
        ...chartResponse
    }

    try {
        response = await axios(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${fromdate}&period2=${todate}&interval=1d&events=history&=hP2rOschxO0`)
    }
    catch {

    }

    return response.data

}

export const getYahooHistoryPrice = async (ticker, fromdate, todate) => {

  let responseArr = []

  responseArr = await getResponse(ticker, fromdate, todate)

  return responseArr.chart.result.find(x => x) || []
}

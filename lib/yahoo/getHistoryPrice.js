import { chartResponse } from '@/config/yahooChart'
import { handleAxiosError } from '@/lib/commonFunction'
import Quote from '@/lib/quote'
import to from 'await-to-js'
import axios from 'axios'

async function getResponse(ticker, fromdate, todate) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const [err, response] = validTicker
    ? await to(
        axios(
          `https://query1.finance.yahoo.com/v8/finance/chart/${quote.ticker}?period1=${fromdate}&period2=${todate}&interval=1d&events=history&=hP2rOschxO0`
        )
      )
    : [null, {}]

  handleAxiosError(err)

  const resData = response?.data

  return {
    ...chartResponse,
    ...(resData || {})
  }
}

export const getHistoryPrice = async (ticker, fromdate, todate) => {
  const response = await getResponse(ticker, fromdate, todate)
  return response.chart.result.find(x => x) || []
}

import axios from 'axios'
import { keyStatResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'
import { handleAxiosError } from '../../lib/commonFunction'
import to from 'await-to-js'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type

  const [err, response] =
    validTicker && (tickerType === 'EQUITY' || tickerType === 'ETF')
      ? await to(
          axios(
            `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${quote.ticker}?modules=defaultKeyStatistics`
          )
        )
      : [null, {}]

  handleAxiosError(err)

  const resData = response?.data

  return {
    ...keyStatResponse,
    ...(resData || {})
  }
}

export const getYahooKeyStatistics = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).defaultKeyStatistics
}

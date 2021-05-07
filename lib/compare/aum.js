
import { aumSumCount } from '../../config/etf'
import { millify } from '../../lib/commonFunction'
import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import { getYahooKeyStatistics } from '../../lib/yahoo/getYahooKeyStatistics'
import { getETFListByTicker } from '../../lib/etfdb/getETFListByTicker'
import Quote from '../../lib/quote'

import percent from 'percent'

const getAUMSum = async (ticker) => {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid

  const etfInfo = !validTicker ? null : await getETFListByTicker(ticker)
  const data = etfInfo ? etfInfo : { etfList: [], etfCount: 'N/A' }

  const { etfList, etfCount } = data

  const etf = {
    etfList: [],
    aumSum: 0
  }

  const responses = await Promise.all(etfList.map(async etf => {
    return await await getYahooKeyStatistics(etf.ticker)
  }))

  const newETF = responses.reduce((acc, item, index) => {
    if (item && item?.totalAssets?.raw && acc.etfList.length < aumSumCount) {
      const aumInfo = item
      const etfWeight = (etfList[index].weight || '').replace('%', '')
      const etfSummary = `${etfList[index].ticker}: ${etfWeight}% AUM: ${aumInfo?.totalAssets?.fmt}`
      const aum = parseFloat((aumInfo?.totalAssets?.raw || '')) * parseFloat(etfWeight) / 100
      acc.etfList.push(etfSummary)
      acc.aumSum += aum
    }
    return acc
  }, { ...etf })


  newETF.etfList = newETF.etfList.length < aumSumCount
    ? [...newETF.etfList, ...Array.from({ length: aumSumCount - newETF.etfList.length }, (_) => 'N/A')]
    : newETF.etfList

  newETF.etfList.push(millify(newETF.aumSum))

  return { etfList: newETF.etfList, etfCount }
}

export const getAUM = async (ticker) => {

  const etfData = await getAUMSum(ticker)

  const responses = await Promise.all([
    await getYahooQuote(ticker),
    await getYahooKeyStatistics(ticker)
  ])

  const resDataSet = responses.map(item => item)
  const quote = resDataSet[0]
  const keyRatio = resDataSet[1]

  const marketCap = quote.marketCap ? millify(quote.marketCap) : 'N/A'
  const regularMarketPrice = quote.regularMarketPrice ? quote.regularMarketPrice : 'N/A'
  const floatingShareRatio = keyRatio && keyRatio.floatShares ? percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true) : 'N/A'

  const data = [...etfData.etfList, regularMarketPrice, marketCap, floatingShareRatio, etfData.etfCount]
  return data
}
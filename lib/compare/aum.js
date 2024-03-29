import { aumSumCount } from '@/config/etf'
import Quote from '@/lib/class/quote'
import {
  millify,
  convertToPercentage,
  calPcnt,
  arrFindByIdx
} from '@/lib/commonFunction'
import { getETFListByTicker } from '@/lib/etfdb/getETFListByTicker'
import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'
import { getQuote } from '@/lib/yahoo/getQuote'

const getAUMSum = async ticker => {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid

  const etfInfo = validTicker && (await getETFListByTicker(ticker))
  const data = etfInfo || { etfList: [], etfCount: 'N/A' }

  const { etfList, etfCount } = data

  const etf = {
    etfList: [],
    aumSum: 0
  }

  const responses = await Promise.all(
    etfList.map(etf => getYahooStatistics(etf.ticker))
  )

  const newETF = responses.reduce(
    (acc, item, index) => {
      if (item?.totalAssets?.raw && acc.etfList.length < aumSumCount) {
        const etfWeight = convertToPercentage(etfList[index].weight, true)
        const etfSummary = `${etfList[index].ticker}: ${etfWeight} AUM: ${item?.totalAssets?.fmt}`
        const aum =
          (parseFloat(item?.totalAssets?.raw || '') * parseFloat(etfWeight)) /
          100
        acc.etfList.push(etfSummary)
        acc.aumSum += aum
      }
      return acc
    },
    { ...etf }
  )

  newETF.etfList =
    newETF.etfList.length < aumSumCount
      ? [
          ...newETF.etfList,
          ...Array.from(
            { length: aumSumCount - newETF.etfList.length },
            _ => 'N/A'
          )
        ]
      : newETF.etfList

  newETF.etfList.push(millify(newETF.aumSum))

  return { etfList: newETF.etfList, etfCount }
}

export const getAUM = async ticker => {
  const etfData = await getAUMSum(ticker)

  const responses = await Promise.all([
    getQuote(ticker),
    getYahooStatistics(ticker)
  ])

  const resDataSet = responses.map(r => r)
  const quote = resDataSet?.find(x => x)?.find(x => x) || {}
  const keyRatio = arrFindByIdx(resDataSet, 1)

  const marketCap = (quote.marketCap && millify(quote.marketCap)) || 'N/A'
  const regularMarketPrice = quote.regularMarketPrice || 'N/A'
  const floatingShareRatio =
    (keyRatio?.floatShares &&
      calPcnt(
        keyRatio.floatShares.raw,
        keyRatio.sharesOutstanding.raw,
        2,
        true
      )) ||
    'N/A'

  const data = [
    ...etfData.etfList,
    regularMarketPrice,
    marketCap,
    floatingShareRatio,
    etfData.etfCount
  ]
  return data
}

import { aumSumCount } from '@/config/etf'
import { millify, convertToPercentage, calPcnt } from '@/lib/commonFunction'
import { getETFListByTicker } from '@/lib/etfdb/getETFListByTicker'
import { Quote } from '@/lib/quote'
import { getYahooStatistics } from '@/lib/yahoo/getKeyStatistics'
import { getQuote } from '@/lib/yahoo/getQuote'

const getAUMSum = async ticker => {
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

  const responses = await Promise.all(
    etfList.map(async etf => {
      return await getYahooStatistics(etf.ticker)
    })
  )

  const newETF = responses.reduce(
    (acc, item, index) => {
      if (item && item?.totalAssets?.raw && acc.etfList.length < aumSumCount) {
        const aumInfo = item
        const etfWeight = convertToPercentage(etfList[index].weight, true)
        const etfSummary = `${etfList[index].ticker}: ${etfWeight} AUM: ${aumInfo?.totalAssets?.fmt}`
        const aum =
          (parseFloat(aumInfo?.totalAssets?.raw || '') *
            parseFloat(etfWeight)) /
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
    await getQuote(ticker),
    await getYahooStatistics(ticker)
  ])

  const resDataSet = responses.map(item => item)
  const quote = resDataSet[0].find(x => x) || {}
  const keyRatio = resDataSet[1]

  const marketCap = quote.marketCap ? millify(quote.marketCap) : 'N/A'
  const regularMarketPrice = quote.regularMarketPrice
    ? quote.regularMarketPrice
    : 'N/A'
  const floatingShareRatio = keyRatio?.floatShares
    ? calPcnt(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true)
    : 'N/A'

  const data = [
    ...etfData.etfList,
    regularMarketPrice,
    marketCap,
    floatingShareRatio,
    etfData.etfCount
  ]
  return data
}

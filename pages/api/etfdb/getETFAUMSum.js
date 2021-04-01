//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { aumSumCount } from '../../../config/etf'
import { getHost, getHostForETFDb, millify } from '../../../lib/commonFunction'
import Quote from '../../../lib/quote'

import percent from 'percent'
import axiosRetry from 'axios-retry'

const axios = require('axios').default

axiosRetry(axios, { retries: 3 })

const getAUMSum = async (ticker) => {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid

  const etfInfo = !validTicker ? null : await axios.get(`${getHostForETFDb()}/api/etfdb/getETFListByTicker?ticker=${ticker}`)
  const data = etfInfo && etfInfo.data ? etfInfo.data : { etfList: [], etfCount: 'N/A' }

  const { etfList, etfCount } = data

  const etf = {
    etfList: [],
    aumSum: 0
  }

  const responses = await Promise.all(etfList.map(async etf => {
    return await axios.get(`${getHost()}/api/yahoo/getYahooKeyStatistics?ticker=${etf.ticker}`).catch(err => console.log(err))
  }))

  const newETF = responses.reduce((acc, item, index) => {
    if (item && item?.data?.totalAssets?.raw && acc.etfList.length < aumSumCount) {
      const aumInfo = item.data
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

export default async (req, res) => {
  const { ticker } = req.query

  const etfData = await getAUMSum(ticker)

  const responses = await Promise.all([
    axios.get(`${getHost()}/api/yahoo/getYahooQuote?ticker=${ticker}`),
    axios.get(`${getHost()}/api/yahoo/getYahooKeyStatistics?ticker=${ticker}`)
  ])

  const resDataSet = responses.map(item => item.data)
  const quote = resDataSet[0]
  const keyRatio = resDataSet[1]

  const marketCap = quote.marketCap ? millify(quote.marketCap) : 'N/A'
  const regularMarketPrice = quote.regularMarketPrice ? quote.regularMarketPrice : 'N/A'
  const floatingShareRatio = keyRatio && keyRatio.floatShares ? percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true) : 'N/A'

  const data = [...etfData.etfList, regularMarketPrice, marketCap, floatingShareRatio, etfData.etfCount]

  res.statusCode = 200
  res.json(data)
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../../lib/etfdb/getETFAUMSum'
import { aumSumCount } from '../../../config/etf'
import { getHost, getHostForETFDb, millify } from '../../../lib/commonFunction'

import percent from 'percent'
const axios = require('axios').default

const getAUMSum = async (ticker) => {
  const etfList = await getETFAUMSum(ticker)

  const etf = {
    etfList: [],
    aumSum: 0
  }

  etfList.splice(aumSumCount)

  const responses = await axios.all(etfList.map((etf) => {
    return axios.get(`${getHostForETFDb()}/api/etfdb/getETFDB?ticker=${etf.ticker}`).catch(err => console.log(err))
  }))
    .catch(error => console.log(error))

  const newETF = responses.reduce((acc, item, index) => {
    if (item) {
      const etfInfo = item.data
      const etfWeight = (etfList[index].weight || '').replace('%', '')
      const etfSummary = `${etfList[index].ticker}: ${etfWeight}% AUM: ${etfInfo.basicInfo.AUM}`
      const aum = (parseFloat((etfInfo.basicInfo.AUM || '').replace(/\$|M|,| /gi, '')) * parseFloat(etfWeight) / 100)
      acc.etfList.push(etfSummary)
      acc.aumSum += aum
    }
    return acc
  }, {...etf})


  newETF.aumSum.toFixed(2)

  if (etfList.length < aumSumCount) {
    newETF.etfList = [...newETF.etfList, ...Array.from({ length: aumSumCount - etfList.length }, (_) => 'N/A')]
  }

  newETF.etfList.push(`$${newETF.aumSum.toFixed(2)} M`)

  return newETF.etfList
}

export default async (req, res) => {
  const { ticker } = req.query

  const etfData = await getAUMSum(ticker)

  const responses = await axios.all([
    axios.get(`${getHost()}/api/yahoo/getYahooQuote?ticker=${ticker}`),
    axios.get(`${getHost()}/api/yahoo/getYahooKeyStatistics?ticker=${ticker}`),
    axios.get(`${getHostForETFDb()}/api/etfdb/getStockETFCount?ticker=${ticker}`)
  ])

  const resDataSet = responses.map(item => item.data)
  const quote = resDataSet[0]
  const keyRatio = resDataSet[1]
  const etfCountData = resDataSet[2]

  const marketCap = quote.marketCap ? millify(quote.marketCap) : 'N/A'
  const regularMarketPrice = quote.regularMarketPrice ? quote.regularMarketPrice : 'N/A'
  const floatingShareRatio = keyRatio && keyRatio.floatShares ? percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true) : 'N/A'
  const etfCount = etfCountData ? etfCountData : 'N/A'

  const data = [...etfData, regularMarketPrice, marketCap, floatingShareRatio, etfCount]

  res.statusCode = 200
  res.json(data)
}

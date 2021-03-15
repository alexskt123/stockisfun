//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../../lib/etfdb/getETFAUMSum'
import { aumSumCount } from '../../../config/etf'
import { getHost, getHostForETFDb } from '../../../lib/commonFunction'

import percent from 'percent'
const axios = require('axios').default

const getAUMSum = async (ticker) => {
  const etfList = await getETFAUMSum(ticker)
  let etfData = []
  let aumSum = 0

  etfList.splice(aumSumCount)

  await axios.all(etfList.map((etf) => {
    return axios.get(`${getHostForETFDb()}/api/etfdb/getETFDB?ticker=${etf.ticker}`).catch(err => console.log(err))
  }))
    .catch(error => console.log(error))
    .then((responses) => {
      responses.forEach((item, index) => {
        if (item) {
          const etfInfo = item.data
          const etfWeight = (etfList[index].weight || '').replace('%', '')
          const etfSummary = `${etfList[index].ticker}: ${etfWeight}% AUM: ${etfInfo.basicInfo.AUM}`
          aumSum += (parseFloat((etfInfo.basicInfo.AUM || '').replace(/\$|M|,| /gi, '')) * parseFloat(etfWeight) / 100)
          etfData.push(etfSummary)
        }
      })
    })

  aumSum.toFixed(2)

  if (etfList.length < aumSumCount) {
    etfData = [...etfData, ...Array.from({ length: aumSumCount - etfList.length }, (_) => 'N/A')]
  }

  etfData.push(`$${aumSum.toFixed(2)} M`)

  return etfData
}

export default async (req, res) => {
  const { ticker } = req.query

  let floatingShareRatio = 'N/A'
  let marketCap = 'N/A'
  let regularMarketPrice = 'N/A'
  let etfCount = 'N/A'
  let data = []

  const etfData = await getAUMSum(ticker)

  await axios.all([
    axios.get(`${getHost()}/api/yahoo/getYahooQuote?ticker=${ticker}`),
    axios.get(`${getHost()}/api/yahoo/getYahooKeyStatistics?ticker=${ticker}`),
    axios.get(`${getHostForETFDb()}/api/etfdb/getStockETFCount?ticker=${ticker}`)
  ])
    .then((responses) => {
      const resDataSet = responses.map(item => item.data)
      const quote = resDataSet[0]
      const keyRatio = resDataSet[1]
      const etfCountData = resDataSet[2]

      if (keyRatio && keyRatio.floatShares) {
        floatingShareRatio = percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true)
      }

      if (quote && quote.marketCap) {
        marketCap = `${(quote.marketCap / 1000000000).toFixed(2)}B`
        regularMarketPrice = quote.regularMarketPrice
      }

      etfCount = etfCountData

    })

  data = [...etfData, regularMarketPrice, marketCap, floatingShareRatio, etfCount]

  res.statusCode = 200
  res.json(data)
}

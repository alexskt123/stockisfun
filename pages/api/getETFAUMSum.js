//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../lib/etfdb/getETFAUMSum'
import { getETFDB } from '../../lib/etfdb/getETFDB'

import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import { getYahooKeyStatistics } from '../../lib/yahoo/getYahooKeyStatistics'
import { aumSumCount } from '../../config/etf'

import percent from 'percent'
const axios = require('axios').default

const getAUMSum = async (ticker) => {
  const etfList = await getETFAUMSum(ticker)
  let etfData = []
  let aumSum = 0

  etfList.splice(aumSumCount)

  await axios.all(etfList.map((etf) => {
    return axios.get(`https://stockisfun.vercel.app/api/getETFDB?ticker=${etf.ticker}`).catch(err => console.log(err))
  }))
    .catch(error => console.log(error))
    .then((responses) => {
      if (responses)
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

  let quote
  let keyRatio
  let floatingShareRatio = 'N/A'
  let marketCap = 'N/A'
  let data = []

  const etfData = await getAUMSum(ticker)
  quote = await getYahooQuote(ticker)
  keyRatio = await getYahooKeyStatistics(ticker)

  if (keyRatio && keyRatio.floatShares) {
    floatingShareRatio = percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true)
  }

  if (quote && quote.marketCap) {
    marketCap = `${(quote.marketCap / 1000000000).toFixed(2)}B`
  }

  data = [...etfData, quote.regularMarketPrice, marketCap, floatingShareRatio]

  res.statusCode = 200
  res.json(data)
}

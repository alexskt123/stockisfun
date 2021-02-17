//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../lib/etfdb/getETFAUMSum'
import { getETFDB } from '../../lib/etfdb/getETFDB'

import { getStockETFCount } from '../../lib/etfdb/getStockETFCount'
import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import { getYahooKeyStatistics } from '../../lib/yahoo/getYahooKeyStatistics'
import { getMoneyCnn } from '../../lib/forecast/getMoneyCnn'

import percent from 'percent'

const getAUMSum = async (ticker) => {
  const etfList = await getETFAUMSum(ticker)
  let etfData = []
  let aumSum = 0
  let i = 0

  for (const etf of etfList) {
    if (i > 9) break

    const etfInfo = await getETFDB(etf.ticker)
    const etfSummary = `${etf.ticker}: ${etf.weight.replace('%', '')}% AUM: ${etfInfo.basicInfo.AUM}`
    aumSum += parseFloat(etfInfo.basicInfo.AUM.replace(/\$|M|,| /gi, ''))
    etfData.push(etfSummary)

    i += 1
  }

  if (i < 10) {
    etfData = [...etfData, ...Array.from({length: 10 - etfList.length}, (_, i)=> 'N/A')]
  }

  etfData.push(`$${aumSum.toFixed(2)} M`)

  return etfData
}

export default async (req, res) => {
  const { ticker } = req.query

  let etfCount
  let quote
  let keyRatio
  let floatingShareRatio = 'N/A'
  let marketCap = 'N/A'
  let moneyCnn
  let data = []

  const etfData = await getAUMSum(ticker)
  etfCount = await getStockETFCount(ticker)
  quote = await getYahooQuote(ticker)
  keyRatio = await getYahooKeyStatistics(ticker)
  moneyCnn = await getMoneyCnn(ticker)

  if (keyRatio && keyRatio.floatShares) {
    floatingShareRatio = percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true)
  }
  
  if (quote && quote.marketCap) {
    marketCap = `${(quote.marketCap / 1000000000).toFixed(2)}B`
  }

  data = [...etfData, quote.regularMarketPrice, marketCap, etfCount, floatingShareRatio, ...moneyCnn]
  
  res.statusCode = 200
  res.json(data)
}

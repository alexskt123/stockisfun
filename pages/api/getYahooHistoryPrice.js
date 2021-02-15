//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooHistoryPrice } from '../../lib/getYahooHistoryPrice'
import { getYahooQuote } from '../../lib/getYahooQuote'
import { dateRange, dateRangeByNoOfYears , quoteFilterList } from '../../config/price'
import percent from 'percent'

const axios = require('axios').default


export default async (req, res) => {
  const { ticker, year } = req.query

  let inputItems = []

  let newDateRange = dateRange
  if (year) newDateRange = await dateRangeByNoOfYears(year)

  newDateRange.forEach(item => {
    inputItems.push(
      {
        'ticker': ticker.toUpperCase(),
        ...item
      }
    )
  })  

  let temp = {
      'ticker': ticker.toUpperCase(),
      'startPrice': null,
      'endPrice': null,
      'yearCnt': 0,
      'data': [],
      'quote': {}
    }

  for (const item of inputItems) {

    let formattedFromDate = new Date(item.fromDate);
    formattedFromDate = formattedFromDate.getTime() / 1000;
    
    let formattedToDate = new Date(item.toDate);
    formattedToDate = formattedToDate.getTime() / 1000;

    const outputItem = await getYahooHistoryPrice(item.ticker, formattedFromDate, formattedToDate)
    const quote = await getYahooQuote(item.ticker)
    const allData = outputItem.indicators.quote.find(x => x).close

    let newQuote = {}
    newQuote['ticker'] = ticker.toUpperCase()
    quoteFilterList.forEach(item => {
      newQuote[item.label] = quote[item.column]
    })
    temp.quote = newQuote


    if (allData && allData.length > 0) {
      const opening = allData.find(x => x)
      const closing = allData[allData.length - 1]

      temp.data.push(percent.calc((closing - opening), opening, 2, true))

      if (!temp.endPrice) {
        temp.endPrice = closing
      }
      temp.startPrice = opening
      temp.yearCnt += 1
    }
    else temp.data.push("N/A")

  }

  res.statusCode = 200
  res.json(temp)
}

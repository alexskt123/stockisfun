//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooHistoryPrice } from '../../lib/getYahooHistoryPrice'
import { getYahooQuote } from '../../lib/getYahooQuote'
import { dateRange, quoteFilterList } from '../../config/price'


const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  let inputItems = []

  dateRange.forEach(item => {
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
      temp.data.push(((closing - opening) / opening * 100).toFixed(2))

      if (!temp?.endPrice) {
        temp.endPrice = opening
      }
      temp.startPrice = closing
      temp.yearCnt += 1
    }
    else temp.data.push("N/A")
  }

  res.statusCode = 200
  res.json(temp)
}

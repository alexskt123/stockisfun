//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooHistoryPrice } from '../../../lib/yahoo/getYahooHistoryPrice'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'
import { dateRange, dateRangeByNoOfYears, quoteFilterList } from '../../../config/price'
import percent from 'percent'
import { getFormattedFromToDate } from '../../../lib/commonFunction'
import moment from 'moment-business-days'

const handleYearPcnt = async (ticker, year) => {

  const newDateRange = year ? await dateRangeByNoOfYears(year) : dateRange
  const inputItems = newDateRange.map(item => {
    return(
      {
        'ticker': ticker.toUpperCase(),
        ...item
      }
    )
  })

  const temp = {
    'ticker': ticker.toUpperCase(),
    'startPrice': null,
    'endPrice': null,
    'yearCnt': 0,
    'data': [],
    'quote': {}
  }

  for (const item of inputItems) {

    let formattedFromDate = new Date(item.fromDate)
    formattedFromDate = formattedFromDate.getTime() / 1000

    let formattedToDate = new Date(item.toDate)
    formattedToDate = formattedToDate.getTime() / 1000

    const outputItem = await getYahooHistoryPrice(item.ticker, formattedFromDate, formattedToDate)
    const quote = await getYahooQuote(item.ticker)
    const allData = outputItem.indicators.quote.find(x => x).close

    const newQuote = {}
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
    else temp.data.push('N/A')

  }

  return temp
}

const handleDays = async (ticker, days) => {
  const { formattedFromDate, formattedToDate } = await getFormattedFromToDate(days)

  const outputItem = await getYahooHistoryPrice(ticker, formattedFromDate, formattedToDate)
  const allDate = (outputItem.timestamp || []).map(item => moment.unix(item).format('DD MMM YYYY'))
  const allPrice = outputItem.indicators.quote.find(x => x).close  
  const price = parseInt(days) != allPrice?.length ? allPrice?.slice(Math.abs(allPrice?.length - parseInt(days))) : allPrice
  const date = parseInt(days) != allPrice?.length ? allDate?.slice(Math.abs(allPrice?.length - parseInt(days))) : allDate

  return {
    date,
    price
  }
}

export default async (req, res) => {
  const { ticker, year, days } = req.query

  let temp = year ? await handleYearPcnt(ticker, year) : await handleDays(ticker, days)
  
  res.statusCode = 200
  res.json(temp)
}

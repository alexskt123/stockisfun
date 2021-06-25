//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooHistoryPrice } from '../../../lib/yahoo/getYahooHistoryPrice'
import { getYahooQuote } from '../../../lib/yahoo/getYahooQuote'
import {
  dateRange,
  dateRangeByNoOfYears,
  quoteFilterList
} from '../../../config/price'
import percent from 'percent'
import { getFormattedFromToDate } from '../../../lib/commonFunction'
import moment from 'moment-business-days'

const handleYearPcnt = async (ticker, year) => {
  const newDateRange = year ? await dateRangeByNoOfYears(year) : dateRange
  const inputItems = newDateRange.map(item => {
    return {
      ticker: ticker.toUpperCase(),
      ...item
    }
  })

  const quoteRes = await getYahooQuote(ticker.toUpperCase())
  const quote = {
    ticker: ticker.toUpperCase(),
    ...quoteFilterList.reduce((acc, item) => {
      return {
        ...acc,
        [item.label]: quoteRes[item.column]
      }
    }, {})
  }

  const temp = {
    ticker: ticker.toUpperCase(),
    startPrice: null,
    endPrice: null,
    data: [],
    quote: quote
  }

  const historyPriceRes = await Promise.all(
    inputItems.map(async item => {
      const formattedFromDate = new Date(item.fromDate).getTime() / 1000
      const formattedToDate = new Date(item.toDate).getTime() / 1000

      const outputItem = await getYahooHistoryPrice(
        item.ticker,
        formattedFromDate,
        formattedToDate
      )
      return outputItem.indicators.quote.find(x => x).close
    })
  )

  const newTemp = historyPriceRes.reduce(
    (acc, cur, idx) => {
      const opening = cur?.find(x => x)
      const closing = [...(cur || [])].reverse()?.find(x => x)

      const newAcc = {
        ...acc,
        data: [
          ...(acc.data || []),
          opening && closing
            ? percent.calc(closing - opening, opening, 2, true)
            : 'N/A'
        ],
        endPrice: idx === 0 && closing ? closing : acc.endPrice,
        startPrice: opening ? opening : acc.startPrice
      }

      return newAcc
    },
    { ...temp }
  )

  return newTemp
}

const handleDays = async (ticker, days) => {
  const { formattedFromDate, formattedToDate } = await getFormattedFromToDate(
    days
  )

  const outputItem = await getYahooHistoryPrice(
    ticker,
    formattedFromDate,
    formattedToDate
  )
  const closeDate = (outputItem.timestamp || []).map(item =>
    moment.unix(item).format('DD MMM YYYY')
  )
  const closePrice = outputItem.indicators.quote.find(x => x).close
  const allPriceDate = (closePrice || []).reduce(
    (acc, cur, idx) => {
      // price must have value
      const isPush = cur ? true : false
      const date = isPush ? [...acc.date, closeDate[idx]] : [...acc.date]
      const price = isPush ? [...acc.price, cur] : [...acc.price]
      const newAcc = {
        date: [...date],
        price: [...price]
      }
      return newAcc
    },
    { date: [], price: [] }
  )

  const { date: allDate, price: allPrice } = allPriceDate
  const price =
    parseInt(days) !== allPrice?.length
      ? allPrice?.slice(Math.abs(allPrice?.length - parseInt(days)))
      : allPrice
  const date =
    parseInt(days) !== allPrice?.length
      ? allDate?.slice(Math.abs(allPrice?.length - parseInt(days)))
      : allDate
  const quoteRes = await getYahooQuote(ticker.toUpperCase())

  return {
    date,
    price,
    quote: {
      ...quoteRes
    }
  }
}

export default async (req, res) => {
  const { ticker, year, days } = req.query

  const temp = year
    ? await handleYearPcnt(ticker, year)
    : await handleDays(ticker, days)

  res.statusCode = 200
  res.json(temp)
}

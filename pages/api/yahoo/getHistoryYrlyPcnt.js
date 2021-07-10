//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  dateRange,
  dateRangeByNoOfYears,
  quoteFilterList
} from '@/config/price'
import { calPcnt } from '@/lib/commonFunction'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'
import { getQuote } from '@/lib/yahoo/getQuote'

const handleYearPcnt = async (ticker, year) => {
  const newDateRange = year ? await dateRangeByNoOfYears(year) : dateRange
  const inputItems = newDateRange.map(item => {
    return {
      ticker: ticker.toUpperCase(),
      ...item
    }
  })

  const quoteArr = await getQuote(ticker.toUpperCase())
  const quoteRes = quoteArr.find(x => x) || {}
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

      const outputItem = await getHistoryPrice(
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
            ? calPcnt(closing - opening, opening, 2, true)
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

export default async (req, res) => {
  const { ticker, year } = req.query

  const temp = await handleYearPcnt(ticker, year)

  res.statusCode = 200
  res.json(temp)
}

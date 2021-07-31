import { getFormattedFromToDate, parseBoolean } from '@/lib/commonFunction'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'
import { getQuote } from '@/lib/yahoo/getQuote'
import moment from 'moment'

const handleDays = async (ticker, days, isBus) => {
  const isBusBool = parseBoolean(isBus)
  const inputDays = parseInt(days)

  const { formattedFromDate, formattedToDate } = getFormattedFromToDate(
    days,
    isBusBool
  )

  const outputItem = await getHistoryPrice(
    ticker,
    formattedFromDate,
    formattedToDate
  )

  const closeDate = (outputItem.timestamp || []).map(item =>
    moment.unix(item).format('DD MMM YYYY')
  )
  const closePrice = outputItem.indicators.quote.find(x => x).close
  const allPriceDate = (closePrice || []).reduce((acc, cur, idx) => {
    // price must have value
    const curDatePrice = {
      date: closeDate[idx],
      price: cur
    }
    if (cur) acc.push(curDatePrice)
    return acc
  }, [])

  const newPriceDate =
    isBusBool && inputDays !== allPriceDate?.length
      ? allPriceDate.slice(Math.abs(allPriceDate?.length - inputDays))
      : allPriceDate
  const quoteArr = await getQuote(ticker.toUpperCase())
  const quoteRes = quoteArr.find(x => x) || {}

  return {
    historyPrice: newPriceDate,
    quote: {
      ...quoteRes
    }
  }
}

export default async (req, res) => {
  const { ticker, days, isBus } = req.query

  const temp = await handleDays(ticker, days, isBus)

  res.statusCode = 200
  res.json(temp)
}

import { getFormattedFromToDate, parseBoolean } from '@/lib/commonFunction'
import { getFormattedHistoryPrice } from '@/lib/stockinfo'
import { getQuote } from '@/lib/yahoo/getQuote'

const handleDays = async (ticker, days, isBus) => {
  const isBusBool = parseBoolean(isBus)
  const inputDays = parseInt(days)

  const { formattedFromDate, formattedToDate } = getFormattedFromToDate(
    inputDays,
    isBusBool
  )

  const outputItem = await getFormattedHistoryPrice(
    ticker,
    formattedFromDate,
    formattedToDate
  )

  const newPriceDate = [...Array(outputItem.date.length)].map((x, i) => {
    return {
      date: outputItem.date[i],
      price: outputItem.price[i]
    }
  })
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

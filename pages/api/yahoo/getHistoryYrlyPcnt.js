import { dateRangeByNoOfYears } from '@/config/price'
import { calPcnt } from '@/lib/commonFunction'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'

const handleYearPcnt = async (ticker, year) => {
  const newDateRange = dateRangeByNoOfYears(year)
  const inputItems = newDateRange.map(item => {
    return {
      ticker: ticker.toUpperCase(),
      ...item
    }
  })

  const historyPriceRes = await Promise.all(
    inputItems.map(async item => {
      const formattedFromDate = new Date(item.fromDate).getTime() / 1000
      const formattedToDate = new Date(item.toDate).getTime() / 1000

      const outputItem = await getHistoryPrice(
        item.ticker,
        formattedFromDate,
        formattedToDate
      )
      return {
        year: item.year,
        price: outputItem.indicators.quote.find(x => x).close
      }
    })
  )

  const newTemp = historyPriceRes.reduce(
    (acc, cur, idx) => {
      const price = cur.price
      const opening = price?.find(x => x)
      const closing = [...(price || [])].reverse()?.find(x => x)

      const newAcc = {
        ...acc,
        data: [
          ...(acc.data || []),
          {
            year: cur.year,
            price:
              opening && closing
                ? calPcnt(closing - opening, opening, 2, true)
                : 'N/A'
          }
        ],
        endPrice: (idx === 0 && closing) || acc.endPrice,
        startPrice: opening || acc.startPrice
      }

      return newAcc
    },
    {
      ticker: ticker.toUpperCase(),
      startPrice: null,
      endPrice: null,
      data: []
    }
  )

  return newTemp
}

export default async (req, res) => {
  const { ticker, year } = req.query

  const temp = await handleYearPcnt(ticker, year)

  res.statusCode = 200
  res.json(temp)
}

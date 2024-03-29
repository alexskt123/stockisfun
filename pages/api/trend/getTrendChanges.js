import { getFormattedFromToDate, parseBoolean } from '@/lib/commonFunction'
import { getHistoryPrice } from '@/lib/yahoo/getHistoryPrice'

export default async (req, res) => {
  const { ticker, days, isBus } = req.query

  const isBusBoo = parseBoolean(isBus)
  const { formattedFromDate, formattedToDate } = getFormattedFromToDate(
    days,
    isBusBoo
  )

  const outputItem = await getHistoryPrice(
    ticker,
    formattedFromDate,
    formattedToDate
  )

  res.statusCode = 200
  res.json(outputItem)
}

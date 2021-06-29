//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  getFormattedFromToDate,
  parseBoolean
} from '../../../lib/commonFunction'
import { getYahooHistoryPrice } from '../../../lib/yahoo/getYahooHistoryPrice'

export default async (req, res) => {
  const { ticker, days, isBus } = req.query

  const isBusBoo = parseBoolean(isBus)
  const { formattedFromDate, formattedToDate } = await getFormattedFromToDate(
    days,
    isBusBoo
  )

  const outputItem = await getYahooHistoryPrice(
    ticker,
    formattedFromDate,
    formattedToDate
  )

  res.statusCode = 200
  res.json(outputItem)
}

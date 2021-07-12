//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { extractYahooInfo } from '@/config/peers'
import { millify } from '@/lib/commonFunction'
import { getPeers } from '@/lib/moneycnn/getPeers'
import { getAPIResponse } from '@/lib/request'
import { getQuote } from '@/lib/yahoo/getQuote'

const getFormattedValue = (format, value) => {
  return format === 'millify' ? millify(value) : value
}

const getData = async args => {
  const { ticker } = args
  const data = await getPeers(ticker)

  const quotes = await Promise.all(
    data.map(async item => {
      const quoteArr = await getQuote(item.Ticker)
      return quoteArr.find(x => x) || {}
    })
  )

  const newData = [...data].map(item => {
    const data = quotes.find(x => x?.symbol === item.Ticker)

    const newItem = {
      ...item,
      ...extractYahooInfo.reduce((acc, cur) => {
        const newAcc = {
          ...acc,
          [cur.label]: getFormattedValue(
            cur.format,
            (data ? data : {})[cur.field]
          )
        }
        return newAcc
      }, {})
    }

    return newItem
  })

  return newData
}

export default async (req, res) => {
  const response = await getAPIResponse(req, getData)
  res.statusCode = 200
  res.json(response)
}

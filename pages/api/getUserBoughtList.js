//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUserInfoByUID } from '../../lib/firebaseResult'
import { getYahooMultiQuote } from '../../lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { uid } = req.query

  const { boughtList } = await getUserInfoByUID(uid ? uid : '')
  const boughtTickers = boughtList.map(x => x.ticker)

  const quotes = await getYahooMultiQuote(boughtTickers.join(','))
  const boughtListWithInfo = boughtList.map(boughtListItem => {
    const quote = quotes.find(x => x.symbol === boughtListItem.ticker)
    const isCash = boughtListItem.ticker === '$'
    const net = isCash ? 0 : quote?.regularMarketChange * boughtListItem.total
    const sum = isCash
      ? boughtListItem.total
      : quote?.regularMarketPrice * boughtListItem.total
    return {
      ...boughtListItem,
      net,
      sum
    }
  })

  res.statusCode = 200
  res.json(boughtListWithInfo)
}

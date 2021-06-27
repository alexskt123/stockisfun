//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { roundTo } from '../../lib/commonFunction'
import { getUserInfoByUID } from '../../lib/firebaseResult'
import { getYahooMultiQuote } from '../../lib/yahoo/getYahooQuote'

export default async (req, res) => {
  const { uid } = req.query

  const { boughtList } = await getUserInfoByUID(uid ? uid : '')
  const boughtTickers = boughtList.map(x => x.ticker)

  const quotes = await getYahooMultiQuote(boughtTickers.join(','))
  const sum = quotes.reduce((acc, curr, idx) => {
    return acc + roundTo(curr.regularMarketChange) * boughtList[idx].total
  }, 0)

  res.statusCode = 200
  res.json({
    boughtList,
    sum: roundTo(sum)
  })
}

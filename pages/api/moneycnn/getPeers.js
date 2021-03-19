//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getPeers } from '../../../lib/moneycnn/getPeers'
import { getHost } from '../../../lib/commonFunction'
import { extractYahooInfo } from '../../../config/peers'

const axios = require('axios').default

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getPeers(ticker)

  const responses = await axios.all(data.map(item => axios.get(`${getHost()}/api/yahoo/getYahooQuote?ticker=${item.Ticker}`)))

  const newData = [...data].map(item => {
    const data = responses.find(x => x.data && x.data.symbol === item.Ticker)?.data

    const newItem = {
      ...item,
      ...extractYahooInfo.reduce((acc, cur) => {        
        const newAcc = {
          ...acc,
          [cur.label]: (data ? data : {})[cur.field]
        }
        return newAcc
      }, {})
    }

    return newItem
  })

  res.statusCode = 200
  res.json(newData)
}

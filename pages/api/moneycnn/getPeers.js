//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getPeers } from '../../../lib/moneycnn/getPeers'
import { getHost } from '../../../lib/commonFunction'
import { extractYahooInfo } from '../../../config/peers'

const axios = require('axios').default

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getPeers(ticker)
  const newData = [...data]

  await axios.all(data.map(item => axios.get(`${getHost()}/api/yahoo/getYahooQuote?ticker=${item.Ticker}`)))
    .then((responses) => {
      responses.forEach(response => {
        if (response && response.data) {          
          extractYahooInfo.forEach(info => {
            const curData = newData.find(x => x.Ticker === response.data.symbol)
            if (curData)
              curData[info.label] = response.data[info.field]
          })
        }
      })
    })

  res.statusCode = 200
  res.json(newData)
}

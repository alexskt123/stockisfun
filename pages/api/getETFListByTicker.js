//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../lib/etfdb/getETFAUMSum'

const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  const etfList = await getETFAUMSum(ticker)
  let data = []
  let i = 0

  for (const etf of etfList) {

    if (i > 14) break

    data.push(etf)

    i += 1
  }

  // if (i < 15) {
  //   data = [...data, ...Array.from({length: 15 - etfList.length}, (_, i)=> 'N/A')]
  // }

  res.statusCode = 200
  res.json(data)
}

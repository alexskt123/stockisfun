//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../lib/getETFAUMSum'
import { getETFDB } from '../../lib/getETFDB'

const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  const etfList = await getETFAUMSum(ticker)
  let data = []
  let aumSum = 0
  let i = 0

  for (const etf of etfList) {
    if (i > 14) break

    const etfInfo = await getETFDB(etf.ticker)
    const etfSummary = `${etf.ticker}: ${etf.weight}% AUM: ${etfInfo.AUM}`
    aumSum += parseFloat(etfInfo.AUM.replace(/\$|M|,| /gi, ''))
    data.push(etfSummary)

    i += 1
  }

  data.push(`$${aumSum.toFixed(2)} M`)
  
  res.statusCode = 200
  res.json(data)
}

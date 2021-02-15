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
    if (i > 9) break

    const etfInfo = await getETFDB(etf.ticker)
    const etfSummary = `${etf.ticker}: ${etf.weight.replace('%', '')}% AUM: ${etfInfo.basicInfo.AUM}`
    aumSum += parseFloat(etfInfo.basicInfo.AUM.replace(/\$|M|,| /gi, ''))
    data.push(etfSummary)

    i += 1
  }

  if (i < 10) {
    data = [...data, ...Array.from({length: 10 - etfList.length}, (_, i)=> 'N/A')]
  }

  data.push(`$${aumSum.toFixed(2)} M`)
  
  res.statusCode = 200
  res.json(data)
}

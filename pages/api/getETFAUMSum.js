//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFAUMSum } from '../../lib/getETFAUMSum'
import { getETFDB } from '../../lib/getETFDB'

const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  const data = await getETFAUMSum(ticker)

  for (const a of data) {
    const b = await getETFDB(a.ticker)
    console.log(b)
  }
  
  res.statusCode = 200
  res.json(data)
}

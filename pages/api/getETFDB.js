//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getETFDB } from '../../lib/etfdb/getETFDB'


const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  const data = await getETFDB(ticker)
  
  res.statusCode = 200
  res.json(data)
}

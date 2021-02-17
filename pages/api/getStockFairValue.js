//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getStockFairValue } from '../../lib/forecast/getStockFairValue'
import { getYahooRecommendTrend } from '../../lib/yahoo/getYahooRecommendTrend'

const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  const data = await getStockFairValue(ticker)
  const yahooData = await getYahooRecommendTrend(ticker)
  let yahooDataArr = [...Object.values(yahooData.find(x => x) || {}).slice(1)]

  yahooDataArr = yahooDataArr.length == 0 ? ['N/A','N/A','N/A','N/A','N/A'] : yahooDataArr
  
  res.statusCode = 200
  res.json([...data, ...yahooDataArr])
}

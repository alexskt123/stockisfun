//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooHistoryPrice } from '../../lib/getYahooHistoryPrice'


const axios = require('axios').default


export default async (req, res) => {
  const { ticker, fromdate, todate } = req.query

  let formattedFromDate = new Date(fromdate);
  formattedFromDate = formattedFromDate.getTime() / 1000;
  
  let formattedToDate = new Date(todate);
  formattedToDate = formattedToDate.getTime() / 1000;

  const data = await getYahooHistoryPrice(ticker, formattedFromDate, formattedToDate)
  

  res.statusCode = 200
  res.json(data)
}

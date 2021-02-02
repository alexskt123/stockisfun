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
  

  // let formattedFromDate = new Date(fromdate);
  // formattedFromDate = formattedFromDate.getTime() / 1000;
  
  // let formattedToDate = new Date(fromdate);
  // formattedToDate.setDate(formattedToDate.getDate() + 5)
  // formattedToDate = formattedToDate.getTime() / 1000;

  // const fromData = await getYahooHistoryPrice(ticker, formattedFromDate, formattedToDate)


  // formattedFromDate = new Date(todate)
  // formattedFromDate.setDate(formattedFromDate.getDate() - 10)
  // formattedFromDate = formattedFromDate.getTime() / 1000;
  
  // formattedToDate = new Date(todate);
  // formattedToDate = formattedToDate.getTime() / 1000;

  // const toData = await getYahooHistoryPrice(ticker, formattedFromDate, formattedToDate)
  
  // const data = {
  //   'timestamp': [
  //     ...fromData.timestamp,
  //     ...toData.timestamp
  //   ],
  //   'indicators': {
  //       "quote": [
  //           {
  //               "close": [
  //                 ...fromData.indicators.quote[0].close,
  //                 ...toData.indicators.quote[0].close
  //               ]
  //           }
  //       ]
  //   }    
  // }

  res.statusCode = 200
  res.json(data)
}

//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooAssetProfile } from '../../lib/getYahooAssetProfile'
import { getYahooQuote } from '../../lib/getYahooQuote'

import commaNumber from 'comma-number'

const axios = require('axios').default


export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooAssetProfile(ticker)
  const quote = await getYahooQuote(ticker)


  const newData = {
    'Name': quote.longName,
    'Website': data.website,
    'Industry': data.industry,
    'Sector': data.sector,
    'Market Cap.': commaNumber(quote.marketCap),
    'Price To Book': quote.priceToBook,
    'Current EPS': quote.epsCurrentYear,
    'Trailing PE': quote.trailingPE,
    'Dividend': `${quote.trailingAnnualDividendRate||'N/A'}%`,
    'Full Time Employees': data.fullTimeEmployees,
    'Address': `${data.address1||''}, ${data.address2||''}, ${data.city||''}, ${data.state||''}, ${data.zip||''}, ${data.country||''}`.replace(', ,', ''),
    'Business Summary': data.longBusinessSummary,
    'Company Officers': data.companyOfficers
  }

  // console.log(newData)

  res.statusCode = 200
  res.json(newData)
}

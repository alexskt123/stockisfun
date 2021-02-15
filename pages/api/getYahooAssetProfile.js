//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooAssetProfile } from '../../lib/getYahooAssetProfile'
import { getYahooQuote } from '../../lib/getYahooQuote'
import { getYahooBalanceSheet } from '../../lib/getYahooBalanceSheet'
import millify from 'millify'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooAssetProfile(ticker)
  const quote = await getYahooQuote(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)

  const balanceSheetExtract = balanceSheet.map(item => {
    const newItem = {}
    newItem['Date'] = item.endDate.fmt
    //newItem['Cash'] = item.cash.fmt
    newItem['Total Current Assets'] = item.totalCurrentAssets.fmt
    newItem['Total Current Liability'] = item.totalCurrentLiabilities.fmt

    newItem[' '] = ' '

    newItem['Total Non-Current Assets'] = millify(item.totalAssets.raw - item.totalCurrentAssets.raw)
    newItem['Total Non-Current Liability'] = millify(item.totalLiab.raw - item.totalCurrentLiabilities.raw)

    newItem['  '] = '  '

    newItem['Total Assets'] = item.totalAssets.fmt
    newItem['Total Liability'] = item.totalLiab.fmt

    newItem['   '] = '   '

    newItem['Total Stock Holder Equity'] = item.totalStockholderEquity.fmt
    return newItem
  })


  const newData = {
    'Name': quote.longName,
    'Website': data.website,
    'Industry': data.industry,
    'Sector': data.sector,
    'Market Cap.': millify(quote.marketCap),
    'Price To Book': quote.priceToBook,
    'Current EPS': quote.epsCurrentYear,
    'Trailing PE': quote.trailingPE,
    'Dividend': `${quote.trailingAnnualDividendRate || 'N/A'}%`,
    'Full Time Employees': millify(data.fullTimeEmployees),
    'Address': `${data.address1 || ''}, ${data.address2 || ''}, ${data.city || ''}, ${data.state || ''}, ${data.zip || ''}, ${data.country || ''}`.replace(', ,', ''),
    'Business Summary': data.longBusinessSummary,
    'Company Officers': data.companyOfficers
  }

  // console.log(newData)

  res.statusCode = 200
  res.json({
    basics: {...newData},
    balanceSheet: [...balanceSheetExtract]
  })
}

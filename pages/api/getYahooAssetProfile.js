//GET https://zh.wikipedia.org/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getYahooAssetProfile } from '../../lib/yahoo/getYahooAssetProfile'
import { getYahooQuote } from '../../lib/yahoo/getYahooQuote'
import { getYahooBalanceSheet } from '../../lib/yahoo/getYahooBalanceSheet'
import millify from 'millify'
import roundTo from 'round-to'

export default async (req, res) => {
  const { ticker } = req.query

  const data = await getYahooAssetProfile(ticker)
  const quote = await getYahooQuote(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)

  const balanceSheetExtract = balanceSheet.map(item => {
    const newItem = {}
    newItem['Date'] = item.endDate?.fmt
    //newItem['Cash'] = item.cash.fmt
    newItem['Total Current Assets'] = item.totalCurrentAssets?.fmt
    newItem['Total Current Liability'] = item.totalCurrentLiabilities?.fmt

    newItem[' '] = ' '

    newItem['Total Non-Current Assets'] = millify(item.totalAssets?.raw - item.totalCurrentAssets?.raw || 0)
    newItem['Total Non-Current Liability'] = millify(item.totalLiab?.raw - item.totalCurrentLiabilities?.raw || 0)

    newItem['  '] = '  '

    newItem['Total Assets'] = item.totalAssets?.fmt
    newItem['Total Liability'] = item.totalLiab?.fmt

    newItem['   '] = '   '

    newItem['Total Stock Holder Equity'] = item.totalStockholderEquity?.fmt

    newItem['    '] = '    '

    if (item.totalCurrentAssets && item.totalCurrentLiabilities)
      newItem['Current Ratio'] = (item.totalCurrentAssets?.raw / item.totalCurrentLiabilities?.raw).toFixed(2)

    if (item.totalCurrentLiabilities)
      newItem['Quick Ratio'] = ((item.cash ? item.cash.raw : 0
                                + item.shortTermInvestments ? item.shortTermInvestments?.raw : 0
                                + item.netReceivables ? item.netReceivables?.raw : 0) 
                                /item.totalCurrentLiabilities?.raw).toFixed(2)
    
    if (item.totalLiab && item.totalStockholderEquity)
      newItem['Total Debt/Equity'] = (item.totalLiab?.raw / item.totalStockholderEquity?.raw).toFixed(2)
    return newItem
  })


  const newData = {
    'Name': quote.longName,
    'Price': quote.regularMarketPrice,
    '52W-Low-High': `${roundTo(parseFloat(quote.fiftyTwoWeekLow), 2)} - ${roundTo(parseFloat(quote.fiftyTwoWeekHigh), 2)}`,
    'Website': data.website,
    'Industry': data.industry,
    'Sector': data.sector,
    'Market Cap.': millify(quote.marketCap || 0),
    'Price To Book': quote.priceToBook,
    'Current EPS': quote.epsCurrentYear,
    'Trailing PE': quote.trailingPE?.toFixed(2),
    'Forward PE': quote.forwardPE?.toFixed(2),
    'Dividend': `${quote.trailingAnnualDividendRate || 'N/A'}%`,
    'Full Time Employees': millify(data.fullTimeEmployees || 0),
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

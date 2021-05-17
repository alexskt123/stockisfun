import moment from 'moment-business-days'

//const selectedHeaders = "Issuer,Structure,Expense Ratio,Inception,Index Tracked,Category,Asset Class,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume"
const selectedHeaders = 'Issuer,Expense Ratio,Inception,Index Tracked,Category,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume'

export const selectedHeadersArr = selectedHeaders.split(',')

import { SWRSticky } from './settings'

export const tableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    format: 'Badge',
    show: true
  },
  {
    label: 'Price',
    item: 'Price',
    show: true
  },
  {
    label: 'Issuer',
    item: 'Issuer',
    show: true
  },
  {
    label: 'Expense Ratio',
    item: 'Expense Ratio',
    show: true
  },
  {
    label: 'Inception',
    item: 'Inception',
    show: true
  },
  {
    label: 'Index Tracked',
    item: 'Index Tracked',
    show: true
  },
  {
    label: 'Category',
    item: 'Category',
    show: true
  },
  {
    label: '52 Week Lo',
    item: '52 Week Lo',
    show: true
  },
  {
    label: '52 Week Hi',
    item: '52 Week Hi',
    show: true
  },
  {
    label: 'AUM',
    item: 'AUM',
    show: true
  },
  {
    label: '1 Month Avg. Volume',
    item: '1 Month Avg. Volume',
    show: true
  },
  {
    label: '3 Month Avg. Volume',
    item: '3 Month Avg. Volume',
    show: true
  },
  {
    label: 'Year to Date Return',
    item: 'Year to Date Return',
    show: true
  },
  {
    label: '1 Year Return',
    item: '1 Year Return',
    show: true
  },
  {
    label: '3 Year Return',
    item: '3 Year Return',
    show: true
  }
]



export const etfDetailsSettings = {
  inputETFTicker: null,
  selectedStockTicker: null,
  selectedStockTitle: '',
  selectedTab: 'Basics',
  disableSelectedStockTab: true
}

export const etfDetailsBasicSettings = {
  tableHeader: [],
  tableData: []
}

export const etfDetailsHoldingSettings = {
  tableHeader: [],
  tableData: [],
  noOfHoldings: 'N/A',
  pieData: {},
  priceHref: '/',
  forecastHref: '/',
  watchlistHref: '/'
}

export const etfHoldingHeader = ['Ticker', 'Name', 'Holding', 'YTD%', ...[...Array(3)].map((_item, idx) => `${moment().subtract(idx + 1, 'years').year()}%`)]

export const aumSumCount = 10
export const etfListByTickerCount = 15

export const aumTableHeader = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    format: 'Badge',
    show: true
  },
  ...Array.from({ length: aumSumCount }, (_x, i) => ({ label: `ETF ${i + 1}`, item: `ETF ${i + 1}`, show: true })),
  { label: 'AUM Sum', item: 'AUM Sum', show: true },
  { label: 'Price', item: 'Price', show: true },
  { label: 'Market Cap.', item: 'Market Cap.', show: true },
  { label: 'Floating Shares Ratio', item: 'Floating Shares Ratio', show: true },
  { label: 'No. of ETF', item: 'No. of ETF', show: true },
  { label: 'No. of Analyst', item: 'cnnNoOfAnalyst', show: true },
  { label: '1 Yr Median', item: 'cnn1YrMean', show: true },
  { label: '1 Yr High', item: 'cnn1YrHigh', show: true },
  { label: '1 Yr Low', item: 'cnn1YrLow', show: true },
  { label: 'Average %', item: 'cnnAvgPercentage', show: true }
]

export const etfTools = [
  { type: 'etftostock', id: 'watchList', icon: 'AiFillEye', label: 'Watch List', href: 'watchlist', redirectURL: 'etftostock' },
  { type: 'etftostock', id: 'priceChange', icon: 'RiExchangeDollarFill', label: 'Price Change', href: 'compare/price', redirectURL: 'etftostock' },
  { type: 'etftostock', id: 'financial', icon: 'BiTrendingUp', label: 'Financial', href: 'compare/financials', redirectURL: 'etftostock' },
  { type: 'etftostock', id: 'birdmouth', icon: 'GiBirdTwitter', label: 'BirdMouth', href: 'compare/birdmouth', redirectURL: 'etftostock' }
]

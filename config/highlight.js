import { SWRSticky } from './settings'

export const extractYahooInfo = [
  {
    label: 'Price',
    field: 'regularMarketPrice'
  },
  {
    label: 'Percentage',
    field: 'regularMarketChangePercent'
  },
  {
    label: 'Change',
    field: 'regularMarketChange'
  }
]

export const stockIndex = [
  { Ticker: '^DJI', Name: 'Dow Jones' },
  { Ticker: '^GSPC', Name: 'S&P 500' },
  { Ticker: '^IXIC', Name: 'NASDAQ' },
  { Ticker: '^RUT', Name: 'Russell 2000' },
  { Ticker: 'BTC-USD', Name: 'Bitcoin' },
  { Ticker: '^HSI', Name: 'HSI' },
  { Ticker: '^FTSE', Name: 'FTSE 100' },
  { Ticker: '^N225', Name: 'NKI' }
]


export const stockFutureIndex = [
  { Ticker: 'YM=F', Name: 'Dow Jones F.' },
  { Ticker: 'ES=F', Name: 'S&P 500 F.' },
  { Ticker: 'NQ=F', Name: 'NASDAQ F.' },
  { Ticker: 'RTY=F', Name: 'Russell 2000 F.' },
  { Ticker: 'BTC=F', Name: 'Bitcoin F.' },
]

export const indexQuoteInfo = [
  [{ label: 'Name', field: 'shortName', value: null }],
  [{ label: 'Pre', field: 'preMarketPrice', value: null }, { field: 'preMarketChange', value: null, format: 'PriceChange' }, { field: 'preMarketChangePercent', value: null, format: 'PriceChange%' }],
  [{ label: 'Price', field: 'regularMarketPrice', value: null }, { field: 'regularMarketChange', value: null, format: 'PriceChange' }, { field: 'regularMarketChangePercent', value: null, format: 'PriceChange%' }],
  [{ label: 'Day Range', field: 'regularMarketDayRange', value: null }],
  [{ label: 'Prev. Close', field: 'regularMarketPreviousClose', value: null }],
  [{ label: '52 Week Low', field: 'fiftyTwoWeekLow', value: null }, { label: '52 Week High', field: 'fiftyTwoWeekHigh', value: null }],
  [{ label: 'Revenue', field: 'revenueIndicator', format: 'IndicatorVariant', value: null }, { label: 'Income', field: 'incomeIndicator', format: 'IndicatorVariant', value: null }],
  [{ label: 'Debt Clearance', field: 'debtClearance', value: null }]
]

export const tableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    show: true,
    format: 'Badge'
  },
  {
    label: 'Name',
    item: 'shortName',
    show: true
  },
  {
    label: 'Pre Time',
    item: 'preMarketTime',
    format: 'H:mm:ss',
    show: true
  },
  {
    label: 'Pre Market',
    item: 'preMarketPrice',
    show: true
  },
  {
    label: 'Pre Market%',
    item: 'preMarketChangePercent',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Pre Market Chg',
    item: 'preMarketChange',
    format: 'millify',
    property: 'netChange',
    show: true
  },
  {
    label: 'Market',
    item: 'regularMarketPrice',
    show: true
  },
  {
    label: 'Day Chg%',
    item: 'regularMarketChangePercent',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Day Chg',
    item: 'regularMarketChange',
    format: 'millify',
    property: 'netChange',
    show: true
  },
  {
    label: 'Earnings Date',
    item: 'earningsDate',
    show: true
  }
]
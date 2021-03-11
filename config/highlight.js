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
  { label: 'Name', field: 'shortName', value: null },
  { label: 'Day Change', field: 'regularMarketChange', value: null },
  { label: 'Day Range', field: 'regularMarketDayRange', value: null },
  { label: 'Prev. Close', field: 'regularMarketPreviousClose', value: null },
  { label: '52 Week High', field: 'fiftyTwoWeekHigh', value: null },
  { label: '52 Week Low', field: 'fiftyTwoWeekLow', value: null }
]


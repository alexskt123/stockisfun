export const extractYahooInfo = [
  {
    label: 'Price',
    field: 'regularMarketPrice'
  },
  {
    label: 'Percentage',
    field: 'regularMarketChangePercent'
  }
]

export const stockIndex = [
  { Ticker: '^DJI', Name: 'Dow Jones' },
  { Ticker: '^GSPC', Name: 'S&P 500' },
  { Ticker: '^IXIC', Name: 'NASDAQ' },
  { Ticker: '^HSI', Name: 'HSI' },
  { Ticker: '^FTSE', Name: 'FTSE 100' },
  { Ticker: '^N225', Name: 'NKI' }
]

export const indexQuoteInfo = [
  {label: 'Name', field: 'shortName', value: null},
  {label: 'Day Change', field: 'regularMarketChange', value: null},
  {label: 'Day Range', field: 'regularMarketDayRange', value: null},
  {label: 'Prev. Close', field: 'regularMarketPreviousClose', value: null},
  {label: 'Market', field: 'market', value: null}
]


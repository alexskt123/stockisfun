export const excludeList = ['INX', 'INDU']

export const extractYahooInfo = [
  {
    label: 'Price',
    field: 'regularMarketPrice'
  },
  {
    label: 'Market Cap.',
    field: 'marketCap',
    format: 'millify'
  },
  {
    label: 'P/B',
    field: 'priceToBook',
    format: 'millify'
  },
  {
    label: 'Trailing PE',
    field: 'trailingPE',
    format: 'millify'
  }
]

export const peersHeader = ['Ticker', 'Name', 'Price', 'Market Cap.', 'P/B', 'Trailing PE']
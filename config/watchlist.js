const sticky = { backgroundColor: '#f0f0f0', left: 0, position: 'sticky', zIndex: 997 }

export const tableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: sticky
  },
  {
    label: 'Pre Time',
    item: 'preMarketTime',
    format: 'H:mm:ss'
  },
  {
    label: 'Pre Market',
    item: 'preMarketPrice'
  },
  {
    label: 'Pre Market%',
    item: 'preMarketChangePercent',
    format: '%'
  },
  {
    label: 'Market',
    item: 'regularMarketPrice'
  },
  {
    label: 'Day Chg%',
    item: 'regularMarketChangePercent',
    format: '%'
  },
  {
    label: 'Volume',
    item: 'regularMarketVolume',
    format: 'millify'
  },
  {
    label: 'Day Range',
    item: 'regularMarketDayRange'
  },
  {
    label: 'Prev. Close',
    item: 'regularMarketPreviousClose'
  }
]
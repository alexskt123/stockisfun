export const emailConfig = [
  {
    category: 'priceMA',
    name: 'Stock Price Moving Average - Bought List',
    subject: 'Stock Price Moving Average - Bought List',
    type: 'boughtList',
    id: 'priceMABoughtList',
    subscribe: false,
    to: ''
  },
  {
    category: 'priceMA',
    name: 'Stock Price Moving Average - Watch List',
    subject: 'Stock Price Moving Average - Watch List',
    type: 'watchList',
    id: 'priceMAWatchList',
    subscribe: false,
    to: ''
  }
]

export const userStockList = [
  {
    key: 'cash',
    name: 'cash',
    badge: {
      title: 'Update Cash'
    },
    control: {
      type: 'number'
    }
  },
  {
    key: 'stock',
    name: 'stockList',
    badge: {
      title: 'Update Stock List'
    },
    control: {
      as: 'textarea',
      rows: '3'
    }
  },
  {
    key: 'etf',
    name: 'etfList',
    badge: {
      title: 'Update ETF List'
    },
    control: {
      as: 'textarea',
      rows: '3'
    }
  },
  {
    key: 'watch',
    name: 'watchList',
    badge: {
      title: 'Update Watch List'
    },
    control: {
      as: 'textarea',
      rows: '3'
    }
  }
]

export const tableHeader = [
  { item: 'ticker', label: 'Ticker', type: 'text' },
  { item: 'total', label: 'Quantity', type: 'number' }
]

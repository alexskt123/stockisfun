export const indexQuoteInfo = [
  [{ label: 'Name', field: 'shortName', value: null }],
  [
    { label: 'Pre', field: 'preMarketPrice', value: null },
    { field: 'preMarketChange', value: null, format: 'PriceChange' },
    { field: 'preMarketChangePercent', value: null, format: 'PriceChange%' }
  ],
  [
    { label: 'Price', field: 'regularMarketPrice', value: null },
    { field: 'regularMarketChange', value: null, format: 'PriceChange' },
    { field: 'regularMarketChangePercent', value: null, format: 'PriceChange%' }
  ],
  [
    { label: 'Post', field: 'postMarketPrice', value: null },
    { field: 'postMarketChange', value: null, format: 'PriceChange' },
    { field: 'postMarketChangePercent', value: null, format: 'PriceChange%' }
  ],
  [{ label: 'Day Range', field: 'regularMarketDayRange', value: null }],
  [{ label: 'Prev. Close', field: 'regularMarketPreviousClose', value: null }],
  [
    { label: '52 Week Low', field: 'fiftyTwoWeekLow', value: null },
    { label: '52 Week High', field: 'fiftyTwoWeekHigh', value: null }
  ],
  [
    {
      label: 'Revenue',
      field: 'revenueIndicator',
      format: 'IndicatorVariant',
      value: null
    },
    {
      label: 'Income',
      field: 'incomeIndicator',
      format: 'IndicatorVariant',
      value: null
    }
  ],
  [{ label: 'Debt Clearance', field: 'debtClearance', value: null }]
]

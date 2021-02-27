import moment from 'moment-business-days'

//const selectedHeaders = "Issuer,Structure,Expense Ratio,Inception,Index Tracked,Category,Asset Class,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume"
const selectedHeaders = 'Issuer,Expense Ratio,Inception,Index Tracked,Category,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume'

export const selectedHeadersArr = selectedHeaders.split(',')

export const etfDetailsSettings = {
  basics: {
    tableHeader: [],
    tableData: []
  },
  holding: {
    tableHeader: [],
    tableData: []
  },
  pieData: {},
  inputETFTicker: [],
  selectedStockTicker: '',
  selectedStockTitle: '',
  selectedTab: 'Basics',
  priceHref: '/',
  forecastHref: '/',
  disableSelectedStockTab: true
}

export const etfHoldingHeader = ['Ticker', 'Name', 'Holding', 'YTD%', ...[...Array(3)].map((_item, idx) => `${moment().subtract(idx + 1, 'years').year()}%`)]

export const aumSumCount = 10

export const aumTableHeader = [
  'Ticker',
  ...Array.from({ length: aumSumCount }, (_x, i) => `ETF ${i + 1}`),
  'AUM Sum',
  'Price',
  'Market Cap.',
  'Floating Shares Ratio',
  'No. of ETF',
  'No. of Analyst',
  '1 Yr Median',
  '1 Yr High',
  '1 Yr Low',
  'Average %'
]

//import { SWRSticky } from './settings'

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

export const initSettings = { tableHeader: [], tableData: [] }

// export const peersHeader = [
//   {
//     label: 'Ticker',
//     item: 'symbol',
//     style: SWRSticky,
//     format: 'Badge',
//     show: true
//   },
//   {
//     label: 'Name',
//     item: 'name',
//     show: true
//   },
//   {
//     label: 'Price',
//     item: 'regularMarketPrice',
//     show: true
//   },
//   {
//     label: 'Market Cap.',
//     item: 'marketCap',
//     format: 'millify',
//     show: true
//   },
//   {
//     label: 'P/B',
//     item: 'priceToBook',
//     format: 'millify',
//     show: true
//   },
//   {
//     label: 'Trailing PE',
//     item: 'trailingPE',
//     format: 'millify',
//     show: true
//   }
// ]

export const peersHeader = ['Ticker', 'Name', 'Price', 'Market Cap.', 'P/B', 'Trailing PE']
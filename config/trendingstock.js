import { SWRSticky } from './settings'

const showSWRDetail = (input, router) => {
  router.push(`/stockinfo?ticker=${input?.symbol}&type=detail`)
}

export const tableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    format: 'Badge',
    show: true,
    className: 'cursor',
    onClick: showSWRDetail
  },
  {
    label: 'Name',
    item: 'shortName',
    show: true
  },
  {
    label: 'Price',
    item: 'regularMarketPrice',
    format: 'roundTo',
    show: true
  },
  {
    label: 'Chg',
    item: 'regularMarketChange',
    format: 'roundTo',
    property: 'netChange',
    show: true
  },
  {
    label: 'Chg %',
    item: 'regularMarketChangePercent',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Volume',
    item: 'regularMarketVolume',
    format: 'millify',
    show: true
  },
  {
    label: 'Market Cap',
    item: 'marketCap',
    format: 'millify',
    show: true
  },
  {
    label: 'Day Range',
    item: 'regularMarketDayRange',
    show: true
  },
  {
    label: 'Revenue',
    item: 'revenueIndicator',
    format: 'IndicatorVariant',
    show: true
  },
  {
    label: 'Income',
    item: 'incomeIndicator',
    format: 'IndicatorVariant',
    show: true
  }
]

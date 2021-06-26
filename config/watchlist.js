import { SWRSticky } from './settings'

export const tableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    format: 'Badge',
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
    label: 'Volume',
    item: 'regularMarketVolume',
    format: 'millify',
    show: true
  },
  {
    label: 'Day Range',
    item: 'regularMarketDayRange',
    show: true
  },
  {
    label: 'Prev. Close',
    item: 'regularMarketPreviousClose',
    show: true
  }
]

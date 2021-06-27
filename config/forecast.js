import { SWRSticky } from './settings'

export const walletHeader = [
  {
    label: 'Price',
    item: 'walletPrice',
    format: 'roundTo',
    show: true
  },
  {
    label: '1 Yr Forecast',
    item: 'wallet1YrForecast',
    format: 'roundTo',
    show: true
  },
  {
    label: '5 Yr Forecast',
    item: 'wallet5YrForecast',
    format: 'roundTo',
    show: true
  },
  {
    label: '1 Yr %',
    item: 'wallet1YrPercentage',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: '5 Yr %',
    item: 'wallet5YrPercentage',
    property: 'netChange',
    format: '%',
    show: true
  }
]

export const yahooTrendHeader = [
  {
    label: 'Strong Buy',
    item: 'yahooStrongBuy',
    format: 'toInteger',
    show: true
  },
  {
    label: 'Buy',
    item: 'yahooBuy',
    format: 'toInteger',
    show: true
  },
  {
    label: 'Hold',
    item: 'yahooHold',
    format: 'toInteger',
    show: true
  },
  {
    label: 'Sell',
    item: 'yahooSell',
    format: 'toInteger',
    show: true
  },
  {
    label: 'Strong Sell',
    item: 'yahooStrongSell',
    format: 'toInteger',
    show: true
  }
]

export const moneyCnnHeader = [
  {
    label: 'No. of Analyst',
    item: 'cnnNoOfAnalyst',
    format: 'toInteger',
    show: true
  },
  {
    label: '1 Yr Median',
    item: 'cnn1YrMean',
    format: 'roundTo',
    show: true
  },
  {
    label: '1 Yr High',
    item: 'cnn1YrHigh',
    format: 'roundTo',
    show: true
  },
  {
    label: '1 Yr Low',
    item: 'cnn1YrLow',
    format: 'roundTo',
    show: true
  },
  {
    label: 'Average %',
    item: 'cnnAvgPercentage',
    format: '%',
    property: 'netChange',
    show: true
  }
]

export const tableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    format: 'Badge',
    show: true
  },
  ...walletHeader,
  {
    label: 'Score(>50 Buy <50 Sell)',
    item: 'financhillScore',
    format: 'toInteger',
    show: true
  },
  ...moneyCnnHeader,
  ...yahooTrendHeader
]

export const forecastTableFirstHeader = [
  { label: '', style: SWRSticky },
  { label: 'WalletInvestor' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: 'Financhill' },
  { label: 'MoneyCnn' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: 'Yahoo' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: '' }
]

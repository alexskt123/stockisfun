import { SWRSticky } from './settings'

export const walletHeader = [
  {
    label: 'Price',
    item: 'walletPrice',
    show: true
  },
  {
    label: '1 Yr Forecast',
    item: 'wallet1YrForecast',
    show: true
  },
  {
    label: '5 Yr Forecast',
    item: 'wallet5YrForecast',
    show: true
  },
  {
    label: '1 Yr %',
    item: 'wallet1YrPercentage',
    show: true
  },
  {
    label: '5 Yr %',
    item: 'wallet5YrPercentage',
    show: true
  }
]

export const yahooTrendHeader = [
  {
    label: 'Strong Buy',
    item: 'yahooStrongBuy',
    show: true
  },
  {
    label: 'Buy',
    item: 'yahooBuy',
    show: true
  },
  {
    label: 'Hold',
    item: 'yahooHold',
    show: true
  },
  {
    label: 'Sell',
    item: 'yahooSell',
    show: true
  },
  {
    label: 'Strong Sell',
    item: 'yahooStrongSell',
    show: true
  }
]

export const moneyCnnHeader = [
  {
    label: 'No. of Analyst',
    item: 'cnnNoOfAnalyst',
    show: true
  },
  {
    label: '1 Yr Median',
    item: 'cnn1YrMean',
    show: true
  },
  {
    label: '1 Yr High',
    item: 'cnn1YrHigh',
    show: true
  },
  {
    label: '1 Yr Low',
    item: 'cnn1YrLow',
    show: true
  },
  {
    label: 'Average %',
    item: 'cnnAvgPercentage',
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
    show: true
  },
  ...moneyCnnHeader,
  ...yahooTrendHeader
]

export const forecastTableFirstHeader = [
  {label: '', style: SWRSticky },
  {label: 'WalletInvestor' },
  {label: '' },
  {label: '' },
  {label: '' },
  {label: '' },
  {label: 'Financhill' },
  {label: 'MoneyCnn' },
  {label: '' },
  {label: '' },
  {label: '' },
  {label: '' },
  {label: 'Yahoo' },
  {label: '' },
  {label: '' },
  {label: '' },
  {label: '' }
]

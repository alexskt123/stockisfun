import { convertToPercentageNoSign } from '@/lib/commonFunction'

import { SWRSticky } from './settings'

export const pieOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${convertToPercentageNoSign(
            context.parsed,
            true
          )}`
        }
      }
    }
  }
}

export const keyInfoTableHeaderList = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    show: true,
    format: 'Badge'
  },
  {
    label: 'Name',
    item: 'shortName',
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
  },
  {
    label: 'Revenue Annualized',
    item: 'revenueAnnualized',
    format: '%',
    property: 'netChange',
    show: true
  },

  {
    label: 'Income Annualized',
    item: 'incomeAnnualized',
    format: '%',
    property: 'netChange',
    show: true
  }
]

export const keyForecastInfoHeader = [
  {
    label: 'Ticker',
    item: 'ticker',
    style: SWRSticky,
    show: true,
    format: 'Badge'
  },
  {
    label: 'Current Price',
    item: 'price',
    show: true
  },
  {
    label: '1 Yr Median',
    item: 'cnn1YrMean',
    format: 'roundTo',
    show: true
  },
  {
    label: 'Average %',
    item: 'cnnAvgPercentage',
    format: '%',
    property: 'netChange',
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
    label: 'No. of Analyst',
    item: 'cnnNoOfAnalyst',
    format: 'toInteger',
    show: true
  }
]

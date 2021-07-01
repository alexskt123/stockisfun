import { convertToPercentage } from '@/lib/commonFunction'

import { SWRSticky } from './settings'

export const pieOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${convertToPercentage(
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
    label: 'Revenue Annualized',
    item: 'revenueAnnualized',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Income',
    item: 'incomeIndicator',
    format: 'IndicatorVariant',
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

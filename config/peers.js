import { SWRSticky } from './settings'

const showSWRDetail = (input, router) => {
  router.push(`/stockinfo?ticker=${input?.symbol}&type=detail`)
}

export const excludeList = ['INX', 'INDU']

export const peersHeader = [
  {
    label: 'Ticker',
    item: 'symbol',
    style: SWRSticky,
    show: true,
    format: 'Badge',
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
    show: true
  },
  {
    label: 'Market Cap.',
    item: 'marketCap',
    format: 'millify',
    show: true
  },
  {
    label: 'P/B',
    item: 'priceToBook',
    format: 'millify',
    show: true
  },
  {
    label: 'Trailing PE',
    item: 'trailingPE',
    format: 'millify',
    show: true
  },
  {
    label: 'Avg. Analyst Rating',
    item: 'averageAnalystRating',
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

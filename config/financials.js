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
    label: 'Last Revenue',
    item: 'revenue-1',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Past 2 Yrs',
    item: 'revenue-2',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Past 3 Yrs',
    item: 'revenue-3',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Annualized Revenue',
    item: 'revenueAnnualized',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Revenue Indicator',
    item: 'revenueIndicator',
    format: 'Badge',
    show: true,
  },
  {
    label: 'Last Income',
    item: 'netIncome-1',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Past 2 Yrs Income',
    item: 'netIncome-2',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Past 3 Yrs Income',
    item: 'netIncome-3',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Annualized Income',
    item: 'incomeAnnualized',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Income Indicator',
    item: 'incomeIndicator',
    format: 'Badge',
    show: true
  },
  {
    label: 'Debt Clearance',
    item: 'debtClearance',
    show: true
  },
  {
    label: 'Trailing PE',
    item: 'trailingPE',
    show: true
  },
  {
    label: 'Return On Equity',
    item: 'returnOnEquity',
    show: true
  },
  {
    label: 'Gross Margin',
    item: 'grossMargin',
    show: true
  },
  {
    label: 'Return On Assets',
    item: 'returnOnAssets',
    show: true
  }
]

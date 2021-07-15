export const trend = [
  { label: 'Energy', ticker: 'XLE' },
  { label: 'Health Care', ticker: 'XLV' },
  { label: 'Consumer Defensive', ticker: 'XLP' },
  { label: 'Financial', ticker: 'XLF' },
  { label: 'Communication Services', ticker: 'XLC' },
  { label: 'Real Estate', ticker: 'XLRE' },
  { label: 'Utilities', ticker: 'XLU' },
  { label: 'Industrials', ticker: 'XLI' },
  { label: 'Basic Materials', ticker: 'XLB' },
  { label: 'Consumer Cyclical', ticker: 'XLY' },
  { label: 'Technology', ticker: 'XLK' }
]

export const trendTools = [
  {
    type: 'etftostock',
    id: 'watchList',
    icon: 'AiFillEye',
    label: 'Watch List',
    href: 'watchlist',
    redirectURL: 'etftostock'
  },
  {
    type: 'etftostock',
    id: 'priceChange',
    icon: 'RiExchangeDollarFill',
    label: 'Price Change',
    href: 'compare/price',
    redirectURL: 'etftostock'
  },
  {
    type: 'etftostock',
    id: 'financial',
    icon: 'BiTrendingUp',
    label: 'Financial',
    href: 'compare/financials',
    redirectURL: 'etftostock'
  },
  {
    type: 'etftostock',
    id: 'birdmouth',
    icon: 'GiBirdTwitter',
    label: 'BirdMouth',
    href: 'compare/birdmouth',
    redirectURL: 'etftostock'
  }
]

export const trendBarCategory = [
  { label: 'Energy', ticker: 'XLE' },
  { label: 'Health Care', ticker: 'XLV' },
  { label: 'Consumer Defensive', ticker: 'XLP' },
  { label: 'Financial', ticker: 'XLF' },
  { label: 'Communication Services', ticker: 'XLC' },
  { label: 'Real Estate', ticker: 'XLRE' },
  { label: 'Utilities', ticker: 'XLU' },
  { label: 'Industrials', ticker: 'XLI' },
  { label: 'Basic Materials', ticker: 'XLB' },
  { label: 'Consumer Cyclical', ticker: 'XLY' },
  { label: 'Technology', ticker: 'XLK' },
  { label: 'Semiconductor', ticker: '^SOX' }
]

export const barChartOptions = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2
    }
  },
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Trend Changes (%)'
    }
  },
  scales: {
    y: {
      ticks: {
        autoSkip: false
      }
    }
  }
}

export const trendChangeDateRangeSelectAttr = {
  formControl: {
    as: 'select',
    size: 'sm',
    className: 'my-1 mr-sm-2',
    defaultValue: 8,
    name: 'formYear'
  },
  dateRangeOptions: [
    {
      label: '10 years',
      value: '3650'
    },
    {
      label: '3 years',
      value: '1095'
    },
    {
      label: '1 year',
      value: '365'
    },
    {
      label: 'half year',
      value: '178'
    },
    {
      label: '3 months',
      value: '90'
    },
    {
      label: '1 month',
      value: '30'
    },
    {
      label: '1 week',
      value: '8'
    }
  ]
}

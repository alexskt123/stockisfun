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

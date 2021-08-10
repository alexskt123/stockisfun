import { BiTrendingUp } from 'react-icons/bi'
import { BiCloud } from 'react-icons/bi'
import { GoCalendar } from 'react-icons/go'
import { RiProfileLine, RiPagesLine } from 'react-icons/ri'

const Settings = {
  Copyright: '© 2021 StockIsFun Limited',
  LogoImgSrc: '/favicon.ico'
}

export default Settings

export const iconConfig = {
  alt: '',
  src: Settings.LogoImgSrc,
  width: '30',
  height: '30',
  className: 'd-inline-block align-top'
}

export const NavDropDown = [
  {
    href: '/compare/price',
    label: 'Price%',
    category: 'All'
  },
  {
    href: '/compare/forecast',
    label: 'Forecast',
    category: 'All'
  },
  {
    href: '/compare/birdmouth',
    label: 'BirdMouth',
    category: 'All'
  },
  {
    href: '/compare/tradingview',
    label: 'TradingView',
    category: 'All'
  },
  {
    href: '/compare/etf',
    label: 'ETF',
    category: 'ETF'
  },
  {
    href: '/compare/aum',
    label: 'AUM',
    category: 'Stock'
  },
  {
    href: '/compare/financials',
    label: 'Financials',
    category: 'Stock'
  }
]

export const NavItems = [
  {
    href: '/stockinfo',
    label: 'Stock'
  },
  {
    href: '/watchlist',
    label: 'Watch List'
  },
  {
    href: '/formula',
    label: 'Formula'
  },
  {
    href: '/calendar',
    label: 'Calendar'
  },
  {
    href: '/trend',
    label: 'Trend'
  }
]

export const defaultUserConfig = {
  id: '',
  uid: '',
  displayName: 'Guest',
  loginTime: '',
  stockList: [],
  watchList: [],
  etfList: [],
  boughtList: []
}

export const staticSWROptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
}

export const stockMarketIndexSWROptions = {
  ...staticSWROptions,
  refreshInterval: 10000
}

export const fetcher = input => fetch(input).then(res => res.json())

export const SWRSticky = {
  backgroundColor: 'white',
  left: 0,
  position: 'sticky',
  zIndex: 997
}

export const loadingSkeletonColors = {
  light: {
    color: '#dbdbdb',
    highlightColor: 'f0f0f0'
  },
  dark: {
    color: '#202020',
    highlightColor: '#444'
  }
}

export const loadingSkeletonTableChart = [{ props: { count: 4 } }]

export const loadingSkeletonPriceParts = [
  { props: { count: 1 } },
  { props: { height: 120 }, separator: 'mt-3' }
]

export const defaultFooterNavElements = [
  {
    label: 'Main',
    href: '/highlight',
    icon: <RiPagesLine />
  },
  {
    label: 'Trend',
    href: '/trend',
    icon: <BiTrendingUp />
  },
  {
    label: 'Trading View',
    href: '/compare/tradingview',
    icon: <BiCloud />
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <RiProfileLine />
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: <GoCalendar />
  }
]

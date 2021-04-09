
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
    href: '/etfdetail',
    label: 'ETF'
  },
  {
    href: '/stockdetail',
    label: 'Stock'
  },
  {
    href: '/watchlist',
    label: 'Watch List'
  },
  {
    href: '/formula',
    label: 'Formula'
  }
]

export const defaultUserConfig = {
  id: '',
  uid: '',
  displayName: 'Guest',
  loginTime: '',
  stockList: [],
  watchList: [],
  etfList: []
}

export const staticSWROptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
}

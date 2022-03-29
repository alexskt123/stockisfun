import {
  forecastTableFirstHeader,
  tableHeaderList as forecastTableHeaderList
} from './forecast'
import BirdMouthWithPriceMA from '@/components/Parts/BirdMouthWithPriceMA'
import CompareSWR from '@/components/Parts/CompareSWR'
import PriceChange from '@/components/Parts/PriceChange'
import TradingViewDeck from '@/components/Parts/TradingViewDeck'
import {
  aumTableHeader,
  tableHeaderList as etfTableHeaderList
} from '@/config/etf'
import { tableHeaderList as financialsTableHeaderList } from '@/config/financials'

export const ComparisonSettings = {
  forecast: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh',
      allowFromList: true,
      showBullets: true
    },
    component: CompareSWR,
    componentProps: {
      inputTickers: [],
      url: '/api/forecast/getStockFairValue',
      customOptions: {
        exportFileName: 'Stock_forecast.csv',
        tableHeader: forecastTableHeaderList,
        tableFirstHeader: forecastTableFirstHeader
      }
    }
  },
  financials: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh',
      allowFromList: true,
      showBullets: true
    },
    component: CompareSWR,
    componentProps: {
      inputTickers: [],
      url: '/api/yahoo/getFinancials',
      customOptions: {
        exportFileName: 'Stock_financials.csv',
        tableHeader: financialsTableHeaderList
      }
    }
  },
  etf: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  voo /  Multiple:  voo,arkk,smh',
      showBullets: true
    },
    component: CompareSWR,
    componentProps: {
      inputTickers: [],
      url: '/api/compare/etf',
      customOptions: {
        exportFileName: 'etf.csv',
        tableHeader: etfTableHeaderList
      }
    }
  },
  aum: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  tsm,gh',
      showBullets: true
    },
    component: CompareSWR,
    componentProps: {
      inputTickers: [],
      url: '/api/compare/aum',
      customOptions: {
        exportFileName: 'Stock_aum_sum.csv',
        tableHeader: aumTableHeader
      }
    }
  },
  price: {
    tickerInputSettings: {
      yearControl: true,
      placeholderText: 'Single:  aapl /  Multiple:  tsm,0700.hk,voo',
      allowFromList: true,
      showBullets: true
    },
    component: PriceChange,
    componentProps: {
      inputTickers: [],
      inputYear: 15
    }
  },
  tradingview: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh',
      allowFromList: true,
      showBullets: false
    },
    component: TradingViewDeck,
    componentProps: {
      inputTickers: []
    }
  },
  birdmouth: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh',
      allowFromList: true,
      showBullets: false
    },
    component: BirdMouthWithPriceMA,
    componentProps: {
      inputTickers: []
    }
  }
}

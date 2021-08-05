import AUMInfo from '@/components/Parts/AUMInfo'
import BirdMouthWithPriceMA from '@/components/Parts/BirdMouthWithPriceMA'
import ETFInfo from '@/components/Parts/ETFInfo'
import FinancialsInfo from '@/components/Parts/FinancialsInfo'
import ForecastInfo from '@/components/Parts/ForecastInfo'
import PriceChange from '@/components/Parts/PriceChange'
import TradingViewDeck from '@/components/Parts/TradingViewDeck'

export const ComparisonSettings = {
  forecast: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh',
      allowFromList: true,
      showBullets: true
    },
    component: ForecastInfo,
    componentProps: {
      inputTickers: [],
      exportFileName: 'Stock_forecast.csv'
    }
  },
  financials: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh',
      allowFromList: true,
      showBullets: true
    },
    component: FinancialsInfo,
    componentProps: {
      inputTickers: [],
      exportFileName: 'Stock_financials.csv'
    }
  },
  etf: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  voo /  Multiple:  voo,arkk,smh',
      showBullets: true
    },
    component: ETFInfo,
    componentProps: {
      inputTickers: [],
      exportFileName: 'etf.csv'
    }
  },
  aum: {
    tickerInputSettings: {
      yearControl: false,
      placeholderText: 'Single:  aapl /  Multiple:  tsm,gh',
      showBullets: true
    },
    component: AUMInfo,
    componentProps: {
      inputTickers: [],
      exportFileName: 'Stock_aum_sum.csv'
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

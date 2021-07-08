import ETFDetails from '@/components/ETFDetails'
import IndexQuote from '@/components/Parts/IndexQuote'
import Price from '@/components/Parts/Price'
import QuoteCard from '@/components/Parts/QuoteCard'
import StockDetails from '@/components/StockDetails'
import { showHighlightQuoteDetail } from '@/lib/commonFunction'

import { SWRSticky } from './settings'

export const extractYahooInfo = [
  {
    label: 'Price',
    field: 'regularMarketPrice'
  },
  {
    label: 'Percentage',
    field: 'regularMarketChangePercent'
  },
  {
    label: 'Change',
    field: 'regularMarketChange'
  }
]

export const stockIndex = [
  { Ticker: '^DJI', Name: 'Dow Jones' },
  { Ticker: '^GSPC', Name: 'S&P 500' },
  { Ticker: '^IXIC', Name: 'NASDAQ' },
  { Ticker: '^VIX', Name: 'Volatility' },
  { Ticker: '^RUT', Name: 'Russell 2000' },
  { Ticker: 'BTC-USD', Name: 'Bitcoin' },
  { Ticker: '^HSI', Name: 'HSI' },
  { Ticker: 'HKD=X', Name: 'USD/HKD' },
  { Ticker: '^FTSE', Name: 'FTSE 100' },
  { Ticker: '^N225', Name: 'NKI' }
]

export const stockFutureIndex = [
  { Ticker: 'YM=F', Name: 'Dow Jones F.' },
  { Ticker: 'ES=F', Name: 'S&P 500 F.' },
  { Ticker: 'NQ=F', Name: 'NASDAQ F.' },
  { Ticker: 'RTY=F', Name: 'Russell 2000 F.' },
  { Ticker: 'BTC=F', Name: 'Bitcoin F.' },
  { Ticker: 'GC=F', Name: 'Gold F.' },
  { Ticker: '^TNX', Name: 'Treasury Yield 10 Yrs' },
  { Ticker: 'CL=F', Name: 'Crude Oil F.' }
]

const showSWRDetail = (input, router) => {
  const inputQuery = {
    ticker: input?.symbol || null,
    type: 'detail'
  }
  showHighlightQuoteDetail(router, inputQuery)
}

export const tableHeaderList = [
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
    label: 'Pre Time',
    item: 'preMarketTime',
    format: 'H:mm:ss',
    show: true
  },
  {
    label: 'Pre Market',
    item: 'preMarketPrice',
    show: true
  },
  {
    label: 'Pre Market%',
    item: 'preMarketChangePercent',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Pre Market Chg',
    item: 'preMarketChange',
    format: 'millify',
    property: 'netChange',
    show: true
  },
  {
    label: 'Market',
    item: 'regularMarketPrice',
    show: true
  },
  {
    label: 'Day Chg%',
    item: 'regularMarketChangePercent',
    format: '%',
    property: 'netChange',
    show: true
  },
  {
    label: 'Day Chg',
    item: 'regularMarketChange',
    format: 'millify',
    property: 'netChange',
    show: true
  },
  {
    label: 'Earnings Date',
    item: 'earningsDate',
    show: true
  }
]

function withQuoteCard(CardComponent) {
  return function QuoteCardComponent({
    header,
    inputTicker,
    isShow,
    ...props
  }) {
    return (
      <QuoteCard header={header} inputTicker={inputTicker} isShow={isShow}>
        <CardComponent inputTicker={inputTicker} {...props} />
      </QuoteCard>
    )
  }
}

export const highlightHeaders = [
  {
    name: 'Price Changes',
    component: withQuoteCard(Price),
    props: {
      inputMA: 'ma'
    }
  },
  {
    name: 'Quote',
    component: withQuoteCard(IndexQuote),
    props: {}
  }
]

export const highlightDetails = [
  {
    type: 'ETF',
    component: ETFDetails
  },
  {
    type: 'EQUITY',
    component: StockDetails
  }
]

export const highlightMenuTickerList = [
  {
    name: 'Stock Market Futures',
    eventKey: 'StockMarketFutureIndex',
    inputList: stockFutureIndex
  },
  {
    name: 'Stock Market Index',
    eventKey: 'StockMarketIndex',
    inputList: stockIndex
  }
]

export const searchBadges = [
  {
    type: 'quote',
    query: { type: 'quote' },
    variant: ['danger', 'warning'],
    label: ['Hide Price/Quote', 'Price/Quote']
  },
  {
    type: 'detail',
    query: { type: 'detail' },
    variant: ['danger', 'success'],
    label: ['Hide Details', 'Details']
  }
]

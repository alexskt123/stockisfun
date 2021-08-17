import Ticker from '@/lib/class/ticker'
import { getQuote } from '@/lib/yahoo/getQuote'

const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
}

// Constructor
export default class Quote extends Ticker {
  constructor(ticker, ...args) {
    super(ticker, ...args)
  }

  get valid() {
    return !!this._res?.symbol
  }

  get type() {
    return this._res?.quoteType
  }

  get ticker() {
    return handleSpecialTicker(this._ticker)
  }

  get quoteData() {
    return this._res
  }

  isValidType(inputType) {
    return this.valid && this.type === inputType
  }

  get isEquity() {
    return this.isValidType('EQUITY')
  }

  get isETF() {
    return this.isValidType('ETF')
  }

  //  real request
  async request() {
    const quote = await getQuote(this._ticker)
    this._res = quote.find(x => x) || {}
  }
}

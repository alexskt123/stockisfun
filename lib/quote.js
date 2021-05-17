import { getYahooQuote } from '../lib/yahoo/getYahooQuote'
import { handleSpecialTicker } from '../lib/commonFunction'

// Constructor
export default class Quote {

  constructor(ticker, ...args) {
    this._ticker = ticker.toUpperCase() || null
    this._rest = { ...args } || null
  }

  get ticker() {
    return handleSpecialTicker(this._ticker)
  }

  get valid() {
    return !!this._res?.symbol
  }

  get type() {
    return this._res?.quoteType
  }

  //  real request
  async request() {
    this._res = await getYahooQuote(this._ticker)
  }
}

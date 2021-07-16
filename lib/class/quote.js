import Ticker from '@/lib/class/ticker'
import { toAxios } from '@/lib/request'
import { handleSpecialTicker } from '@/lib/stockInfo'
import { getQuote } from '@/lib/yahoo/getQuote'

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

  get moduleData() {
    return this._module?.data
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

  async requestModule(moduleName, allowType) {
    await this.request()
    const response =
      this.isEquity || this.isValidType(allowType)
        ? await toAxios(
            `${process.env.YAHOO_QUOTE_SUMMARY}/${this.ticker}?modules=${moduleName}`
          )
        : {}
    this._module = response
  }
}

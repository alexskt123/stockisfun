import { toAxios } from '@/lib/commonFunction'
import { handleSpecialTicker } from '@/lib/stockInfo'
import { getQuote } from '@/lib/yahoo/getQuote'

// Constructor
export default class Quote {
  constructor(ticker, ...args) {
    this._ticker = ticker?.toUpperCase() || null
    this._rest = { ...args } || null
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
    this._res = await getQuote(this._ticker)
  }

  async requestModule(moduleName) {
    await this.request()
    const response = this.isEquity
      ? await toAxios(
          `${process.env.YAHOO_QUOTE_SUMMARY}/${this.ticker}?modules=${moduleName}`
        )
      : {}
    this._module = response
  }
}

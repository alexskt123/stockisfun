import { fixSpecialTicker, handleAxiosError } from '@/lib/commonFunction'
import { getQuote } from '@/lib/yahoo/getQuote'
import to from 'await-to-js'
import axios from 'axios'

// Constructor
export default class Quote {
  constructor(ticker, ...args) {
    this._ticker = ticker.toUpperCase() || null
    this._rest = { ...args } || null
  }

  get valid() {
    return !!this._res?.symbol
  }

  get type() {
    return this._res?.quoteType
  }

  get ticker() {
    return fixSpecialTicker(this._ticker)
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
    const [err, response] = this.isEquity
      ? await to(
          axios(
            `${process.env.YAHOO_QUOTE_SUMMARY}/${this.ticker}?modules=${moduleName}`
          )
        )
      : [null, {}]
    this._module = response

    handleAxiosError(err)
  }
}

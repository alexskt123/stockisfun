import { toAxios } from '@/lib/request'
import { handleSpecialTicker } from '@/lib/stockInfo'
import { getQuote } from '@/lib/yahoo/getQuote'

// Constructor
class Quote {
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

class ModuleQuote extends Quote {
  constructor(...args) {
    super(...args)

    this._allowList = ['ETF', 'EQUITY']
    this._module = { data: [] }
  }

  get moduleData() {
    return {
      ticker: this.ticker,
      modules: this._module.data
    }
  }

  allowModuleRequest(type) {
    return this._allowList.includes(type)
  }

  async requestModule({ name, handleData }) {
    if (!name) return

    const response = this.allowModuleRequest(this.type)
      ? await toAxios(
          `${process.env.YAHOO_QUOTE_SUMMARY}/${this.ticker}?modules=${name}`
        )
      : {}

    const data = handleData ? handleData(response?.data) : response?.data

    this._module.data.push({ name, data })
  }
}

export { Quote, ModuleQuote }

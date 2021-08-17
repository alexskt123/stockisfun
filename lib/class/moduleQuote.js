import Quote from '@/lib/class/quote'
import { toAxios } from '@/lib/request'

export default class ModuleQuote extends Quote {
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

  async requestModule(name, handleData = null) {
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

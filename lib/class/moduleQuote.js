import { moduleMapping } from '@/config/yahooChart'
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

  dataByName(n) {
    return this._module?.data?.find(x => x.name === moduleMapping[n].name)?.data
  }

  allowModuleRequest(type) {
    return this._allowList.includes(type)
  }

  async requestModule(n) {
    if (!n) return

    const module = moduleMapping[n] || {}
    const { name, handleData } = module

    const response = this.allowModuleRequest(this.type)
      ? await toAxios(
          `${process.env.YAHOO_QUOTE_SUMMARY}/${this.ticker}?modules=${name}`
        )
      : {}

    const data = handleData ? handleData(response?.data) : response?.data

    this._module.data.push({ name, data })
  }
}

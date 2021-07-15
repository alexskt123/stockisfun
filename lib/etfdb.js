import { toAxios } from '@/lib/request'
import Ticker from '@/lib/ticker'

// Constructor
export default class ETFDb extends Ticker {
  constructor(ticker, type, ...args) {
    super(ticker, ...args)
    this._type = type
  }

  get etfDbResponse() {
    return this._res
  }

  async request() {
    const etfDbResponse = await toAxios(
      `https://etfdb.com/${this._type}/${this._ticker}/`
    )
    this._res = etfDbResponse?.data
  }
}

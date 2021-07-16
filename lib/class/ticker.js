import { handleSpecialTicker } from '@/lib/stockInfo'

// Constructor
export default class Ticker {
  constructor(ticker, ...args) {
    this._ticker = handleSpecialTicker(ticker?.toUpperCase()) || null
    this._rest = { ...args } || null
  }
}

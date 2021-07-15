// Constructor
export default class Ticker {
  constructor(ticker, ...args) {
    this._ticker = ticker?.toUpperCase() || null
    this._rest = { ...args } || null
  }
}

const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
}

// Constructor
export default class Ticker {
  constructor(ticker, ...args) {
    this._ticker = handleSpecialTicker(ticker?.toUpperCase()) || null
    this._rest = { ...args } || null
  }
}

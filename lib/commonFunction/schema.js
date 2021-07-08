const priceSettingSchema = {
  tickers: [],
  quote: [],
  tableHeader: [],
  yearlyPcnt: [],
  chartData: {},
  ascSort: false
}

const forecastSettingSchema = {
  tickers: [],
  tableHeader: [],
  stockInfo: [],
  ascSort: false
}

const financialsSettingSchema = {
  tickers: [],
  tableHeader: [],
  stockInfo: [],
  ascSort: false
}

module.exports = {
  priceSettingSchema,
  forecastSettingSchema,
  financialsSettingSchema
}

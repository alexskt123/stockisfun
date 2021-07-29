import percent from 'percent'

const calPcnt = (numerator, denominator, decimal, pcntSign) => {
  return percent.calc(numerator, denominator, decimal, pcntSign)
}

const trim = input => {
  return (input || '').replace(/[^a-zA-Z ]/g, '')
}

const parseBoolean = boo => {
  try {
    return JSON.parse(boo)
  } catch {
    return false
  }
}

const descendingArrSort = function (a, b, field) {
  return b[field] - a[field]
}

const getRevenueIndicator = annualizedPcnt => {
  const indicator =
    annualizedPcnt > 0.2
      ? 'High Growth'
      : annualizedPcnt > 0.1 && annualizedPcnt <= 0.2
      ? 'Growth'
      : annualizedPcnt > 0 && annualizedPcnt <= 0.1
      ? 'Stable'
      : annualizedPcnt < 0
      ? 'Careful'
      : 'N/A'
  return indicator
}

const cloneObj = obj => {
  return JSON.parse(JSON.stringify(obj))
}

const getUserTickerList = list => {
  return list.map(x => (x.hasOwnProperty('ticker') ? x.ticker : x))
}

export {
  calPcnt,
  trim,
  parseBoolean,
  descendingArrSort,
  getRevenueIndicator,
  cloneObj,
  getUserTickerList
}

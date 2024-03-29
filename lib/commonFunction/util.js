import percent from 'percent'

const calPcnt = (numerator, denominator, decimal, pcntSign) => {
  return percent.calc(numerator, denominator, decimal, pcntSign)
}

const calRelativeStrength = (
  tickerOldPrice,
  tickerNewPrice,
  refOldPrice,
  refNewPRice,
  rsDays
) => {
  const tickerStrength = tickerNewPrice / tickerOldPrice / rsDays
  const spxStrength = refNewPRice / refOldPrice / rsDays
  const rsValue = tickerStrength / spxStrength - 1

  return rsValue
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

const arrFindByIdx = (inputArr, idx) => {
  return inputArr?.find((_x, i) => i === idx)
}

const hasProperties = (item, properties) => {
  return properties.every(p => item?.hasOwnProperty(p))
}

const getUserTickerList = (userData, list) => {
  const listArr = list || []
  const userDataObj = userData || {}
  const userStockList = listArr.reduce(
    (a, c) =>
      (userDataObj.hasOwnProperty(c) && [...a, ...userDataObj[c]]) || [...a],
    []
  )
  return [
    ...new Set(
      userStockList.map(x => (x.hasOwnProperty('ticker') && x.ticker) || x)
    )
  ]
}

const sortUniqCommaStr = input => {
  return [...new Set(input.split(','))]
    .filter(x => x !== '')
    .sort()
    .join(',')
}

export {
  calPcnt,
  calRelativeStrength,
  trim,
  parseBoolean,
  descendingArrSort,
  getRevenueIndicator,
  cloneObj,
  hasProperties,
  getUserTickerList,
  arrFindByIdx,
  sortUniqCommaStr
}

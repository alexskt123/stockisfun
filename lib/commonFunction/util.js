import percent from 'percent'

const calPcnt = (numerator, denominator, decimal, pcntSign) => {
  return percent.calc(numerator, denominator, decimal, pcntSign)
}

const trim = input => {
  return input.replace(/[^a-zA-Z ]/g, '')
}

const parseBoolean = boo => {
  try {
    return JSON.parse(boo)
  } catch {
    return false
  }
}

const decendingArrSort = function (a, b, field) {
  return b[field] - a[field]
}

module.exports = {
  calPcnt,
  trim,
  parseBoolean,
  decendingArrSort
}

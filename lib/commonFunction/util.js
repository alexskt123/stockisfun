import Papa from 'papaparse'
import percent from 'percent'

const calPcnt = (numerator, denominator, decimal, pcntSign) => {
  return percent.calc(numerator, denominator, decimal, pcntSign)
}

const getCSVContent = (tableHeader, tableData) => {
  const nowDate = new Date()
  const tableArr = Papa.unparse([
    [
      'Date',
      `${nowDate.getDate()}-${nowDate.getMonth() + 1}-${nowDate.getFullYear()}`
    ],
    [''],
    ...[tableHeader],
    ...tableData.map(itemArr =>
      itemArr.map(item => (item && item.data ? item.data : item))
    )
  ])

  return tableArr
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

const handleAxiosError = err => {
  if (err) {
    console.error(err)
  }
}

module.exports = {
  getCSVContent,
  calPcnt,
  trim,
  parseBoolean,
  decendingArrSort,
  handleAxiosError
}

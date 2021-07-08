import Papa from 'papaparse'

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

const concatCommaLists = strArr => {
  return strArr
    .reduce((acc, item) => {
      const newAcc = [...acc, ...(item || '').toUpperCase().split(',')]
      return newAcc
    }, [])
    .filter((value, idx, self) => value !== '' && self.indexOf(value) === idx)
    .join(',')
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
  trim,
  parseBoolean,
  concatCommaLists,
  decendingArrSort,
  handleAxiosError
}

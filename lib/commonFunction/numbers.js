import numeral from 'numeral'

const convertToPercentage = (input, noSign) => {
  return numeral(input).format(`${(noSign && '') || '+'}0.00%`)
}

const convertToPercentageNoSign = input => {
  return numeral(input).format(`0.00%`)
}

const convertToPriceChange = input => {
  return numeral(input).format('+0,0.00')
}

const convertToPrice = input => {
  return numeral(input).format('0,0.00')
}

const convertFromPriceToNumber = input => {
  return numeral(input).format('0.00')
}

const convertToNumber = inputArr => {
  const newArr = inputArr.map(curArr => {
    return curArr.map(cur => {
      return `${numeral(`${cur}`.toLowerCase()).value()}`
    })
  })

  return newArr
}

const millify = number => {
  return numeral(number).format('0.00a').toUpperCase()
}

const roundTo = number => {
  return numeral(number).format('0,0.00')
}

const toInteger = number => {
  return numeral(number).format('0')
}

const toNumber = number => {
  return numeral(number).value()
}

const getAnnualizedPcnt = item => {
  const totalPcnt = item
    .filter(x => x !== 'N/A')
    .reduce((acc, data) => {
      acc = acc * (parseFloat(data) / 100 + 1)
      return acc
    }, 1)

  const multiplier = Math.abs(totalPcnt) !== totalPcnt ? -1 : 1
  const annualized =
    multiplier *
      Math.pow(Math.abs(totalPcnt), 1 / item.filter(x => x !== 'N/A').length) -
    1

  const diffPcnt = {
    raw: annualized,
    fmt: convertToPercentage(annualized)
  }
  return diffPcnt
}

export {
  convertToPercentage,
  convertToPercentageNoSign,
  convertToPriceChange,
  convertToPrice,
  convertFromPriceToNumber,
  convertToNumber,
  millify,
  roundTo,
  toInteger,
  getAnnualizedPcnt,
  toNumber
}

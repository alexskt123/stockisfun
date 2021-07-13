import numeral from 'numeral'

const convertToPercentage = (input, noSign) => {
  return numeral(input).format(`${noSign ? '' : '+'}0.00%`)
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

export {
  convertToPercentage,
  convertToPriceChange,
  convertToPrice,
  convertFromPriceToNumber,
  convertToNumber,
  millify,
  roundTo,
  toInteger
}

import stringHash from 'string-hash'

const randomColor = require('randomcolor')

const getRedColor = darkMode => {
  return darkMode ? '#ff2121' : 'red'
}

const getGreenColor = darkMode => {
  return darkMode ? '#34eb55' : 'green'
}

const getDefaultColor = darkMode => {
  return darkMode ? 'white' : 'black'
}

const randBackgroundColor = () => {
  return randomColor({
    luminosity: 'dark'
  })
}

const getVariant = (value, up, constant, down) => {
  return value > 0 ? up : value === 0 ? constant : down
}

const randVariant = (value, exclude) => {
  const hash = stringHash(value || '')
  const variants = [
    'dark',
    'light',
    'primary',
    'secondary',
    'warning',
    'info',
    'danger',
    'success'
  ]

  const newVariants = exclude
    ? variants.reduce((acc, item) => {
        return exclude.includes(item) ? [...acc] : [...acc, item]
      }, [])
    : variants

  return newVariants[hash % newVariants.length]
}

const indicatorVariant = value => {
  const pairs = [
    { value: 'Careful', variant: 'danger' },
    { value: 'Stable', variant: 'secondary' },
    { value: 'Growth', variant: 'info' },
    { value: 'High Growth', variant: 'success' }
  ]

  const target = pairs.find(x => x.value === value)
  const variant = target ? target.variant : 'light'

  return variant
}

const randRGBColor = () => {
  //return [...Array(3)].map(_item => Math.floor(Math.random() * 255) + 1)
  return randomColor({
    luminosity: 'dark',
    format: 'rgbArray'
  })
}

export {
  getRedColor,
  getGreenColor,
  getDefaultColor,
  randBackgroundColor,
  getVariant,
  randVariant,
  indicatorVariant,
  randRGBColor
}

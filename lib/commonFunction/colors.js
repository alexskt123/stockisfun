import convert from 'color-convert'
import rcolor from 'rcolor'
import stringHash from 'string-hash'

const getRedColor = darkMode => {
  return darkMode ? '#ff2121' : 'red'
}

const getGreenColor = darkMode => {
  return darkMode ? '#34eb55' : 'green'
}

const getDefaultColor = darkMode => {
  return darkMode ? 'white' : 'black'
}

const randColor = () => {
  return rcolor({ value: 0.6 })
}

const randBackgroundColor = () => {
  return randColor()
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
        return exclude.includes(item) ? acc : [...acc, item]
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
  const variant = target?.variant || 'light'

  return variant
}

const randRGBColor = () => {
  return convert.hex.rgb(randColor())
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

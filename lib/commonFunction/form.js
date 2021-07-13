import { debounce } from 'debounce'

const sortTableItem = async (tableItemArr, checkIndex, ascSort) => {
  return [...tableItemArr].sort(function (a, b) {
    const bf = (
      typeof a[checkIndex] === 'object' && a[checkIndex].data
        ? a[checkIndex].data
        : a[checkIndex] || ''
    )
      .toString()
      .replace(/\+|%/gi, '')
    const af = (
      typeof b[checkIndex] === 'object' && b[checkIndex].data
        ? b[checkIndex].data
        : b[checkIndex] || ''
    )
      .toString()
      .replace(/\+|%/gi, '')

    if (isNaN(bf)) return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)
    else return ascSort ? bf - af : af - bf
  })
}

const handleDebounceChange = (e, formValue, setFormValue) => {
  const form = {
    ...formValue,
    [e.target.name]: e.target.value
  }
  const formChange = setFormValue(form)
  debounce(formChange, 300)
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

const handleFormSubmit = (
  event,
  formValue,
  { query, year },
  router,
  setValidated
) => {
  event.preventDefault()
  const form = event.currentTarget

  if (form.checkValidity() === false) {
    event.stopPropagation()
  } else {
    const { formTicker, formYear } = formValue
    const list = concatCommaLists([query, formTicker])
    const queryYear = year
      ? `&year=${year}`
      : formYear
      ? `&year=${formYear}`
      : ''
    router.push(`${router.pathname}?query=${list}${queryYear}`)
  }

  setValidated(true)
}

export { sortTableItem, handleDebounceChange, handleFormSubmit }

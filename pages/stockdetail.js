
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import StockDetails from '../components/StockDetails'
import { handleDebounceChange } from '../lib/commonFunction'
import SearchAccordion from '../components/Page/SearchAccordion'

export default function StockDetail() {

  const [ticker, setTicker] = useState('')
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({ formTicker: '' })
  const [clicked, setClicked] = useState(false)

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      setTicker(query)
    }
  }, [query])

  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setClicked(true)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const { formTicker } = formValue
      router.replace('/stockdetail', `/stockdetail?query=${formTicker.toUpperCase()}`)
      setTicker(formTicker)
    }
    setValidated(true)
    setClicked(false)
  }

  const clearItems = async () => {
    setTicker('')
    setFormValue({ formTicker: '' })
    router.replace('/stockdetail')
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <SearchAccordion inputTicker={ticker}>
            <TickerInput
              validated={validated}
              handleSubmit={handleSubmit}
              placeholderText={'i.e. aapl'}
              handleChange={handleChange}
              formTicker={formValue.formTicker}
              clicked={clicked}
              clearItems={clearItems}
            />
          </SearchAccordion>
          <StockDetails inputTicker={ticker} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}

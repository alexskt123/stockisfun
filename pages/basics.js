
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import StockDetails from '../components/StockDetails';

export default function Home() {

  const [ticker, setTicker] = useState([])
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setClicked(true)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const { formTicker } = formValue
      setTicker(formTicker)
    }
    setValidated(true)
    setClicked(false)
  }

  const clearItems = async () => {
    setTicker('')
  }

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      setTicker(query)
    }
  }, [query])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={"i.e. appl"}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
          />
          <StockDetails inputTicker={ticker} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}

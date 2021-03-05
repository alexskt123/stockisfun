
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import StockDetails from '../components/StockDetails'
import { handleDebounceChange } from '../lib/commonFunction'
import Badge from 'react-bootstrap/Badge'

export default function Home() {

  const [ticker, setTicker] = useState('')
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

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
    router.replace('/stockdetail')
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
          <Accordion>
            <Card style={{ backgroundColor: '#dbffde' }}>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <b>
                  <Badge variant="dark">{ticker == '' ? 'Click here to Search!' : ticker.toUpperCase()}</Badge>
                </b>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <TickerInput
                    validated={validated}
                    handleSubmit={handleSubmit}
                    placeholderText={'i.e. appl'}
                    handleChange={handleChange}
                    clicked={clicked}
                    clearItems={clearItems}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <StockDetails inputTicker={ticker} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
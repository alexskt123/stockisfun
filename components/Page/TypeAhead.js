
import { Fragment, useState, useRef } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { buttonSettings } from '../../config/form'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import LoadingSpinner from '../Loading/LoadingSpinner'

function TypeAhead({ placeholderText, handleChange, clearItems, ticker}) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])
  //const [searchValue, setSearchValue] = useState('')
  const ref = useRef()

  // useEffect(() => {
  //   setSearchValue(ticker)
  // }, [])

  const handleSearch = (query) => {
    setIsLoading(true)

    fetch(`/api/yahoo/getTickerSuggestions?query=${query}`)
      .then((resp) => resp.json())
      .then((items) => {
        setOptions(items)
        setIsLoading(false)
      })
  }

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true

  return (
    <Fragment>
      <Form noValidate>
        <Form.Group controlId="exampleForm.ControlInput1">
          <AsyncTypeahead
            type="formTicker"
            name="formTicker"
            placeholder={placeholderText}
            onChange={(e) => {               
              ref.current.blur()
              ref.current.clear()
              handleChange(e)
            }}
            ref={ref}
            filterBy={filterBy}
            id="sevenHead"
            isLoading={isLoading}
            labelKey="symbol"
            minLength={1}
            onSearch={handleSearch}
            options={options}
            positionFixed={true}
            searchText={<LoadingSpinner/>}
            //selected={[searchValue]}
            renderMenuItemChildren={(option) => (
              <Fragment>
                <Row>
                  <Col xs={2} md={3} lg={3}>
                    <Badge variant="dark">{option.symbol}</Badge>
                  </Col>
                  <Col xs={4} md={6} lg={9}>
                    <Badge variant="light" className="ml-1">{option.name}</Badge>
                  </Col>
                </Row>
              </Fragment>
            )}
          />
          {/* <Form.Control required type="formTicker" name="formTicker" value={formTicker} placeholder={placeholderText} onChange={(e) => handleChange(e)} /> */}
        </Form.Group>
        <Row className="mt-2">
          <Button {...buttonSettings.ClearAll.attr} onClick={() => { clearItems() }}>
            {buttonSettings.ClearAll.label}
          </Button>
        </Row>
      </Form>
    </Fragment>
  )
}

export default TypeAhead

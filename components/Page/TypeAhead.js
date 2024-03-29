import { Fragment, useState, useRef, useEffect } from 'react'

import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import useSWR from 'swr'

import { buttonSettings } from '@/config/form'
import { fetcher } from '@/config/settings'

import 'react-bootstrap-typeahead/css/Typeahead.css'

function TypeAhead({ placeholderText, handleChange, clearItems, filter }) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])
  const ref = useRef()

  const [query, setQuery] = useState(null)

  const { data } = useSWR(query, fetcher)

  useEffect(() => {
    const loading = !!(query && !data)
    setOptions(data)
    setIsLoading(loading)
  }, [data, query])

  const handleSearch = ticker => {
    setQuery(`/api/yahoo/getTickerSuggestions?query=${ticker}&filter=${filter}`)
  }

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true

  return (
    <Fragment>
      <Form noValidate>
        <Form.Group controlId="exampleForm.ControlInput1">
          <AsyncTypeahead
            className="shadow rounded"
            type="formTicker"
            name="formTicker"
            allowNew={true}
            newSelectionPrefix={''}
            placeholder={placeholderText}
            onChange={e => {
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
            renderMenuItemChildren={option => (
              <Fragment>
                <Row>
                  <Col xs={2} md={3} lg={3}>
                    <Badge bg="dark">{option.symbol}</Badge>
                  </Col>
                  <Col xs={4} md={6} lg={9}>
                    <Badge bg="light" text="dark" className="ms-1">
                      {option.name}
                    </Badge>
                  </Col>
                </Row>
              </Fragment>
            )}
          />
        </Form.Group>
        {clearItems && (
          <Row className="mt-2">
            <Button
              {...buttonSettings.ClearAll.attr}
              onClick={() => {
                clearItems()
              }}
            >
              {buttonSettings.ClearAll.label}
            </Button>
          </Row>
        )}
      </Form>
    </Fragment>
  )
}

export default TypeAhead

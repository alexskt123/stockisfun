
import { Fragment, useState, useRef } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import FileSaver from 'file-saver'
import { getCSVContent } from '../../lib/commonFunction'
import { priceChangeDateRangeSelectAttr, buttonSettings } from '../../config/form'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'

const exportToFile = (tableHeader, tableData, exportFileName) => {
  if (tableHeader && tableData) {
    const blob = new Blob([getCSVContent(tableHeader, tableData)], { type: 'text/csv;charset=utf-8;' })
    FileSaver.saveAs(blob, exportFileName)
  }
}

function TypeAhead({ validated, handleSubmit, placeholderText, handleChange, formTicker, clicked, clearItems, tableHeader, tableData, exportFileName, yearControl }) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])
  const ref = useRef()

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
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlInput1" style={{ position: 'relative' }}>
          <AsyncTypeahead
            type="formTicker"
            name="formTicker"
            placeholder={placeholderText}
            onChange={(e) => {
              ref.current.blur()
              handleChange(e)
            }}
            ref={ref}
            value={formTicker}
            filterBy={filterBy}
            id="sevenHead"
            isLoading={isLoading}
            labelKey="symbol"
            minLength={1}
            onSearch={handleSearch}
            options={options}
            positionFixed={true}
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
        {
          yearControl ?
            <Fragment>
              <div style={{ display: 'inline-flex', alignItems: 'baseline' }} className="ml-1">
                <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                  <h5>
                    <Badge variant="dark">
                      <span>
                        {'No. of Years'}
                      </span>
                    </Badge>
                  </h5>
                </Form.Label>
                <Form.Control
                  {...priceChangeDateRangeSelectAttr.formControl}
                  custom
                  onChange={(e) => handleChange(e)}
                >
                  {
                    priceChangeDateRangeSelectAttr.dateRangeOptions.map((item, index) => {
                      return <option key={`${item}${index}`} value={item.value}>{item.label}</option>
                    })
                  }
                </Form.Control>
              </div>
            </Fragment>
            : null
        }
        <Row className="ml-1 mt-2">
          <Button {...buttonSettings.Go.attr} disabled={clicked}>
            {buttonSettings.Go.label}
          </Button>
          <Button {...buttonSettings.ClearAll.attr} onClick={() => { clearItems() }} disabled={clicked}>
            {buttonSettings.ClearAll.label}
          </Button>
          {
            tableHeader && tableData ?
              <Fragment>
                <Button {...buttonSettings.Export.attr} onClick={() => { exportToFile(tableHeader, tableData, exportFileName) }} disabled={clicked}>
                  {buttonSettings.Export.label}
                </Button>
              </Fragment>
              : null
          }
        </Row>
      </Form>
    </Fragment>
  )
}

export default TypeAhead

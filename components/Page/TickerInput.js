import { Fragment } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { exportToFile } from '../../lib/exportToFile'
import { useUser, useUserData } from '../../lib/firebaseResult'
import {
  priceChangeDateRangeSelectAttr,
  buttonSettings
} from '../../config/form'

function TickerInput({
  validated,
  handleSubmit,
  placeholderText,
  handleChange,
  formTicker,
  clicked,
  clearItems,
  tableHeader,
  tableData,
  exportFileName,
  yearControl,
  handleTickers
}) {
  const user = useUser()
  const userData = useUserData(user)

  return (
    <Fragment>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Control
            required
            type="formTicker"
            name="formTicker"
            value={formTicker}
            placeholder={placeholderText}
            onChange={e => handleChange(e)}
          />
        </Form.Group>
        {yearControl ? (
          <Fragment>
            <div
              style={{ display: 'inline-flex', alignItems: 'baseline' }}
              className="ml-1"
            >
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref"
              >
                <h5>
                  <Badge variant="dark">
                    <span>{'No. of Years'}</span>
                  </Badge>
                </h5>
              </Form.Label>
              <Form.Control
                {...priceChangeDateRangeSelectAttr.formControl}
                custom
                onChange={e => handleChange(e)}
              >
                {priceChangeDateRangeSelectAttr.dateRangeOptions.map(
                  (item, index) => {
                    return (
                      <option key={`${item}${index}`} value={item.value}>
                        {item.label}
                      </option>
                    )
                  }
                )}
              </Form.Control>
            </div>
          </Fragment>
        ) : null}
        <div>
          <Button {...buttonSettings.Go.attr} disabled={clicked}>
            {buttonSettings.Go.label}
          </Button>
          <Button
            {...buttonSettings.ClearAll.attr}
            onClick={() => {
              clearItems()
            }}
            disabled={clicked}
          >
            {buttonSettings.ClearAll.label}
          </Button>
          {tableHeader && tableData ? (
            <Fragment>
              <Button
                {...buttonSettings.Export.attr}
                onClick={() => {
                  exportToFile(tableHeader, tableData, exportFileName)
                }}
                disabled={clicked}
              >
                {buttonSettings.Export.label}
              </Button>
            </Fragment>
          ) : null}
          {handleTickers && userData.watchList ? (
            <Button
              {...buttonSettings.FromWatchList.attr}
              disabled={clicked}
              onClick={() => handleTickers(userData.watchList)}
            >
              {buttonSettings.FromWatchList.label}
            </Button>
          ) : null}
        </div>
      </Form>
    </Fragment>
  )
}

export default TickerInput

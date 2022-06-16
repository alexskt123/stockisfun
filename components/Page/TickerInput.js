import { Fragment } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import FormOptions from '@/components/Form/FormOptions'
import {
  priceChangeDateRangeSelectAttr,
  buttonSettings,
  userListSelectAttr
} from '@/config/form'
import { exportToFile, getUserTickerList } from '@/lib/commonFunction'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'

function TickerInput({
  validated,
  handleSubmit,
  placeholderText,
  handleChange,
  formValue,
  clicked,
  clearItems,
  tableHeader,
  tableData,
  exportFileName,
  yearControl,
  handleTickers
}) {
  const user = usePersistedUser()
  const userData = useUserData(user)

  return (
    <Fragment>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Control
            required
            type="tickers"
            name="tickers"
            value={formValue?.tickers || ''}
            placeholder={placeholderText}
            onChange={e => handleChange(e)}
          />
        </Form.Group>
        {yearControl && (
          <Fragment>
            <div
              style={{ display: 'inline-flex', alignItems: 'baseline' }}
              className="ms-1"
            >
              <FormOptions
                formOptionSettings={priceChangeDateRangeSelectAttr}
                value={formValue?.year || 15}
                handleChange={handleChange}
                label={'No. of Years'}
              />
            </div>
          </Fragment>
        )}
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
          {tableHeader && tableData && (
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
          )}
          {handleTickers && user && userData && (
            <FormOptions
              formOptionSettings={userListSelectAttr}
              handleChange={e => {
                const value = e?.target?.value
                const targetList = getUserTickerList(userData, value.split(','))
                handleTickers(targetList)
              }}
            />
          )}
        </div>
      </Form>
    </Fragment>
  )
}

export default TickerInput

import { Fragment } from 'react'

import FormOptions from '@/components/Form/FormOptions'
import {
  priceChangeDateRangeSelectAttr,
  buttonSettings,
  userListSelectAttr
} from '@/config/form'
import { exportToFile, getUserTickerList } from '@/lib/commonFunction'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

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
  const user = usePersistedUser()
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
        {yearControl && (
          <Fragment>
            <div
              style={{ display: 'inline-flex', alignItems: 'baseline' }}
              className="ml-1"
            >
              <FormOptions
                formOptionSettings={priceChangeDateRangeSelectAttr}
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
                const targetList = getUserTickerList(
                  userData,
                  userListSelectAttr.options.find(x => x.value === value).list
                )
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

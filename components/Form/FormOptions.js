import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'

const FormOptions = ({ formOptionSettings, value, handleChange, label }) => {
  return (
    <Fragment>
      {label && (
        <Form.Label className="my-1 mr-2">
          <h5>
            <Badge variant="dark">
              <span>{label}</span>
            </Badge>
          </h5>
        </Form.Label>
      )}
      <Form.Control
        {...formOptionSettings.formControl}
        value={value}
        custom
        onChange={e => handleChange(e)}
      >
        {formOptionSettings.options.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </Form.Control>
    </Fragment>
  )
}

export default FormOptions

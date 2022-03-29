import { Fragment } from 'react'

import Form from 'react-bootstrap/Form'

import HeaderBadge from '@/components/Parts/HeaderBadge'

const FormOptions = ({ formOptionSettings, value, handleChange, label }) => {
  return (
    <Fragment>
      {label && (
        <Form.Label className="my-1 mr-2">
          <HeaderBadge
            headerTag={'h5'}
            title={label}
            badgeProps={{ variant: 'dark' }}
          />
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

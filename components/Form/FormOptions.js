import Form from 'react-bootstrap/Form'

const FormOptions = ({ formOptionSettings, value, handleChange }) => {
  return (
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
  )
}

export default FormOptions

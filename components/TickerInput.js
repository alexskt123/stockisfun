
import { Fragment } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function TickerInput({ validated, handleSubmit, placeholderText, handleChange, clicked, clearItems }) {
    return (
        <Fragment>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control required type="formTicker" name="formTicker" placeholder={placeholderText} onKeyUp={(e) => handleChange(e)} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={clicked}>
                    {'Go'}
                </Button>
                <Button className="ml-3" variant="danger" onClick={() => { clearItems() }} disabled={clicked}>
                    {'Clear All'}
                </Button>
            </Form>
        </Fragment>
    )
}

export default TickerInput

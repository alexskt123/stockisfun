
import { Fragment } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FileSaver from 'file-saver'
import Papa from 'papaparse'

const exportToFile = (tableHeader, tableData, exportFileName) => {
    if (tableHeader && tableData) {
        const nowDate = new Date()        
        const tableArr = Papa.unparse([['Date',`${nowDate.getDate()}-${nowDate.getMonth() + 1}-${nowDate.getFullYear()}`],[''],tableHeader, ...tableData])
        const blob = new Blob([tableArr], { type: "application/json" });
        FileSaver.saveAs(blob, exportFileName);
    }
}

function TickerInput({ validated, handleSubmit, placeholderText, handleChange, clicked, clearItems, tableHeader, tableData, exportFileName }) {
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
                <Button className="ml-3" variant="info" onClick={() => { exportToFile(tableHeader, tableData, exportFileName) }}  disabled={clicked}>
                    Export
                </Button>
            </Form>
        </Fragment>
    )
}

export default TickerInput

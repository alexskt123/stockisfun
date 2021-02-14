
import { Fragment } from 'react'

import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import FileSaver from 'file-saver'
import Papa from 'papaparse'

const exportToFile = (tableHeader, tableData, exportFileName) => {
    if (tableHeader && tableData) {
        const nowDate = new Date()
        const tableArr = Papa.unparse([['Date', `${nowDate.getDate()}-${nowDate.getMonth() + 1}-${nowDate.getFullYear()}`], [''], tableHeader, ...tableData])
        const blob = new Blob([tableArr], { type: "application/json" });
        FileSaver.saveAs(blob, exportFileName);
    }
}

function TickerInput({ validated, handleSubmit, placeholderText, handleChange, clicked, clearItems, tableHeader, tableData, exportFileName, yearControl }) {
    return (
        <Fragment>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control required type="formTicker" name="formTicker" placeholder={placeholderText} onKeyUp={(e) => handleChange(e)} />
                </Form.Group>
                {
                    yearControl ?
                        <Fragment>
                            <div style={{ display: 'inline-flex', alignItems: 'baseline' }} className="ml-1">
                                <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                                    <h4>
                                        <Badge variant="dark">
                                            <span>
                                                {'No. of Years'}
                                            </span>
                                        </Badge>
                                    </h4>
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="my-1 mr-sm-2"
                                    name="formYear"
                                    custom
                                    onMouseLeave={(e) => handleChange(e)}
                                >
                                    <option value="15">15 years</option>
                                    <option value="25">25 years</option>
                                    <option value="20">20 years</option>
                                    <option value="10">10 years</option>
                                    <option value="5">5 years</option>
                                    <option value="3">3 years</option>
                                </Form.Control>
                            </div>
                        </Fragment>
                        : ''
                }
                <Row className="ml-1 mt-3">
                    <Button variant="primary" type="submit" disabled={clicked}>
                        {'Go'}
                    </Button>
                    <Button className="ml-3" variant="danger" onClick={() => { clearItems() }} disabled={clicked}>
                        {'Clear All'}
                    </Button>
                    <Button className="ml-3" variant="info" onClick={() => { exportToFile(tableHeader, tableData, exportFileName) }} disabled={clicked}>
                        Export
                    </Button>
                </Row>
            </Form>
        </Fragment>
    )
}

export default TickerInput


import { Fragment } from 'react'

import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import FileSaver from 'file-saver'
import { getCSVContent } from '../../lib/commonFunction'
import { priceChangeDateRangeSelectAttr, buttonSettings } from '../../config/form'

const exportToFile = (tableHeader, tableData, exportFileName) => {
    if (tableHeader && tableData) {
        const blob = new Blob([getCSVContent(tableHeader, tableData)], { type: "application/json" });
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
                                        priceChangeDateRangeSelectAttr.dateRangeOptions.map(item => {
                                            return <option value={item.value}>{item.label}</option>
                                        })
                                    }
                                </Form.Control>
                            </div>
                        </Fragment>
                        : ''
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
                            : ''
                    }

                </Row>
            </Form>
        </Fragment>
    )
}

export default TickerInput

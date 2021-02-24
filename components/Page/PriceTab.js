
import { Fragment, useState, useEffect } from 'react'
import Price from '../../components/Price'
import { Badge, Row } from 'react-bootstrap'

function PriceTab({ inputSettings }) {

    const [settings, setSettings] = useState({ ...inputSettings })

    useEffect(() => {
        setSettings(inputSettings)
    }, [inputSettings])

    return (
        <Fragment>
            <Row className="ml-1 mt-1">
                <h6>
                    <Badge variant="dark">{'Name: '}</Badge>
                </h6>
                <h6>
                    <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == 'Name').find(x => x) || [])[1]}</Badge>
                </h6>
            </Row>
            <Row className="ml-1">
                <h6>
                    <Badge variant="dark">{'Price: '}</Badge>
                </h6>
                <h6>
                    <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x) || [])[1]}</Badge>
                </h6>
                <h6>
                    <Badge className="ml-3" variant="dark">{'52W-L-H: '}</Badge>
                </h6>
                <h6>
                    <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == '52W-Low-High').find(x => x) || [])[1]}</Badge>
                </h6>
            </Row>
            <Row className="ml-1">
                <h6>
                    <Badge variant="dark">{'Floating Shares: '}</Badge>
                </h6>
                <h6>
                    <Badge variant="light" className="ml-2">{settings.floatingShareRatio}</Badge>
                </h6>
                <h6>
                    <Badge variant="dark" className="ml-2">{'Market Cap.: '}</Badge>
                </h6>
                <h6>
                    <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == 'Market Cap.').find(x => x) || [])[1]}</Badge>
                </h6>
            </Row>
            <Row className="ml-1">
                <h6>
                    <Badge variant="dark">{'Industry: '}</Badge>
                </h6>
                <h6>
                    <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == 'Industry').find(x => x) || [])[1]}</Badge>
                </h6>
            </Row>
            <Price inputTicker={settings.inputTickers.find(x => x)} />

        </Fragment>
    )
}

export default PriceTab

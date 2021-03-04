
import { Fragment, useState, useEffect } from 'react'
import { Alert, Button, Row } from 'react-bootstrap'
import { Doughnut } from 'react-chartjs-2'

import { sortTableItem } from '../../../lib/commonFunction'
import StockInfoTable from '../../../components/Page/StockInfoTable'
import { etfDetailsSettings } from '../../../config/etf'

export default function Holdings({ inputSettings, cellClick }) {
    const [allowCheck, setAllowCheck] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [ascSort, setAscSort] = useState(false)
    const [settings, setSettings] = useState({ ...etfDetailsSettings })

    const sortItem = async (index) => {
        setSettings({
            ...settings,
            holding: { ...settings.holding, tableData: await sortTableItem(settings.holding.tableData, index, ascSort) }
        })
        setAscSort(!ascSort)
    }

    async function handleTicker(inputSettings) {
        setAllowCheck(settings.priceHref != '/' ? true : false)
        setSettings(inputSettings)
    }

    useEffect(() => {
        handleTicker(inputSettings)
    }, [inputSettings])

    return (
        <Fragment>
            <Row className="mt-3 ml-1">
                {!showAlert && <Button size="sm" variant="warning" onClick={() => setShowAlert(true)}>{'Details?'}</Button>}
                <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.priceHref} variant="dark">{'All Price%'}</Button>
                <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.forecastHref} variant="outline-dark">{'All Forecast'}</Button>
            </Row>
            <Row className="mt-1 ml-1">
                <Alert show={showAlert} variant="warning">
                    <Alert.Heading>{'How to get Stock Details?'}</Alert.Heading>
                    <p>
                        {'Click the below table row to get!'}
                    </p>
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => setShowAlert(false)} variant="outline-success">
                            {'Close!'}
                        </Button>
                    </div>
                </Alert>
            </Row>
            <StockInfoTable tableSize="sm" tableHeader={settings.holding.tableHeader} tableData={settings.holding.tableData} sortItem={sortItem} cellClick={cellClick} />
            <Doughnut data={settings.pieData} />
        </Fragment >
    )
}

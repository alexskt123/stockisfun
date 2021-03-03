
import { Fragment, useState, useEffect } from 'react'
import { sortTableItem } from '../lib/commonFunction'
import StockInfoTable from './Page/StockInfoTable'
import { etfListSettings } from '../config/stock'
import { Badge, Row } from 'react-bootstrap'

function ETFList({ inputSettings }) {

    const [settings, setSettings] = useState({ ...etfListSettings })
    const [ascSort, setAscSort] = useState(false)

    const cellClick = async (_item) => {

    }

    async function handleSettings(inputSettings) {
        setSettings(inputSettings)
    }

    useEffect(async () => {
        await clearItems()
        await handleSettings(inputSettings)
    }, [inputSettings])

    const sortItem = async (index) => {
        setSettings({
            ...settings,
            etfList: { ...settings.etfList, tableData: await sortTableItem(settings.etfList.tableData, index, ascSort) }
        })
        setAscSort(!ascSort)
    }

    const clearItems = async () => {
        setSettings({ ...etfListSettings })
    }

    return (
        <Fragment>
            <Row className="ml-1 mt-3">
                <h5>
                    <Badge variant="dark">{'No. of ETF Count: '}</Badge>
                </h5>
                <h5>
                    <Badge variant="light" className="ml-2">{settings.etfCount}</Badge>
                </h5>
            </Row>
            <StockInfoTable tableSize="sm" cellClick={cellClick} striped={true} tableHeader={settings.etfList.tableHeader} tableData={settings.etfList.tableData} sortItem={sortItem} />
        </Fragment>
    )
}

export default ETFList

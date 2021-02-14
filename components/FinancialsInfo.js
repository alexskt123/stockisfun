
import { Fragment, useState, useEffect } from 'react'

import { getFinancialsInfo, sortTableItem, financialsSettingSchema } from '../lib/commonFunction'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from './StockInfoTable'

function FinancialsInfo({ inputSettings, inputTickers }) {

    const [settings, setSettings] = useState(financialsSettingSchema)
    const [loading, setLoading] = useState(false)

    async function handleTickers() {

        setLoading(true)

        if (inputSettings) {
            setSettings(inputSettings)
        } else if (inputTickers) {
            await clearItems()
            const financialsInfo = await getFinancialsInfo(inputTickers, financialsSettingSchema)
            setSettings(financialsInfo)
        }

        setLoading(false)
    }

    useEffect(() => {
        handleTickers()
    }, [inputSettings, inputTickers])

    const sortItem = async (index) => {
        setSettings({
            ...settings,
            stockInfo: await sortTableItem(settings.stockInfo, index, settings.ascSort),
            ascSort: !settings.ascSort
        })
    }

    const clearItems = async () => {
        setSettings({
            ...settings,
            tickers: [],
            tableHeader: [],
            stocInfo: []
        })
    }

    return (
        <Fragment>
            {loading ?
                <LoadingSpinner /> : ''
            }
            <StockInfoTable tableHeader={settings.tableHeader} tableData={settings.stockInfo} sortItem={sortItem} />
        </Fragment>
    )
}

export default FinancialsInfo

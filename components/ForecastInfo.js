
import { Fragment, useState, useEffect } from 'react'

import { getForecastInfo, sortTableItem, forecastSettingSchema } from '../lib/commonFunction'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from './StockInfoTable'

function PriceInfo({ inputSettings, inputTickers }) {

    const [settings, setSettings] = useState(forecastSettingSchema)
    const [loading, setLoading] = useState(false)

    async function handleTickers() {

        setLoading(true)

        if (inputSettings) {
            setSettings(inputSettings)
        } else if (inputTickers) {
            await clearItems()
            const forecastInfo = await getForecastInfo(inputTickers, forecastSettingSchema)
            setSettings(forecastInfo)
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
            <StockInfoTable tableFirstHeader={['', 'WalletInvestor', '', '', '', '', 'Financhill', 'MoneyCnn', '', '', '', 'Yahoo']} tableHeader={settings.tableHeader} tableData={settings.stockInfo} sortItem={sortItem} />
        </Fragment>
    )
}

export default PriceInfo

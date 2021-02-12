
import { Fragment, useState, useEffect } from 'react'

import { getForecastInfo, sortTableItem, forecastSettingSchema } from '../lib/commonFunction'
import StockInfoTable from './StockInfoTable'

function PriceInfo({ inputSettings, inputTickers }) {

    const [settings, setSettings] = useState(forecastSettingSchema)

    async function handleTickers() {

        if (inputSettings) {
            setSettings(inputSettings)
        } else if (inputTickers) {
            await clearItems()
            const forecastInfo = await getForecastInfo(inputTickers, forecastSettingSchema)
            setSettings(forecastInfo)
        }
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
            <StockInfoTable tableFirstHeader={['', 'WalletInvestor', '', '', '', '', 'Financhill', 'MoneyCnn', '', '', '', 'Yahoo']} tableHeader={settings.tableHeader} tableData={settings.stockInfo} sortItem={sortItem} />
        </Fragment>
    )
}

export default PriceInfo

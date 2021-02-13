
import { Fragment, useState, useEffect } from 'react'

import { getPriceInfo, sortTableItem, priceSettingSchema } from '../lib/commonFunction'
import StockInfoTable from '../components/StockInfoTable'
import { Line } from 'react-chartjs-2';
import { dateRange } from '../config/price'

function PriceInfo({ inputSettings, inputTickers }) {

    const [settings, setSettings] = useState(priceSettingSchema)

    async function handleTickers() {

        // console.log(inputSettings)

        if (inputSettings) {
            setSettings(inputSettings)
        } else if (inputTickers && inputTickers.length <= 0) {
            await clearItems()
        }
        else if (inputTickers) {
            await clearItems()
            const priceInfo = await getPriceInfo(inputTickers, priceSettingSchema)
            setSettings(priceInfo)
        }
    }

    useEffect(() => {
        handleTickers()
    }, [inputSettings, inputTickers])

    const sortItem = async (index) => {
        setSettings({
            ...settings,
            yearlyPcnt: await sortTableItem(settings.yearlyPcnt, index, settings.ascSort),
            ascSort: !settings.ascSort
        })
    }

    const clearItems = async () => {
        setSettings({
          ...settings,
          tickers: [],
          yearlyPcnt: [],
          quote: [],
          chartData: { 'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
        })
      }

    return (
        <Fragment>
            <StockInfoTable tableHeader={settings.tableHeader} tableData={settings.yearlyPcnt} sortItem={sortItem} />
            <Line data={settings.chartData} />
        </Fragment>
    )
}

export default PriceInfo


import { Fragment, useState, useEffect } from 'react'

import { getPriceInfo, sortTableItem, priceSettingSchema } from '../lib/commonFunction'
import StockInfoTable from '../components/StockInfoTable'
import { Line } from 'react-chartjs-2';
import { dateRange } from '../config/price'
import LoadingSpinner from './Loading/LoadingSpinner';

function PriceInfo({ inputSettings, inputTickers }) {

    const [settings, setSettings] = useState(priceSettingSchema)
    const [loading, setLoading] = useState(false)

    async function handleTickers() {

        // console.log(inputSettings)

        setLoading(true)
        await clearItems()

        if (inputSettings) {
            setSettings(inputSettings)
        } else if (inputTickers) {
            const priceInfo = await getPriceInfo(inputTickers, priceSettingSchema)
            setSettings(priceInfo)
        }

        setLoading(false)
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
            {loading ?
                <LoadingSpinner /> : ''
            }            
            <StockInfoTable tableHeader={settings.tableHeader} tableData={settings.yearlyPcnt} sortItem={sortItem} />
            <Line data={settings.chartData} />
        </Fragment>
    )
}

export default PriceInfo

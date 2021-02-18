
import { Fragment, useState, useEffect } from 'react'

import { getPriceInfo, sortTableItem, priceSettingSchema } from '../lib/commonFunction'
import StockInfoTable from './Page/StockInfoTable'
import { Line } from 'react-chartjs-2';
import { dateRange, dateRangeByNoOfYears } from '../config/price'
import LoadingSpinner from './Loading/LoadingSpinner';

function PriceInfo({ inputSettings, inputTickers, inputYear }) {

    const [settings, setSettings] = useState(inputTickers ? priceSettingSchema : inputSettings)
    const [newDateRange, setNewDateRange] = useState(dateRange)
    const [loading, setLoading] = useState(false)

    async function handleTickers() {

        let noOfYears = 15
        if (inputYear) noOfYears = inputYear
        
        const newDateRange = await dateRangeByNoOfYears(inputYear)
        setNewDateRange(newDateRange)

        setLoading(true)

        if (inputSettings) {
            setSettings(inputSettings)
        } else if (inputTickers) {
            await clearItems()
            const priceInfo = await getPriceInfo(inputTickers, noOfYears, priceSettingSchema)
            setSettings(priceInfo)
        } else if (inputTickers.length <= 0) {
            await clearItems()
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
          chartData: { 'labels': [...newDateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
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

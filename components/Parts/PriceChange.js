import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import { loadingSkeletonTableChart } from '@/config/settings'
import { sortTableItem, priceSettingSchema } from '@/lib/commonFunction'
import { getPriceInfo } from '@/lib/stockInfo'
import { Line } from 'react-chartjs-2'

import QuoteCard from './QuoteCard'
import ValidTickerAlert from './ValidTickerAlert'

function PriceChange({ inputTickers, inputYear }) {
  const [settings, setSettings] = useState(priceSettingSchema)
  const [loading, setLoading] = useState(false)

  async function handleTickers() {
    setLoading(true)

    const noOfYears = inputYear ? inputYear : 15

    clearItems()
    const priceInfo = await getPriceInfo(
      inputTickers,
      noOfYears,
      priceSettingSchema
    )
    setSettings(priceInfo)

    setLoading(false)
  }

  const sortItem = async index => {
    setSettings({
      ...settings,
      yearlyPcnt: await sortTableItem(
        settings.yearlyPcnt,
        index,
        settings.ascSort
      ),
      ascSort: !settings.ascSort
    })
  }

  useEffect(() => {
    ;(async () => {
      await handleTickers()
    })()
    return () => setSettings(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputTickers])

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: [],
      yearlyPcnt: [],
      quote: [],
      chartData: {}
    })
  }

  return (
    <Fragment>
      {loading ? (
        <LoadingSkeletonTable customSettings={loadingSkeletonTableChart} />
      ) : inputTickers.length > 0 && !loading ? (
        <Fragment>
          <StockInfoTable
            tableSize="sm"
            tableHeader={settings.tableHeader}
            tableData={settings.yearlyPcnt}
            sortItem={sortItem}
          />
          <QuoteCard
            inputTicker={inputTickers}
            isShow={true}
            minWidth={'20rem'}
            noClose={true}
          >
            <Line data={settings.chartData} />
          </QuoteCard>
        </Fragment>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

export default PriceChange

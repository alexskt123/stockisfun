import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { staticSWROptions, fetcher } from '@/config/settings'
import { getEarningsData } from '@/lib/stockInfo'
import { Bar } from 'react-chartjs-2'
import useSWR from 'swr'

export default function Earnings({ inputTicker }) {
  const [settings, setSettings] = useState({})

  const { data } = useSWR(
    `/api/yahoo/getEarnings?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  function handleEarnings(data) {
    const { earnings } = getEarningsData(data)
    setSettings(earnings)
  }

  useEffect(() => {
    handleEarnings(data)
    return () => setSettings({})
  }, [data])

  return (
    <Fragment>
      {!data ? (
        <LoadingSkeletonTable />
      ) : data?.length > 0 ? (
        <Fragment>
          <StockInfoTable
            tableSize="sm"
            tableHeader={settings.tableHeader}
            tableData={settings.tableData}
          />
          <QuoteCard
            inputTicker={inputTicker}
            isShow={true}
            minWidth={'20rem'}
            noClose={true}
          >
            <Bar data={settings.chartData} options={settings.chartOptions} />
          </QuoteCard>
        </Fragment>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { loadingSkeletonTableChart } from '@/config/settings'
import { useStaticSWR } from '@/lib/request'
import { getEarningsData } from '@/lib/stockInfo'
import { Bar } from 'react-chartjs-2'

export default function Earnings({ inputTicker }) {
  const [settings, setSettings] = useState({})

  const { data } = useStaticSWR(
    inputTicker,
    `/api/yahoo/getEarnings?ticker=${inputTicker}`
  )

  function handleEarnings(data) {
    const { earnings } = getEarningsData(data?.result)
    setSettings(earnings)
  }

  useEffect(() => {
    handleEarnings(data)
    return () => setSettings({})
  }, [data])

  return (
    <Fragment>
      {!data && inputTicker ? (
        <LoadingSkeletonTable customSettings={loadingSkeletonTableChart} />
      ) : data?.result?.length > 0 ? (
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

import { Fragment, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import { staticSWROptions, fetcher } from '../../../config/settings'

import useSWR from 'swr'
import StockInfoTable from '../../Page/StockInfoTable'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import QuoteCard from '../../../components/Parts/QuoteCard'

import { getYahooEarnings } from '../../../lib/stockDetailsFunction'

export default function Earnings({ inputTicker }) {
  const [settings, setSettings] = useState({})

  const { data } = useSWR(
    `/api/yahoo/getYahooEarnings?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  function handleEarnings(data) {
    const { earnings } = getYahooEarnings(data)
    setSettings(earnings)
  }

  useEffect(() => {
    handleEarnings(data)
    return () => setSettings({})
  }, [data])

  return (
    <Fragment>
      {!data ? (
        <LoadingSpinner />
      ) : data && data.length > 0 ? (
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
      ) : null}
    </Fragment>
  )
}

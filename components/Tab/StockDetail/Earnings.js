import { Fragment, useEffect, useState } from 'react'

import { Bar } from 'react-chartjs-2'
import useSWR from 'swr'

import QuoteCard from '../../../components/Parts/QuoteCard'
import { staticSWROptions, fetcher } from '../../../config/settings'
import { getYahooEarnings } from '../../../lib/stockDetailsFunction'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import StockInfoTable from '../../Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

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

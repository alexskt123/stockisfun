import { Fragment, useEffect, useState } from 'react'

import { Bar } from 'react-chartjs-2'
import useSWR from 'swr'

import QuoteCard from '../../../components/Parts/QuoteCard'
import { staticSWROptions, fetcher } from '../../../config/settings'
import { getBalanceSheetTableData } from '../../../lib/stockDetailsFunction'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import StockInfoTable from '../../Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

export default function BalanceSheet({ inputTicker }) {
  const [settings, setSettings] = useState({})

  const { data } = useSWR(
    `/api/yahoo/getYahooBalanceSheet?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  function handleBalanceSheet(data) {
    const balanceSheetData = getBalanceSheetTableData(data)
    setSettings(balanceSheetData)
  }

  useEffect(() => {
    handleBalanceSheet(data)
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
            tableDataSkipRow={settings.tableDataSkipRow}
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

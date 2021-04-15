
import { Fragment, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import { staticSWROptions, fetcher } from '../../../config/settings'

import useSWR from 'swr'
import StockInfoTable from '../../Page/StockInfoTable'
import LoadingSpinner from '../../Loading/LoadingSpinner'

import { getBalanceSheetTableData } from '../../../lib/stockDetailsFunction'

export default function BalanceSheet({ inputTicker }) {
  const [settings, setSettings] = useState({})

  const { data } = useSWR(`/api/yahoo/getYahooBalanceSheet?ticker=${inputTicker}`, fetcher, staticSWROptions)

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
      {data ? <Fragment>
        <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.tableData} tableDataSkipRow={settings.tableDataSkipRow} />
        <Bar data={settings.chartData} options={settings.chartOptions} />
      </Fragment> : <LoadingSpinner />}
    </Fragment>
  )
}
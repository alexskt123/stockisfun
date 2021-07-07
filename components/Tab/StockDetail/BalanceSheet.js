import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { staticSWROptions, fetcher } from '@/config/settings'
import { getBalanceSheetTableData } from '@/lib/stockDetailsFunction'
import { Bar } from 'react-chartjs-2'
import useSWR from 'swr'

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
        <LoadingSkeletonTable />
      ) : data?.length > 0 ? (
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

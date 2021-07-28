import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { loadingSkeletonTableChart } from '@/config/settings'
import { useStaticSWR } from '@/lib/request'
import { getBalanceSheetTableData } from '@/lib/stockInfo'
import { Bar } from 'react-chartjs-2'

export default function BalanceSheet({ inputTicker }) {
  const [settings, setSettings] = useState({})

  const { data } = useStaticSWR(
    inputTicker,
    `/api/yahoo/getBalanceSheet?ticker=${inputTicker}`
  )

  function handleBalanceSheet(data) {
    const balanceSheetData = getBalanceSheetTableData(data?.result)
    setSettings(balanceSheetData)
  }

  useEffect(() => {
    handleBalanceSheet(data)
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

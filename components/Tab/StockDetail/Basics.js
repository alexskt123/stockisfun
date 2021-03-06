import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { staticSWROptions, fetcher } from '@/config/settings'
import { getBasics } from '@/lib/stockInfo'
import useSWR from 'swr'

export default function Basics({ inputTicker }) {
  const defaultBasics = {
    basics: {
      tableHeader: [],
      tableData: []
    },
    officers: {
      tableHeader: [],
      tableData: []
    }
  }

  const [settings, setSettings] = useState({ ...defaultBasics })

  const { data } = useSWR(
    () => inputTicker && `/api/yahoo/getYahooBasics?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  function handleBasics(data) {
    const basics = getBasics(data?.result)

    setSettings({
      ...settings,
      ...basics
    })
  }

  useEffect(() => {
    handleBasics(data)
    return () => setSettings(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Fragment>
      {inputTicker && !data ? (
        <LoadingSkeletonTable />
      ) : data?.result ? (
        <Fragment>
          <StockInfoTable
            tableSize="sm"
            tableHeader={settings.basics.tableHeader}
            tableData={settings.basics.tableData}
          />
          <StockInfoTable
            tableSize="sm"
            className="mt-2"
            tableHeader={settings.officers.tableHeader}
            tableData={settings.officers.tableData}
          />
        </Fragment>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

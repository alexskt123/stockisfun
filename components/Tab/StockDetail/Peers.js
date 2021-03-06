import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { peersHeader, initSettings } from '@/config/peers'
import { staticSWROptions, fetcher } from '@/config/settings'
import useSWR from 'swr'

export default function Peers({ inputTicker }) {
  const [settings, setSettings] = useState({ ...initSettings })

  const { data } = useSWR(
    () => inputTicker && `/api/moneycnn/getPeers?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  function handleQuote(data) {
    const peers = (data?.result || []).reduce(
      (acc, cur) => {
        acc.tableHeader = [...peersHeader]
        acc.tableData.push([...peersHeader.map(item => cur[item])])
        return acc
      },
      { tableHeader: [], tableData: [] }
    )

    setSettings(peers)
  }

  useEffect(() => {
    handleQuote(data)
    return () => setSettings({ ...initSettings })
  }, [data])

  return (
    <Fragment>
      {!data && inputTicker ? (
        <LoadingSkeletonTable />
      ) : data?.result?.length > 0 ? (
        <StockInfoTable
          tableSize="sm"
          tableHeader={settings.tableHeader}
          tableData={settings.tableData}
        />
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

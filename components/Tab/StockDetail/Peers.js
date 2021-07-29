import { Fragment, useEffect, useState } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { peersHeader, initSettings } from '@/config/peers'
import { useStaticSWR } from '@/lib/request'

export default function Peers({ inputTicker }) {
  const [settings, setSettings] = useState({ ...initSettings })

  const { data } = useStaticSWR(
    inputTicker,
    `/api/moneycnn/getPeers?ticker=${inputTicker}`
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

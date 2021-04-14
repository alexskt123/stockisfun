
import { Fragment, useEffect, useState } from 'react'

import { peersHeader, initSettings } from '../../../config/peers'
import { staticSWROptions, fetcher } from '../../../config/settings'

import useSWR from 'swr'
import StockInfoTable from '../../Page/StockInfoTable'
import LoadingSpinner from '../../Loading/LoadingSpinner'

export default function Peers ({ inputTicker }) {
  const [settings, setSettings] = useState({ ...initSettings })

  const { data } = useSWR(`/api/moneycnn/getPeers?ticker=${inputTicker}`, fetcher, staticSWROptions)

  function handleQuote(data) {
    const peers = (data || []).reduce((acc, cur) => {
      acc.tableHeader = [...peersHeader]
      acc.tableData.push([...peersHeader.map(item => cur[item])])
      return acc
    }, { tableHeader: [], tableData: [] })

    setSettings(peers)
  }

  useEffect(() => {
    handleQuote(data)
    return () => setSettings({ ...initSettings })
  }, [data])

  return (
    <Fragment>
      {data ? <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.tableData} /> : <LoadingSpinner />}
    </Fragment>
  )
}
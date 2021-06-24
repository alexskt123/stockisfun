import { Fragment, useEffect, useState } from 'react'

import { staticSWROptions, fetcher } from '../../../config/settings'

import useSWR from 'swr'
import StockInfoTable from '../../Page/StockInfoTable'
import LoadingSpinner from '../../Loading/LoadingSpinner'

import { getBasics } from '../../../lib/stockDetailsFunction'

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
    `/api/yahoo/getYahooBasics?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  function handleBasics(data) {
    const basics = getBasics(data)

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
      {!data ? (
        <LoadingSpinner />
      ) : data.Name ? (
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
      ) : null}
    </Fragment>
  )
}

import { Fragment, useState, useEffect } from 'react'

import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import useSWR from 'swr'

import { staticSWROptions, fetcher } from '../../../config/settings'
import { etfListSettings } from '../../../config/stock'
import { sortTableItem } from '../../../lib/commonFunction'
import { getETFList } from '../../../lib/stockDetailsFunction'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import StockInfoTable from '../../Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

function ETFList({ inputTicker }) {
  const { data } = useSWR(
    `/api/etfdb/getETFListByTicker?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  const [settings, setSettings] = useState({ ...etfListSettings })
  const [ascSort, setAscSort] = useState(false)

  const handleSettings = data => {
    const { etfCount, etfList } = data || {}

    const etfListToTableData = getETFList(etfList)
    setSettings({
      etfCount,
      etfList: { ...etfListToTableData }
    })
  }

  useEffect(() => {
    handleSettings(data)
  }, [data])

  const sortItem = async index => {
    setSettings({
      ...settings,
      etfList: {
        ...settings.etfList,
        tableData: await sortTableItem(
          settings.etfList.tableData,
          index,
          ascSort
        )
      }
    })
    setAscSort(!ascSort)
  }

  return !data ? (
    <LoadingSpinner />
  ) : data && data.etfCount !== 'N/A' ? (
    <Fragment>
      <Row className="ml-1 mt-3">
        <h5>
          <Badge variant="dark">{'No. of ETF Count: '}</Badge>
        </h5>
        <h5>
          <Badge variant="light" className="ml-2">
            {settings.etfCount}
          </Badge>
        </h5>
      </Row>
      <StockInfoTable
        tableSize="sm"
        striped={true}
        tableHeader={settings.etfList.tableHeader}
        tableData={settings.etfList.tableData}
        sortItem={sortItem}
      />
    </Fragment>
  ) : (
    <ValidTickerAlert />
  )
}

export default ETFList

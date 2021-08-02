import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { etfListSettings } from '@/config/stock'
import { sortTableItem } from '@/lib/commonFunction'
import { useStaticSWR } from '@/lib/request'
import { getETFList } from '@/lib/stockInfo'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

function ETFList({ inputTicker }) {
  const { data } = useStaticSWR(
    inputTicker,
    `/api/etfdb/getETFListByTicker?ticker=${inputTicker}`
  )

  const [settings, setSettings] = useState({ ...etfListSettings })
  const [ascSort, setAscSort] = useState(false)

  const handleSettings = data => {
    const { etfCount, etfList } = data?.result || {}

    const etfListToTableData = getETFList(etfList)
    setSettings({
      etfCount,
      etfList: { ...etfListToTableData }
    })
  }

  useEffect(() => {
    handleSettings(data)
  }, [data])

  const sortItem = index => {
    setSettings({
      ...settings,
      etfList: {
        ...settings.etfList,
        tableData: sortTableItem(settings.etfList.tableData, index, ascSort)
      }
    })
    setAscSort(!ascSort)
  }

  return !data && inputTicker ? (
    <LoadingSkeletonTable />
  ) : data?.result ? (
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

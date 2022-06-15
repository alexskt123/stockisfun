import { Fragment, useState, useEffect } from 'react'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { etfListSettings } from '@/config/stock'
import { sortTableItem } from '@/lib/commonFunction'
import { useStaticSWR } from '@/lib/request'
import { getETFList } from '@/lib/stockInfo'

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
        <Col xs="auto">
          <HeaderBadge
            headerTag={'h5'}
            title={'No. of ETF Count: '}
            badgeProps={{ bg: 'dark' }}
          />
        </Col>
        <Col xs="auto">
          <HeaderBadge
            headerTag={'h5'}
            title={settings.etfCount}
            badgeProps={{ bg: 'light', text: 'dark', className: 'ml-2' }}
          />
        </Col>
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

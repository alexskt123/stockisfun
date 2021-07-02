import { Fragment, useEffect, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import SWRTable from '@/components/Page/SWRTable'
import { keyInfoTableHeaderList, keyForecastInfoHeader } from '@/config/profile'
import { staticSWROptions } from '@/config/settings'
import Badge from 'react-bootstrap/Badge'

const StockHighlight = ({ boughtListData }) => {
  const [stockList, setStockList] = useState([])

  useEffect(() => {
    if (!boughtListData?.boughtList) return

    setStockList(
      boughtListData.boughtList
        .filter(item => item.type === 'EQUITY')
        .map(item => item.ticker)
    )

    return () => {
      setStockList([])
    }
  }, [boughtListData])

  return (
    <Fragment>
      <h5>
        <Badge variant="dark" className={'mt-4'}>
          {'Stock Revenue/Net Income Highlight'}
        </Badge>
      </h5>
      {stockList?.length > 0 ? (
        <SWRTable
          requests={stockList.map(x => ({
            request: `/api/getIndexQuote?ticker=${x}`,
            key: x
          }))}
          options={{
            tableHeader: keyInfoTableHeaderList,
            tableSize: 'sm',
            SWROptions: staticSWROptions
          }}
        />
      ) : (
        <GooeySpinner />
      )}
      <h5>
        <Badge variant="dark" className={'mt-4'}>
          {'Stock Forecast'}
        </Badge>
      </h5>
      {stockList?.length > 0 ? (
        <SWRTable
          requests={stockList.map(x => ({
            request: `/api/forecast/getKeyInfo?ticker=${x}`,
            key: x
          }))}
          options={{
            tableHeader: keyForecastInfoHeader,
            tableSize: 'sm',
            SWROptions: staticSWROptions
          }}
        />
      ) : (
        <GooeySpinner />
      )}
    </Fragment>
  )
}

export default StockHighlight

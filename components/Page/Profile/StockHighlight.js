import { Fragment, useEffect, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import SWRTable from '@/components/Page/SWRTable'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import { keyInfoTableHeaderList, keyForecastInfoHeader } from '@/config/profile'
import { staticSWROptions } from '@/config/settings'

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
      <HeaderBadge
        headerTag={'h5'}
        title={'Stock Revenue/Net Income Highlight'}
        badgeProps={{ variant: 'dark' }}
      />
      {stockList?.length > 0 ? (
        <SWRTable
          requests={stockList.map(x => ({
            request: `/api/page/getIndexQuote?ticker=${x}`,
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
      <HeaderBadge
        headerTag={'h5'}
        title={'Stock Forecast'}
        badgeProps={{ variant: 'dark', className: 'mt-4' }}
      />
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

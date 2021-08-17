import { Fragment, useEffect, useState } from 'react'

import CompareSWR from '@/components/Parts/CompareSWR'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import { keyInfoTableHeaderList, keyForecastInfoHeader } from '@/config/profile'

const StockHighlight = ({ boughtListData }) => {
  const [stockList, setStockList] = useState([])

  useEffect(() => {
    boughtListData?.boughtList &&
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
      <CompareSWR
        inputTickers={stockList}
        url={'/api/page/getIndexQuote'}
        customOptions={{
          tableHeader: keyInfoTableHeaderList
        }}
      />
      <HeaderBadge
        headerTag={'h5'}
        title={'Stock Forecast'}
        badgeProps={{ variant: 'dark', className: 'mt-4' }}
      />
      <CompareSWR
        inputTickers={stockList}
        url={'/api/forecast/getKeyInfo'}
        customOptions={{
          tableHeader: keyForecastInfoHeader
        }}
      />
    </Fragment>
  )
}

export default StockHighlight

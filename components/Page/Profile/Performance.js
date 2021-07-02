import { Fragment, useEffect, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import TrendBarChart from '@/components/Parts/TrendBarChart'
import Badge from 'react-bootstrap/Badge'

const Performance = ({ boughtListData }) => {
  const [stockList, setStockList] = useState([])

  useEffect(() => {
    if (!boughtListData?.boughtList) return

    const total = boughtListData.boughtList.reduce((acc, cur) => {
      return acc + cur.sum
    }, 0)

    const boughtList = boughtListData.boughtList.map(item => {
      return {
        ...item,
        pcnt: item.sum / total
      }
    })

    setStockList(boughtList)

    return () => {
      setStockList([])
    }
  }, [boughtListData])

  return (
    <Fragment>
      <h5>
        <Badge variant="dark" className={'mt-4'}>
          {'Performance'}
        </Badge>
      </h5>
      {stockList ? (
        <TrendBarChart
          input={stockList.map(item => ({
            label: item.ticker,
            ticker: item.ticker
          }))}
        />
      ) : (
        <GooeySpinner />
      )}
    </Fragment>
  )
}

export default Performance

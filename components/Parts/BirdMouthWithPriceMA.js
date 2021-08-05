import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import BirdMouth from '@/components/Parts/BirdMouth'
import { toAxios } from '@/lib/request'

const BirdMouthWithPriceMA = ({ inputTickers }) => {
  const [tableSettings, setTableSettings] = useState({
    tableHeader: [],
    tableData: []
  })
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setTableSettings({
        tableHeader: [],
        tableData: []
      })
      if (inputTickers?.length > 0) {
        setTableLoading(true)

        const priceMAInfo = await Promise.all(
          inputTickers.map(async item => {
            const response = await toAxios('/api/getPriceMADetails', {
              ticker: item
            })
            const { data } = response
            return data
          })
        )

        const tableHeader =
          priceMAInfo.length > 0
            ? [
                'Ticker',
                ...(priceMAInfo
                  ?.find(x => x)
                  ?.priceMAList?.map(item => item.id) || [])
              ]
            : []
        const tableData = priceMAInfo
          .map(item => {
            return [
              item.ticker,
              ...item.priceMAList.map(ma => {
                return ma.tickersInfo.length > 0 ? 'Yes' : ''
              })
            ]
          })
          .filter(item => item.find(x => x.includes('Yes')))
        const tableHeaderData = {
          tableHeader,
          tableData
        }
        setTableSettings(tableHeaderData)
        setTableLoading(false)
      }
    })()
  }, [inputTickers])

  return (
    <Fragment>
      {tableLoading ? (
        <LoadingSkeletonTable />
      ) : (
        <StockInfoTable
          tableSize="sm"
          tableHeader={tableSettings.tableHeader}
          tableData={tableSettings.tableData}
        />
      )}
      <BirdMouth
        input={inputTickers?.map(item => ({
          label: item,
          ticker: item
        }))}
      />
    </Fragment>
  )
}

export default BirdMouthWithPriceMA

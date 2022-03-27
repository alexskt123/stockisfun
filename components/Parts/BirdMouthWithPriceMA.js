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

  const conditionMatches = (id, priceMAList) => {
    const matches = !!priceMAList.find(
      x => x.id === id && x.tickersInfo.length > 0
    )

    return matches
  }

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
                'Price Not Avail.',
                'RS>0',
                '85D High',
                '20>50 & 50>150',
                '20>50 & 50<150'
              ]
            : []
        const tableData = priceMAInfo
          .map(item => {
            const twentyHigherFifty = conditionMatches(
              '20>50',
              item.priceMAList
            )
            const fiftyHigherHundredFifty = conditionMatches(
              '50>150',
              item.priceMAList
            )
            const fiftyLowerHundredFifty = conditionMatches(
              '50<150',
              item.priceMAList
            )
            return [
              item.ticker,
              !item.priceAvail ? 'Yes' : '',
              item.rs > 0 ? 'Yes' : '',
              item.latestHigherInputRange ? 'Yes' : '',
              twentyHigherFifty && fiftyHigherHundredFifty ? 'Yes' : '',
              twentyHigherFifty && fiftyLowerHundredFifty ? 'Yes' : ''
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

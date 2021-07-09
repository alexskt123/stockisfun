import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import TickerInput from '@/components/Page/TickerInput'
import BirdMouth from '@/components/Parts/BirdMouth'
import {
  forecastSettingSchema,
  handleDebounceChange,
  handleFormSubmit,
  toAxios
} from '@/lib/commonFunction'
import { useQuery } from '@/lib/hooks/useQuery'
import { useRouter } from 'next/router'

export default function CompareBirdMouth() {
  const router = useRouter()
  const { query } = router.query

  const [settings, setSettings] = useState(forecastSettingSchema)
  const [tableSettings, setTableSettings] = useState({
    tableHeader: [],
    tableData: []
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const handleChange = e => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: []
    })
    setTableSettings({ tableHeader: [], tableData: [] })
    router.push(router.pathname)
  }

  const handleTickers = inputTickers => {
    setSettings({
      ...settings,
      tickers: inputTickers
    })

    handleTable(inputTickers)
  }

  const handleSubmit = event => {
    handleFormSubmit(event, formValue, { query }, router, setValidated)
  }

  async function handleTable(input) {
    setTableLoading(true)

    const priceMAInfo = await Promise.all(
      input.map(async item => {
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
            ...(priceMAInfo?.find(x => x)?.priceMAList?.map(item => item.id) ||
              [])
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

  useQuery(handleTickers, { query })

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  aapl /  Mulitple:  aapl,tdoc,fb,gh'}
            handleChange={handleChange}
            clearItems={clearItems}
            handleTickers={handleTickers}
            tableHeader={tableSettings.tableHeader}
            tableData={tableSettings.tableData}
            exportFileName={'birdmouth.csv'}
          />
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
            input={settings.tickers.map(item => ({
              label: item,
              ticker: item
            }))}
          />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

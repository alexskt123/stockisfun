
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../../components/Layout/CustomContainer'
import TickerInput from '../../components/Page/TickerInput'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import { forecastSettingSchema, handleDebounceChange, handleFormSubmit } from '../../lib/commonFunction'
import { useQuery } from '../../lib/hooks/useQuery'
import BirdMouth from '../../components/Parts/BirdMouth'

import StockInfoTable from '../../components/Page/StockInfoTable'

const axios = require('axios').default

export default function CompareBirdMouth() {
  const router = useRouter()
  const { query } = router.query

  const [settings, setSettings] = useState(forecastSettingSchema)
  const [tableSettings, setTableSettings] = useState({ tableHeader: [], tableData: [] })
  const [ascSort, setAscSort] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const handleChange = (e) => {
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

  const handleTickers = (inputTickers) => {

    setSettings({
      ...settings,
      tickers: inputTickers
    })

    handleTable(inputTickers)
  }

  const handleSubmit = (event) => {
    handleFormSubmit(event, formValue, { query }, router, setValidated)
  }

  async function handleTable(input) {

    setTableLoading(true)

    const priceMAInfo = await Promise.all(input.map(async item => {
      const response = await axios(`/api/getPriceMADetails?ticker=${item}`)
      const { data } = response
      return data
    }))

    const tableHeader = priceMAInfo.length > 0 ? ['Ticker', ...(priceMAInfo?.find(x => x)?.priceMAList?.map(item => item.id) || [])] : []
    const tableData = priceMAInfo.map(item => {
      return [item.ticker, ...item.priceMAList.map(ma => {
        return ma.tickersInfo.length > 0 ? "Yes" : ""
      })]
    })
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
          {
            tableLoading ? <LoadingSpinner />
              : <StockInfoTable tableSize="sm" tableHeader={tableSettings.tableHeader} tableData={tableSettings.tableData} />
          }
          <BirdMouth input={settings.tickers.map(item => ({ label: item, ticker: item }))} />
        </Fragment >
      </CustomContainer>
    </Fragment >
  )
}
